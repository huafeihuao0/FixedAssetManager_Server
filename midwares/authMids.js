/**
* 认证相关的中间件
**/

/**
* 检查登录与否中间件
**/
function checkLoginedMid(req,res,next)
{
    if (!req.session || !req.session.user)//没有登录过
    {
        return res.redirect("/login");//--->跳转到登录
    }
    /*登陆过*/
    next();
}

module.exports=//
    {
        checkLoginedMid:checkLoginedMid,//检查登录与否中间件
    }