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
  Date: Dec 16, 2013
  Time: 11:24 AM
  Desc: the proxy of limit
 */

var mysqlClient = require("../libs/mysqlUtil");
var util        = require("../libs/globalUtils");

/**
 * get all limit list
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.getAllLimits = function (callback) {
    debugProxy("/proxy/limit/getAllLimits");
    var sql;

    sql = "SELECT l.*, g.* FROM LIMITATION l " +
          "LEFT JOIN GIFT g ON l.giftId = g.giftId ";

    mysqlClient.query({
        sql   : sql,
        params: null
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, rows);
    });

};

/**
 * add a new limit 
 * @param {Object}   limitInfo the creating limit info
 * @param {Function} callback  the callback func
 */
exports.add = function (limitInfo, callback) {
    debugProxy("/proxy/limit/add");
    var sql;

    sql = "INSERT INTO LIMITATION VALUES(:giftId, :limitNum)";

    mysqlClient.query({
        sql   : sql,
        params: limitInfo
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};

/**
 * modify a limit item
 * @param  {Object}   limitInfo the instance of limit
 * @param  {Function} callback  the cb func
 * @return {null}             
 */
exports.modify = function (limitInfo, callback) {
    debugProxy("/proxy/limit/modify");

    var sql = "UPDATE LIMITATION SET limitNum = :limitNum WHERE giftId = :giftId";

    mysqlClient.query({
        sql     : sql,
        params  : limitInfo
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};

/**
 * remove a limit item
 * @param  {String}   giftId   the gift id
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.remove = function (giftId, callback) {
    debugProxy("/proxy/limit/remove");

    var sql = "DELETE FROM LIMITATION WHERE giftId = :giftId";

    mysqlClient.query({
        sql     : sql,
        params  : { giftId : giftId }
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, null);
    });

};

/**
 * get gifts that under limatation line
 * @param  {Function} callback the cb 
 * @return {[type]}            [description]
 */
exports.getUnderLimatationGifts = function (callback) {
    debugProxy("/proxy/inventory/getUnderLimatationGifts");

    var sql = "SELECT g.name, g.brand, g.price, i.num, l.limitNum FROM LIMITATION l " +
              "  LEFT JOIN INVENTORY i " +
              "    ON l.giftId = i.giftId and l.limitNum >= i.num " +
              "  LEFT JOIN GIFT g ON g.giftId = l.giftId";

    mysqlClient.query({
        sql     : sql,
        params  : null
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, rows);
    });
};