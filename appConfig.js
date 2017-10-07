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
  Date: 11/11/13
  Time: 10:46 AM
  Desc: define app config info
 */

/***
 *应用配置文件
 ***/
var pathParser = require("path");

exports.config =//
    {
        debug: true,
        name: "资产管理系统",
        giftname: "礼物管理系统",
        description: "Fixed Asset Manager",
        version: "0.0.1",

        port: 8088,//监听端口

        //网站头
        site_headers: ['<meta name="author" content="freedom" />'],
        //静态主机
        site_static_host: "",
        mini_assets: true,//是否合并静态资源
        session_secret: "Fixed_Asset_0987654321",//会话秘钥

        mail_opts://邮件配置
            {
                host: "smtp.163.com",
                port: 25,
                auth: //
                    {
                        user: "wisasset@163.com",
                        pass: "adminn"
                    }
            },

        mailDefault_TO://默认邮件地址
            [
                "huayang@wisedu.com",
                "zcliu@wisedu.com"
            ],

        networkIsOk: 1,//网络标记

        /*守护模式*/
        limitCronPattern: "00 00 10 * * 1-5",
        backupCronPattern: "00 00 23 * * *",
        backupPushCronPattern: "00 30 23 */3 * *"
    };