$(function () {

    var layer = layui.layer

    const options = {
        aspectRatio: 1,
        preview: '.img-preview'
    }

    $('#image').cropper(options);

    //为上传按钮绑定事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })


    $('#file').on('change', function (e) {
        //获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }

        //拿到用户选择的文件
        var file = e.target.files[0]
        //将文件转为路径
        var imgURL = URL.createObjectURL(file)
        //重新初始化裁剪区域
        //销毁裁剪区域cropper('destroy')
        //重新设置图片路径attr('src', imgURL)
        //重新初始化裁剪区域cropper(options)
        $('#image').cropper('destroy').attr('src', imgURL).cropper(options)
    })


    $('#btnUpload').on('click', function () {
        //创建一个 Canvas 画布，将 Canvas 画布上的内容，转化为 `base64` 格式的字符串
        var dataURL = $('#image')
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')


        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            }, success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo()
            }
        })
    })
})