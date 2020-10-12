$.ajaxPrefilter(function (options) {

    //请求路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    //统一为有权限的接口，设置headers 请求头
    //判断是否需要权限
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //全局统一挂载complete 回调函数
    options.complete = function (res) {
        //在complete 函数中可以使用res.responseJSON拿到服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1.清空token
            localStorage.removeItem('token')
            //2.强制跳转
            location.href = '/login.html'
        }
    }
})