/***
 *数据未找到错误
 ***/
var config = require("../config").initConfig();
var util = require("util");//工具模块

function DataNotFoundError(message)
{
    Error.call(this);//继承错误

    this.name = "DataNotFoundError";
    this.message = message || "Data not found Error.";
    this.statusCode = config.statusCode.STATUS_NOTFOUND;
}

util.inherits(DataNotFoundError, Error);

module.exports=DataNotFoundError;