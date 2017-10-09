var authMids=require('./midwares/authMids');

/**
*中间件映射工具
**/
function mapMids(app)
{
    app.get('/',authMids.checkLoginedMid);
    app.get('/fixedasset/:faId/edit',authMids.checkLoginedMid);
    app.get('/fixedasset/create/:faId?',authMids.checkLoginedMid);
    app.get('/fixedasset/batchCreate',authMids.checkLoginedMid);
    app.get('/fixedasset/getUserId/:userName',authMids.checkLoginedMid);
    app.get('/fixedasset/printservice/:pageIndex/:timefrom?/:timeto?',authMids.checkLoginedMid);
    app.get('/fixedasset/retrieve',authMids.checkLoginedMid);
}

module.exports=mapMids;