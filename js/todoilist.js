$(function() {
    load();
    // 1.判断用户按下的是回车键 对应ASCII码是13
    $("#title").on("keydown", function(event) {
        if ($(this).val() === '' && event.keyCode === 13) {
            alert('还没添加哦~')
        } else {
            if (event.keyCode === 13) {
                //如果按下的是回车 就读取本地存储先读取原来已有的数据 
                //数据存储格式是 [{title:"xxx",done:false}]
                // 声明一个变量用来存从本地读取的数组形式的数据
                var local = getData();
                // console.log(local);
                //给local更新数据  就是给数组添加元素 用push
                local.push({ title: $(this).val(), done: false })
                    //但是这样直接添加给数组的数据刷新就没了 还要把更新后的数组存到本地存储
                saveData(local);
                load();
                $(this).val("");
            }
            //用户按下回车需要把里面的数据存在本地存存储，但是本地存储只能存字符串，所以先把数据追加给一个数组，把数组保存起来，然后把数组转换成字符串形式存在本地存储
        }
    });

    //删除按钮
    $("ol,ul").on("click", "a", function() {
        // 先获取本地存储
        var data = getData();
        console.log(data);
        // 修改数据
        //给删除按钮加自定义索引号id，获取当前按的索引号
        var index = $(this).attr("id");
        data.splice(index, 1);
        // 存到本地存储
        saveData(data);
        // 重新渲染页面
        load();
    });

    //正在进行和已完成模块
    $("ul, ol").on("click", "input", function() {
        // 先获取
        var data = getData();
        // 再修改
        var index = $(this).siblings("a").attr("id");
        console.log(index);
        //点的索引号对应的数组里面的done的值 修改为 当前元素一个固有属性的值
        data[index].done = $(this).prop("checked");
        console.log(data);
        // 然后保存
        saveData(data);
        // 最后渲染
        load();
    })

    //其他地方也需要读取数据，所以在外面封装一个读取本地数据的函数
    //读取本地存储的函数：
    function getData() {
        var data = localStorage.getItem("todolist"); //看一下有没有叫todolist的数据
        if (data !== null) { //如果有数据就拿过来
            //但是本地存储存的是字符串  要转换成对象格式
            return JSON.parse(data); //如果之前有数据 转换后返回  ，是一个数组格式
        } else {
            return []; //如果之前没有数据 就返回一个空数组
        }
    };

    //其他地方也会用到存储数据，声明一个
    // 存储本地存储的函数：
    function saveData(data) {
        localStorage.setItem("todolist", JSON.stringify(data))
    };

    //把数据渲染加载到页面的函数：
    function load() {
        //先要读取本地存储 （转换成对象格式再读取）
        var data = getData();
        //先要清空ol里面的内容 防止重复出现之前内容
        $("ol,ul").empty();
        //声明统计任务数的变量
        var todoCount = 0; //正在进行个数 
        var doneCount = 0; //已经完成个数 
        //遍历数组,遍历的同时有几条数据 就在ol中创建几个li
        $.each(data, function(i, n) {
            if (n.done) {
                $("ul").prepend("<li class='xxx'><input type='checkbox' checked='checked'><p>" + n.title + "</p><a href='javascript:;' id='" + i + "'></a></li>")
                doneCount++;
            } else {
                $("ol").prepend("<li class='xxx'><input type='checkbox'><p>" + n.title + "</p><a href='javascript:;' id='" + i + "'></a></li>")
                todoCount++;
            }
        });
        //把统计到的任务数 给对应的span修改内容
        $("#todocount").text(todoCount);
        $("#donecount").text(doneCount);
    };



})