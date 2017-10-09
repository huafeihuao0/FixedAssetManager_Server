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
  Date: 14/10/13
  Time: 14:30 AM
  Desc: mysqlUtil - the helper of mysql
 */

var mysql = require("mysql");
var mysqlPool = null;//mysql连接池
var config = require("../config").initConfig();

/**
 * 初始化mysql连接池
 * @return {null}
 */
function mInitMysqlPool()
{
    mysqlPool = mysql.createPool(config.mysqlConfig);
}

/**
 * 查询
 * @param  {object}   queryRequset  查询请求对象
 * @param  {Function} onQueryDone 查询完成后回调
 * @return {null}
 */
function query(queryRequset, onQueryDone)
{
    /*检查连接池是否存在*/
    mCheckPoolExisted();
    /*检查查询请求是否存在*/
    mCheckQueryReqExisted(queryRequset);
    /*检查模式字符串是否存在*/
    var sql_pattern =mCheckSqlPattern(queryRequset);

    /*从连接池中获取一个可用连接*/
    mGetAvaiConn(function onConnAvail(conn)
    {
        /*查询请求格式化(将占位符去掉)*/
        conn.config.queryFormat = mQueryFormat;
        conn.query(sql_pattern, queryRequset.params, function (err, rows)
        {
            conn.release();//释放连接
            if (onQueryDone)
            {
                onQueryDone(err, rows);
            }
        });
    })
};

/**
 * 获取执行事务的连接
 * @param  {Function} onTransConnAvail 当用于事务的连接存在时候回调
 * @return {null}
 */
function getTransConn(onTransConnAvail)
{
    /*检查连接池是否存在*/
    mCheckPoolExisted();
    /*从连接池中获取一个可用连接*/
    mGetAvaiConn(function onConnAvail(conn)
    {
        /*查询请求格式化(将占位符去掉)*/
        conn.config.queryFormat =mQueryFormat;

        if (onTransConnAvail)
        {
            onTransConnAvail(conn);
        }
    })
};

/***
 *检查连接池是否存在
 ***/
function mCheckPoolExisted()
{
    if (!mysqlPool)
    {
        mInitMysqlPool();
    }
}

/***
 *检查查询请求是否存在
 * @param queryRequset {Object} 查询请求对象
 ***/
function mCheckQueryReqExisted(queryRequset)
{
    if (!queryRequset)
    {
        throw new DBError("the sqlReq is null");
    }
}

/***
 *
 * @param queryRequset {Object} 查询请求对象
 ***/
function mCheckSqlPattern(queryRequset)
{
    var sql_pattern = queryRequset.sql || "";
    if (sql_pattern.length === 0)
    {
        throw new DBError("the sql is empty");
    }
    return sql_pattern;
}

/***
 *从连接池中获取一个可用连接
 *
 * @param onConnAvail {Function} 当有可用连接的时候回调
 ***/
function mGetAvaiConn(onConnAvail)
{
    mysqlPool.getConnection(function (err, connection)
    {
        if (err)
        {
            throw err;
        }

        if (onConnAvail)
        {
            onConnAvail(connection);
        }
    });
}

/***
 *查询请求格式化(将占位符去掉)
 *
 * @param query {String} 查询字符串
 * @param values {Array} 查询参数集
 ***/
function mQueryFormat(query, values)
{
    if (!values)
    {
        return query;
    }
    var filledQuery=query.replace(/\:(\w+)/g, function (txt, key)
    {
        if (values.hasOwnProperty(key))
        {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
    return filledQuery;
};


exports.query = query;//查询
exports.processTransaction = getTransConn;//获取执行事务的连接