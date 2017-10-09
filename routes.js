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
  Date: 10/10/13
  Time: 18:30 PM
  Desc: fixedAsset - base class
 */

/*
 routes - the router of url request
 */

var userController = require("./controllers/userController");
var fixedAssetController = require("./controllers/fixedAssetController");
var fixedAssetHistoryController = require("./controllers/fixedAssetHistoryController");
var faTypeController = require("./controllers/faTypeController");
var departmentController = require("./controllers/departmentController");
var othersController = require("./controllers/othersController");
var loginController = require("./controllers/loginController");
var logoutController = require("./controllers/logoutController");
var companyController = require("./controllers/companyController");
var authUserController = require("./controllers/authUserController");

var giftCategoryController = require("./controllers/giftCategoryController");
var stockInTypeController = require("./controllers/stockInTypeController");
var giftController = require("./controllers/giftController");
var paymentTypeController = require("./controllers/paymentTypeController");
var stockInController = require("./controllers/stockInController");
var stockOutController = require("./controllers/stockOutController");
var inventoryController = require("./controllers/inventoryController");
var limitationController = require("./controllers/limitationController");

/*认证相关中间件*/
var authMids=require('./midwares/authMids');

/**
* 映射路由
**/
function mapRoutes(app)
{
    /************************************************************************/
    /*                Resful: URI Represent a Resource!!!                   */
    /************************************************************************/

    /*建立固定资产页面路由*/
    mSetupFixAssetsPageRoutes();
    /*建立固定资产API路由*/
    mSetupFixAssetsAPIRoutes();

    /*gift页面路由*/
    mSetupGiftPageRoutes();
    app.get("*", othersController.fourofour);
};

/***
 *建立固定资产页面路由
 ***/
function mSetupFixAssetsPageRoutes()
{
    //html page
    // app.get("/", others.index);
    app.get("/",authMids.checkLoginedMid);
    app.get("/", fixedAssetController.manage);

    app.get("/qrtest", fixedAssetController.handleQrcode);
    app.get("/apis", othersController.apis);
    app.get("/login", loginController.showLogin);
    app.post("/signin", loginController.signIn);
    app.get("/signout", logoutController.signOut);
    app.get("/fixedasset/printservice/:pageIndex/:timefrom?/:timeto?",authMids.checkLoginedMid);
    app.get("/fixedasset/printservice/:pageIndex/:timefrom?/:timeto?", fixedAssetController.printService);
    app.get("/fixedasset/manage", fixedAssetController.manage);
    app.get("/404", othersController.fourofour);
    app.get("/captchaImg", loginController.captchaImg);
    app.get("/fixedasset/:faId/edit",authMids.checkLoginedMid);
    app.get("/fixedasset/:faId/edit", fixedAssetController.edit);
    app.get("/fixedasset/create/:faId?",authMids.checkLoginedMid);
    app.get("/fixedasset/create/:faId?", fixedAssetController.create);
    app.post("/fixedasset/import/company/:companyId", fixedAssetController.importFA);
    app.get("/fixedasset/batchCreate",authMids.checkLoginedMid);
    app.get("/fixedasset/batchCreate", fixedAssetController.batchCreate);
    app.get("/fixedasset/excelExport/:companyId", fixedAssetController.exportExcel);
    app.get("/addUser", loginController.addUser);
    app.get("/editpwd", loginController.editpwd);
}

/***
 *建立固定资产API路由
 ***/
function mSetupFixAssetsAPIRoutes()
{
    //apis
    app.get("/user/:userId", userController.getUserById);
    app.get("/user/:userId/fixedassets", fixedAssetController.getFixedAssetListByUserID);
    app.get("/fixedasset/:faId/info", fixedAssetController.getFixedAssetByfaID);
    app.get("/fatypes", faTypeController.getAllFATypes);
    app.get("/departments", departmentController.getAllDepartments);
    app.get("/fixedasset/:faId/existence", fixedAssetController.checkExistence);
    app.get("/fixedasset/:faId/history", fixedAssetHistoryController.faHistory);
    app.get("/department/:deptId/idelfixedasset/type/:typeId/page/:pageIndex?", fixedAssetController.idleFixedAsset);
    app.get("/companies", companyController.companies);
    app.get("/fixedasset/conditionInfo", fixedAssetController.conditionInfo);
    app.post("/fixedasset/retrieve",authMids.checkLoginedMid);
    app.post("/fixedasset/retrieve", fixedAssetController.retrieve);
    app.get("/fixedasset/getUserId/:userName",authMids.checkLoginedMid);
    app.get("/fixedasset/getUserId/:userName", fixedAssetController.getUserIdByUserName);
    app.get("/onlineusers", authUserController.onlineUsers);
    app.get("/operaterecords", fixedAssetHistoryController.operateRecordForwardASession);


    app.post("/fixedasset/inspection", fixedAssetController.inspection);
    app.post("/fixedasset/rejection", fixedAssetController.rejection);
    app.post("/fixedasset/insertion", fixedAssetController.insertion);
    app.post("/fixedasset/:faId/recycle", fixedAssetController.recycle);
    app.post("/fixedasset/:faId/modification", fixedAssetController.modification);
    app.post("/fixedasset/:faId/allocation", fixedAssetController.allocation);
    app.post("/signup", authUserController.create);
    app.post("/modifypwd", authUserController.modifyPassword);
}

/***
 *gift页面路由
 ***/
function mSetupGiftPageRoutes()
{
    //gift html page
    app.get("/gift", giftController.gift);
    app.get("/gift/manage", giftController.giftManage);
    app.get("/gift/storage", giftController.storage);
    app.get("/gift/other", giftController.other);

    app.get("/giftcategories", giftCategoryController.giftCategories);
    app.post("/giftcategory/insertion", giftCategoryController.insertion);
    app.post("/giftcategory/modification", giftCategoryController.modification);

    app.get("/stockintypes", stockInTypeController.stockInTypes);
    app.post("/stockintype/insertion", stockInTypeController.insertion);
    app.post("/stockintype/modification", stockInTypeController.modification);

    app.post("/gifts", giftController.gifts);
    app.post("/gift/insertion", giftController.insertion);
    app.post("/gift/modification", giftController.modification);
    app.post("/gift/deletion", giftController.deletion);

    app.get("/paymenttypes", paymentTypeController.paymentTypes);
    app.post("/paymenttype/insertion", paymentTypeController.insertion);
    app.post("/paymenttype/modification", paymentTypeController.modification);

    app.post("/stockins", stockInController.stockins);
    app.post("/stockin/insertion", stockInController.insertion);
    app.post("/stockin/modification", stockInController.modification);
    app.post("/stockin/deletion", stockInController.deletion);
    app.post("/stockin/import", stockInController.importSI);
    app.get("/stockin/export", stockInController.exportSI);

    app.post("/stockouts", stockOutController.stockouts);
    app.post("/stockout/insertion", stockOutController.insertion);
    app.post("/stockout/modification", stockOutController.modification);
    app.post("/stockout/deletion", stockOutController.deletion);
    app.get("/stockout/export", stockOutController.exportSO);

    app.get("/limitations", limitationController.limitations);
    app.post("/limitation/insertion", limitationController.insertion);
    app.post("/limitation/modification", limitationController.modification);
    app.post("/limitation/deletion", limitationController.deletion);

    app.post("/inventories", inventoryController.inventories);
    app.get("/inventory/export", inventoryController.exportInv);

    app.get("/manualinputdepts", departmentController.allManualInputDepts);
    app.get("/suppliers", stockInController.suppliers);
}

module.exports = mapRoutes;