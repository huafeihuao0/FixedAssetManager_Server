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
  Date: 10/10/13
  Time: 17:30 PM
  Desc: app - the server
 */

var fs = require("fs");//fs文件服务
var pathParser = require("path");//路径解析
var Loader = require("loader");//loader静态
var express = require("express");

var routes = require("./routes");//路由
var common = require("./common/Error");//通用模块
var AppConfig = require("./appConfig").config;//应用配置脚本
var errorHandler = require("./common/errorHandler");//错误处理器
var cronService = require("./services/cron");


var app;
var maxAge = 3600000 * 24 * 30;
var staticDir = pathParser.join(__dirname, 'public');

(function init()
{
    //创建服务器实例
    app = express.createServer();
    /*加载静态资源*/
    loadStaticAssets();
    /*配置app环境*/
    configApp();
    /*使用自定义指定路由中间件*/
    useCustomeMidwares();
    /*设置静态视图助手*/
    setupViewHelpers();
    /*配置开发环境*/
    configDevEnv();
    /*配置生成环境*/
    configProEnv();
    //设置全局的错误处理器
    errorHandler.appErrorProcess(app);
    /*配置路由*/
    routes(app);
    //启动监听
    startListening();
    /*启动定时守护进程*/
    startCronDemon();
})();

function ____静态资源____()
{
}//
var assets = {};

/***
 *加载静态资源
 ***/
function loadStaticAssets()
{
    if (AppConfig.mini_assets)//如若合并资源的话,尝试读取合并后的资产json
    {
        try
        {
            assets = JSON.parse(fs.readFileSync(pathParser.join(__dirname, 'assets.json')));
        } catch (e)
        {
            console.log('You must execute `make build` before start app when mini_assets is true.');
            throw e;
        }
    }
}


/***
 *配置app环境
 ***/
function configApp()
{
    app.configure(function ()
    {
        /*注册模板引擎*/
        registerTempEngine();
        /*使用前置中间件*/
        usePreMidwares();
    });
}

/***
 *注册模板引擎
 ***/
function registerTempEngine()
{
    app.set('view engine', 'html');
    app.set('views', pathParser.join(__dirname, 'views'));
    app.set("view options", {layout: false});
    app.register('.html', require('ejs'));
}

/***
 *使用前置中间件
 ***/
function usePreMidwares()
{
    app.use(express.compress());//压缩特性
    app.use(express.favicon());//首页图标
    app.use(express.query());//查询字符串解析
    app.use(express.bodyParser({uploadDir: "./uploads"}));//内容体解析器，uploadDir文件上传路径
    app.use(express.cookieParser());//cookie解析器
    var sessOpts =//
        {
            secret: AppConfig.session_secret,//会话秘钥
            cookie://
                {
                    maxAge: 30 * 60 * 1000      //ms
                }
        }
    app.use(express.session(sessOpts));//使用会话中间件
}

/***
 *使用自定义指定路由中间件
 ***/
function useCustomeMidwares()
{
    app.use(require("./controllers/loginController").commonProcess);
}

/***
 *设置静态视图助手
 ***/
function setupViewHelpers()
{
    var staticViewOpts =//
        {
            config: AppConfig,
            Loader: Loader,
            assets: assets
        }
    app.helpers(staticViewOpts);
}

/***
 *配置开发环境
 ***/
function configDevEnv()
{
    app.configure('development', function ()
    {
        app.use(express.logger());//日志
        app.use("/public", express.static(staticDir));//静态资源路径
        var errHandlerOpts={showStack: true, dumpException: true};
        app.use(express.errorHandler(errHandlerOpts));//使用全局错误处理中间件
    });
}

/***
 *配置生成环境
 ***/
function configProEnv()
{
    app.configure("production", function ()
    {
        app.use('/public', express.static(staticDir, {maxAge: maxAge}));//带缓存日志的静态文件
        app.use(express.errorHandler());
        app.set('view cache', true);//使用视图缓存
    });
}

/***
 *启动监听
 ***/
function startListening()
{
    app.listen(AppConfig.port);
    console.log("the app server run at port :%d in %s mode. ", AppConfig.port, app.settings.env);
}

//start deamon services
/***
 *启动定时守护进程
 ***/
function startCronDemon()
{
    cronService.startLimatationMailNotification(AppConfig.limitCronPattern);
    cronService.startDBBackupService(AppConfig.backupCronPattern);
    cronService.startPushDBBackupFileService(AppConfig.backupPushCronPattern);
}

module.exports = app;