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
 Date: 4/11/13
 Time: 15:45 PM
 Desc: qrCode - the helper of qrCode
 service url: https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=:qrCode (qrCode is param)
 */

var fs = require("fs");
var https = require("https");
var validatorCheck = require("validator").check;//验证器
var StringDecoder = require('string_decoder').StringDecoder;

//service:
var serviceUrl = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=";

/**
 * 从google获取二维码数据
 * @param  {string}   qrCodeStr   要生成二维码的字符串
 * @param  {Function} callback the call back func
 * @return {null}
 */
function getQRData(qrCodeStr, callback)
{
    /*检查二维码字符串*/
    var code = mCheckQrcodeStr(qrCodeStr, callback);
    if (!code)
    {
        return;
    }

    /*请求二维码*/
    mGetQrcode(serviceUrl + qrCodeStr, function onDone(err, data)
    {
        if (err)
        {
            return callback(err, null);
        }
        callback(null, Buffer.concat(data).toString("base64"));
    }, callback);
};

/**
 *检查二维码字符串
 * @param  {string}   qrCodeStr   要生成二维码的字符串
 * @param  {Function} callback 回调函数
 **/
function mCheckQrcodeStr(qrCodeStr, callback)
{
    var codeStr = qrCodeStr || "";
    if (!validatorCheck(qrCodeStr).notEmpty())//二维码字符串为空
    {
        callback(new InvalidParamError(), null);//非法参数错误
        return false;
    }
    return codeStr;
}

/**
 *请求二维码
 *  * @param  {Function} onDone 数据接收完回调
 *  * @param  {Function} callback 回调函数
 **/
function mGetQrcode(codeUrl, onDone, callback)
{
    https.get(codeUrl, function onResp(res)
    {
        //TODO 接收数据
        mReceiveData(res, onDone);
    }).on("error", function (err)
    {
        return callback(new ServerError(), null);
    });
}

/**
 * 接收数据
 * @param onDone {Function} 数据接收完成后回调
 **/
function mReceiveData(res, onDone)
{
    console.dir(res.headers);
    var expectedLen = res.headers["content-length"];
    var imgBytes = [];
    var receivedLen = 0;

    res.on("data", function (data)
    {
        imgBytes.push(data);
        receivedLen += data.length;
    });

    res.on("end", function ()
    {
        if (receivedLen == expectedLen)
        {
            if (onDone)
            {
                onDone(null, imgBytes);
            }
        } else
        {
            if (onDone)
            {
                onDone(new ServerError(), null);
            }
        }
    });
}

/**
* 解析二维码字符串
**/
function decodeImgStr(enocodedImgStr, callback)
{
    var decoder = new StringDecoder('base64');
    var imgBuffer = decoder.write(enocodedImgStr);
    decoder.end();
    return callback(null, imgBuffer);
};

/**
* 测试
**/
function test()
{
    QRCode.toDataURL("I am Yanghua !", function (err, url)
    {
        console.log(url);
    });
};


exports.getQRData = getQRData;//从google获取二维码数据
exports.decodeImgStr = decodeImgStr;//解析二维码字符串
exports.test =  test;//测试