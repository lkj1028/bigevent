$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    //定义一个查询参数对象并提交到服务器
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable()
    initCate()
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //分页总数据res.total
                randerPage(res.total)
            }
        })
    }


    //优化发布时间
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                //调用模板引擎的渲染分类可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                //重新渲染表单ui结构
                form.render()
            }
        })
    }

    //筛选功能submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()


        q.cate_id = cate_id;
        q.state = state;

        initTable()
    })


    //分页模块
    function randerPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,// 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//自定义输出组件

            limits: [2, 3, 5, 7],//每页多少条输出
            //只要调用了laypage.render就会一直执行 jump,用first进行判断是否是点击鼠标进行切换分页,first为最开始的进入自动触发的，忽略他，设置成点击的时候才进行页面渲染
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable();
                }
            }
        })
    }


    //删除模块
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length

        var id = $(this).attr('data-id')//获取对应的id
        console.log(id);
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })
            layer.close(index);
        });

    })



})