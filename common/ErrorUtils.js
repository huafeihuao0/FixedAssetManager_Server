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
  Date: 22/10/13
  Time: 9:50 PM
  Desc: Error definition and inherit
 */

/***
 *错误工具集
 ***/

/*数据未找到错误*/
var DataNotFoundError=require('./DataNotFoundError');
/*服务器错误*/
var ServerError=require('./ServerError');
/*非法参数错误*/
var InvalidParamError=require('./InvalidParamError');
/*页面未找到错误*/
var PageNotFoundError=require('./PageNotFoundError');
/*数据库错误*/
var DBError=require('./DBError');

global.ServerError = ServerError;
global.InvalidParamError = InvalidParamError;
global.DataNotFoundError = DataNotFoundError;
global.PageNotFoundError = PageNotFoundError;
global.DBError = DBError;