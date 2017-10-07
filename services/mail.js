/*
  #!/usr/local/bin/node
  -*- coding:utf-8 -*-
 
  Copyright 2013 yanghua Inc. All Rights Reserved.
 
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
  User: yanghua
  Date: 25/11/13
  Time: 09:18 PM
  Desc: mail - the service of mail
 */

var mailer = require("nodemailer");
var appConfig = require("../appConfig").config;
//创建发送器
var transport = mailer.createTransport("SMTP", appConfig.mail_opts);

/**
 * 发送邮件
 * @param  {object} mailOpts 邮件参数
 * @return {null}
 */
function sendMail(mailOpts)
{
    debugService("/services/mail/sendMail");
    /*检查发送地址*/
    mCheckFromAddr(mailOpts);
    /*检查目标地址*/
    mCheckToAddr(mailOpts);

    debugService("sending mail .....");

    transport.sendMail(mailOpts, function onBack(err)//失败或成功后回调
    {
        if (err)
        {
            console.log("mail error:");
            console.log(err);
        }
    });
};

/***
 *检查发送地址
 ***/
function mCheckFromAddr(mailOpts)
{
    if (!mailOpts.hasOwnProperty("from"))
    {
        mailOpts.from = appConfig.mail_opts.auth.user;
    }
}

/***
 *检查目标地址
 ***/
function mCheckToAddr(mailOpts)
{
    if (!mailOpts.hasOwnProperty("to"))
    {
        mailOpts.to = appConfig.mailDefault_TO.join(",");
    }
}

exports.sendMail = sendMail;