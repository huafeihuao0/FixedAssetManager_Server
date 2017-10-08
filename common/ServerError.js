/***
 *服务器错误
 ***/
var config = require("../config").initConfig();
var util = require("util");//工具模块

function ServerError(message)
{
    Error.call(this);//继承错误Error

    this.name = "ServerError";
    this.message = message || "Server Error";
    this.statusCode = config.statusCode.STATUS_SERVER_ERROR;
}

util.inherits(ServerError, Error);

module.exports=ServerError;