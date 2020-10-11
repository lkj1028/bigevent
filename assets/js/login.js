$(function () {


    // 去注册账号链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    //去登陆链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })


    //从layui中获取form对象
    var form = layui.form
    //通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            var pwd = $('.first-pwd').val()
            if (pwd !== value) {
                return '两次输入密码不一致'
            }
        }
    })


    var layer = layui.layer
    //注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        //post的方法
        /* $.post(url + 'reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！')
            $('#link_login').click();
        }) */

        //ajax的方法
        $.ajax({
            url: '/api/reguser',
            method: 'POST',
            data: {
                username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()
            }, success(res) {
                if (res.status !== 0) {
                    layer.msg(res.message);
                    return;
                }
                layer.msg('注册成功');
                $('#link_login').click();
            }
        })
    })


    //登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message || '登录失败')
                }
                layer.msg('登录成功')
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})

