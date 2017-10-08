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
  Date: 7/11/13
  Time: 17:03 PM
  Desc: departments - the controller of departments
 */

var Department  = require("../proxy/department");
var resUtil     = require("../libs/resUtil");
var config      = require("../config").initConfig();


/**
 * get all departments
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next next handler
 * @return {null}        
 */
exports.getAllDepartments = function (req, res, next) {
    debugCtrller("controllers/department/getAllDepartments");
    Department.getAllDepartment(function (err, deptList) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(deptList, config.statusCode.STATUS_OK));
    });
};

/**
 * get all manual input department list
 * @param  {object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.allManualInputDepts = function (req, res, next) {
    debugCtrller("controllers/department/allManualInputDepts");
    Department.getAllManualDept(function (err, deptList) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(deptList, config.statusCode.STATUS_OK));
    });
};