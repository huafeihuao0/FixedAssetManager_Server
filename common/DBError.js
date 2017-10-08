/***
 *数据库错误
 ***/
var config = require("../config").initConfig();
var util = require("util");//工具模块

function DBError(message)
{
    Error.call(this);
    this.name = "DBError";
    this.message = message || "DBError";
    this.statusCode = config.statusCode.STATUS_DBERROR;
}

util.inherits(DBError, Error);

module.exports=DBError;