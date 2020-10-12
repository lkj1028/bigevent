$(function () {

    getUserInfo()


    var layer = layui.layer;
    //点击退出按钮 退出登录 回到登录页面
    $('#btnLogout').on('click', function () {
        //提示用户是否确认退出
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function (index) {
            // 1.清空本地存储中的token
            localStorage.removeItem('token')
            //2.重新跳转登录页
            location.href = '/login.html'

            //关闭confirm询问框
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        success: function (res) {

            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }
            //调用rednerAvatar渲染用户的头像
            renderAvatar(res.data)
        }/* ,
        //无论成功还是失败都会调用complete回调函数
        complete: function (res) {
            console.log('执行了complete函数');
            console.log(res);
            //在complete 函数中可以使用res.responseJSON拿到服务器响应的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //1.清空token
                localStorage.removeItem('token')
                //2.强制跳转
                location.href = '/login.html'
            }
        } */
    })
}

function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        //渲染头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide();
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}

