/*
  #!/usr/local/bin/node
  -*- coding:utf-8 -*-
 
  Copyright 2013 yanghua Inc. All Rights Reserved.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file exceqt in compliance with the License.
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
  Date: 11/10/13
  Time: 10:43 AM
  Desc: the utily of Date
 */

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
/***
 *日期格式化工具
 *
 * @param formatStr {String} 格式字符串
 ***/
Date.prototype.format = function Format(formatStr)
{
    /*标准格式集*/
    var standardFormats =//
        {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };

    /*检查日期格式是否包含年份*/
   mCheckYear(this,formatStr);

   /*遍历标准格式集合*/
    for (var formatKey in standardFormats)
    {
        if (new RegExp("(" + formatKey + ")").test(formatStr))
        {
            formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length == 1) ? (standardFormats[formatKey]) : (("00" + standardFormats[formatKey]).substr(("" + standardFormats[formatKey]).length)));
        }
    }

    return formatStr;
};

/***
 *检查日期格式是否包含年份
 * @param dateObj {Date} 日期实例
 * @param formatStr {Date} 日期格式字符串
 ***/
function mCheckYear(dateObj,formatStr)
{
    if (/(y+)/.test(formatStr))//如果有年份
    {
        formatStr = formatStr.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
}