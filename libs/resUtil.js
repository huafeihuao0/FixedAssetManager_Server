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
 Desc: resUtil - the helper of response
 */


/**
 * 生成响应对象
 * @param  {object/json} data    响应的原始数据
 * @param  {string} resCode 响应码
 * @return {object}         包裹体
 */
function genRes(data, resCode)
{
    var res=//
        {
            statusCode: resCode,
            data: data
        }
    return res;
};

exports.genRes = genRes;//生成响应对象