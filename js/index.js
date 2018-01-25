var swiper = new Swiper('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
        loop: true
    }
});


$(".btn-wrapper div").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
});

$(".add").click(function () {
    $("#main").css("filter", "blur(2px)").next().show().children(".alertBox").addClass("show");
});

$(".close").click(function () {
    $(this).parent().removeClass("show").parent().hide().prev().css("filter", "none");
});

$(".submit").click(function () {
    $(this).parent().removeClass("show").parent().hide().prev().css("filter", "none");
    let data = getData();
    let val = $("textarea").val();
    data.push({text: val, isDone: false, isStar: false, time: time});
    if ($("#text").val() === "") {
        $(".tips").html("请填写内容!").addClass("tipsShow");
        return;
    }
    $("textarea").val("");
    saveData(data);
    render();
});
$(".tips").on("animationend", function () {
    $(this).removeClass("tipsShow");
});
let flag = "plan";
$(".done").click(function () {
    flag = "done";
    render();
});
$(".plan").click(function () {
    flag = "plan";
    render();
});
let time = new Date().getTime();

function getData() {
    return localStorage.message ? JSON.parse(localStorage.message) : [];
}

function saveData(data) {
    localStorage.message = JSON.stringify(data);
}

function render() {
    let data = getData();
    let str = "";
    $.each(data, function (index, val) {
        if (flag === "plan" && val.isDone === false) {
            str += `
            <li id=${index}>
                <p>${val.text}</p>
                <time>${getDate(val.time)}</time>
                <i class=${val.isStar ? "active" : ""}>o</i>
                <div class="donebtn">完成</div>
            </li>
        `;
        } else if (flag === "done" && val.isDone === true) {
            str += `
            <li id=${index}>
                <p>${val.text}</p>
                <time>${getDate(val.time)}</time>
                <i class=${val.isStar ? "active" : ""}>o</i>
                <div class="delbtn">删除</div>
            </li>
        `;
        }
    });
    $(".content ul").html(str);
    saveData(data)
    addEvent();
}

render();

function getDate(time) {
    let date = new Date();
    date.setTime(time);
    let year = date.getFullYear();
    let month = setZero(date.getMonth() + 1);
    let day = setZero(date.getDate());
    return year + "-" + month + "-" + day;
}

function setZero(n) {
    return n < 10 ? "0" + n : n;
}

function addEvent() {
    var max = $(".content ul li div").width();
    $(".content ul li").each(function (index, ele) {
        var sx, mx, pos = "start", movex;
        var hammer = new Hammer(ele);
        hammer.on("panstart", function (e) {
            $(ele).css("transtion","none");
            sx = e.center.x;
            $(ele).siblings().transition({x:0});
        });

        hammer.on("panmove", function (e) {
            var cx = e.center.x;
            mx = cx - sx;
            if (mx > 0 && pos === "start") {
                return;
            }
            if (mx < 0 && pos === "end") {
                return;
            }
            if (Math.abs(mx) > max) {
                return;
            }
            if (pos === "start") {
                movex = mx;
                //ele.style.transform="translateX(" + mx + "px)"
            } else if (pos === "end") {
                movex = mx - max;
            }
            ele.style.transform = "translateX(" + movex + "px)"

        });

        hammer.on("panend", function () {
            $(ele).css("transtion","all 1s");
            if (Math.abs(movex) < max / 2) {
                $(ele).css("x",0);
                pos = "start";
            } else {
                $(ele).css("x",-max);
                pos = "end";
            }
        });
    })
}

$(".content ul")
    .on("click",".donebtn",function(){
        var id=$(this).parent().attr("id");
        var data=getData();
        data[id].isDone=true;
        saveData(data);
        render();
    });
