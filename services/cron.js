/*
  #!/usr/local/bin/node
  -*- coding:utf-8 -*-
 
  Copyright 2013 freedom Inc. All Rights Reserved.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ---
  Created with Sublime Text 2.
  Date: Jan 2, 2014
  Time: 5:02 PM
  Desc: the service of cron
 */

var cronJob = require('cron').CronJob;//定时任务
var xlsx = require("node-xlsx");
var mailService = require("./mail");//邮件服务
var Limitation = require("../proxy/limitation");//限制
var exec = require("child_process").exec;//执行子进程
var util = require("../libs/util");
var pathParser = require("path");
var config = require("../config").initConfig();

/**
 * 启动限制性的邮件通知
 * @param  {Function} callback the cb func
 * @return {null}
 */
function startLimatationMailNotification(cronPattern, callback)
{
    debugService("/services/cron/startLimatationMailNotification");
    //任务时间模式
    var timePattern = cronPattern || "00 00 10 * * 1-5";
    var job = mCronGenerator(timePattern, mMailTask);
    job.start();//启动定时器
};

/***
 *定时邮件任务
 ***/
function mMailTask()
{
    mGenGiftLimitationExcel(function onXlsxBuilt(execelBuffer)//表格构建完成后回调
    {
        var mailOpts =//
            {
                subject: "Gift limitation notification",
                attachments: //要发送的附件
                    [
                        {//
                            fileName: "giftLimitationNotification.xlsx",
                            contents: execelBuffer//将表格作为邮件附件
                        }
                    ]
            }
        mailService.sendMail(mailOpts);
    });
}

/**
 * 启动数据备份服务
 * @param  {String}   timerPattern 定时模式
 * @param  {Function} callback    the cb func
 * @return {null}
 */
function startDBBackupService(timerPattern)
{
    debugService("/services/cron/startDBBackupService");
    var time = timerPattern || "00 00 23 * * *";
    /*定时备份任务*/
    var job = mCronGenerator(time, mBackupTask);
    job.start();
};

/**
 * start push db back up file with mail service
 * @param  {String}   cronPattern the cron job pattern
 * @param  {Function} callback    the cb func
 * @return {null}
 */
exports.startPushDBBackupFileService = function (cronPattern, callback)
{
    debugService("/services/cron/startPushDBBackupFileService");

    var cp = cronPattern || "00 30 23 */3 * *";
    var job = mCronGenerator(cp, function ()
    {
        var backupFile = pathParser.resolve(__dirname, "../backup/", new Date().format("yyyy_MM_dd") + ".sql");
        mailService.sendMail({
            subject: "DB backup Mail",
            attachments: [
                {
                    filePath: backupFile
                }
            ]
        });
    });

    job.start();
};

/**
 * 定时任务生成器
 * @param  {String}   cronPattern 定时模式
 * @param  {Function} task 定时任务
 * @return {Object}     任务对象
 */
function mCronGenerator(cronPattern, task)
{
    var timePattern = cronPattern || "00 00 10 * * 1-5";
    var jobOpts =//
        {
            cronTime: timePattern,//时间
            onTick: task,//任务
            start: false,//暂时不启动
        }
    var job = new cronJob(jobOpts);//新建定时任务对象
    return job;
}

/***
 *定时备份任务
 ***/
function mBackupTask()
{
    var backupFile = pathParser.resolve(__dirname, "../backup/", new Date().format("yyyy_MM_dd") + ".sql");
    /*备份命令*/
    var cmd = mMakeBackupCMD(backupFile);
    //执行命令行任务
    exec(cmd, mOnExecDone);
}

/***
 *exec完成回调
 ***/
function mOnExecDone(err, stdout, stderr)
{
    if (err)
    {
        debugService(err);
    }

    debugService(stdout);
}

/***
 *备份命令
 ***/
function mMakeBackupCMD(backupFile)
{
    //mysql的dump备份
    var cmd = "mysqldump -h{0} -u{1} -p{2} fixedAsset > {3}";// > 重定向
    var host = config.mysqlConfig.host;
    var user = config.mysqlConfig.user;
    var psd = config.mysqlConfig.password;
    cmd.format(host, user, psd, backupFile);
    return cmd;
}


/**
 * 生成定时任务表格
 * @param  {Function} onXlsxBuilt 表格构建完成时候回调
 * @return {null}
 */
function mGenGiftLimitationExcel(onXlsxBuilt)
{
    debugService("/services/cron/generateGiftLimitationExcel");

    Limitation.getUnderLimatationGifts(function (rows)//行数据
    {
        if (rows)//行数据存在
        {
            var tableSchema = //模式
                {
                    worksheets: //工作表
                        [
                            {
                                "name": "礼品剩余数量提醒",//表名称
                                "data"://数据数组
                                    [
                                        ["礼品名称", "品牌", "价格", "剩余库存数量", "警戒线"]
                                    ]
                            }
                        ]
                };
            /*整理数据*/
            mJustifyData(tableSchema,rows);
            //生成表格模式
            var buffer = xlsx.build(tableSchema);
            onXlsxBuilt(buffer);
        }
    });
}

/***
 *整理数据
 * @param  tableSchema  {Object}  表格模式
 * @param rows {Array} 行数据数组
 ***/
function mJustifyData(tableSchema,rows)
{
    var lenOfRows=rows.length;
    for (var i = 0; i < lenOfRows; i++)//遍历行数据
    {
        var item = rows[i];
        var arr = [];
        arr.push(item.name);//名称
        arr.push(item.brand);//品牌
        arr.push(item.price);//架构
        arr.push(item.num);//库存数
        arr.push(item.limitNum);//警戒数
        //装入数据数组
        tableSchema.worksheets[0].data.push(arr);
    }
}

exports.startLimatationMailNotification = startLimatationMailNotification;//启动限制性的邮件通知
exports.startDBBackupService = startDBBackupService;//启动数据备份服务