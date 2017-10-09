/**
 * 字符串扩展、
 **/

/**
 * 格式字符串
 */
String.prototype.format = function ()
{
    var args = arguments;
    var reg = /\{(\d+)\}/g;
    var result=this.replace(reg, function (m, i)
    {
        return args[i];
    });
    return result;
};