/***
 *页面未找到错误
 ***/
var config = require("../config").initConfig();
var util = require("util");//工具模块


function PageNotFoundError(message)
{
    Error.call(this);

    this.name = "PageNotFoundError";
    this.message = message || "InvalidParam Error";
    this.statusCode = 404;
}

util.inherits(PageNotFoundError, Error);

module.exports=PageNotFoundError;