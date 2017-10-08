/***
 *非法参数错误
 ***/
var config = require("../config").initConfig();
var util = require("util");//工具模块

function InvalidParamError(message)
{
    Error.call(this);//继承Error

    this.name = "InvalidParamError";
    this.message = message || "InvalidParam Error";
    this.statusCode = config.statusCode.STATUS_INVAILD_PARAMS;
}

util.inherits(InvalidParamError, Error);

module.exports=InvalidParamError;