
var StartingLine = 0;
var rowsNumber = 40;
var winH = $(window).height();//页面的高度
var timer = null;
var timer1 = null;
var flag = 1;
var ddiv = `<div class = "box"> ${StartingLine} </div>`;
allowCreatebox=true;
$(window).on("scroll",function(){
  listenScroll();togglUptop();togglefixd();
});
$(window).resize(function(){
  togglefixd();
});
listenScroll();

//懒加载
function listenScroll() {
  clearTimeout(timer);
    var lastDiv = ".container>.fl>.box:last";//最后一个元素
    scrollTop = $(window).scrollTop(),//滚动条距离顶部的距离
    offSetTop = $(lastDiv).offset().top;//在页面中的位置
    //console.log(offSetTop < (winH + scrollTop));
    lazyLoad();
}
function lazyLoad(){
  var lastDiv = ".container>.fl>.box:last";
  flag=1;
  if(isVisible(lastDiv))
    {//节流
      timer = setTimeout(function() {
      ajax(StartingLine,rowsNumber);
      console.log(StartingLine);
      StartingLine+=rowsNumber;
      }, 100);
  }
}

//创建元素并且修改元素内容
function createBox(data){
  if(allowCreatebox){  
    var content = document.getElementById("content");
    var box = document.createElement("div");
    box.innerHTML = data;
    box.className = "box";
    var boxx = content.appendChild(box);
    flag = 1;
  }
}


//指定行向服务器查询内容
function ajax (StartingLine,rowsNumber){
  if(flag==1&&allowCreatebox){
   $.ajax({
      contentType: "application/json;charset=utf-8",
      url:"conn.php",
      data: `StartingLine=${StartingLine}&rowsNumber=${rowsNumber}`,
      cache:false,
      //complete:
     //beforeSend:function(){console.log("开始"+new Date().getTime());},   
      success:function(data){
        flag=0;
      //json = eval("(" + data + ")");
        console.log(data);
        // data = JSON.parse(data);
        // data = "姓名："+data.name +" 时间："+data.date + "<br>内容:"+data.liuyan+" id:"+data.id;;
        // createBox(data);      
        editData(data);
      },
    });
  }  
}
//处理ajax获取的数据
function editData(data){
  data = data.split("*^^^^^^^^^^*");
  for(var i=0;i<rowsNumber;i++){
    if(data[i]){
      createBox(data[i]);
    }
    else{
      allowCreatebox=false;
      var content = document.getElementById("content");
      var box = document.createElement("div");
      box.innerHTML = "<hr><center>我是有底线的</center><hr>";
      var boxx = content.appendChild(box);
      break;
    }
  }
}

//设置返回顶部
function returnTop (e){ //点击图片时触发点击事件
        var top=document.getElementById("returnTop");//获取图片元素
        timer2=setInterval(function(){ //设置一个计时器
        var ct = document.documentElement.scrollTop || document.body.scrollTop; //获取距离顶部的距离
        ct-=50;
        if(ct>winH){//如果与顶部的距离大于零
             window.scrollTo(0,ct);//向上移动10px
        }
        else{//如果距离小于等于零
             window.scrollTo(0,0);//移动到顶部
             clearInterval(timer2);//清除计时器
        }
    },10);//隔10ms执行一次前面的function，展现一种平滑滑动效果
}

//显示隐藏向上返回顶部的按钮
function togglUptop(){
  var t = document.documentElement.scrollTop || document.body.scrollTop;  //获取距离页面顶部的距离
  var uptop = document.getElementById("returnTop"); //获取div元素
  if( t >= winH ) { //当距离顶部超过300px时
    uptop.style.bottom=30+'px';//使div距离底部30px，也就是向上出现
  } 
  else { //如果距离顶部小于300px
    uptop.style.bottom=-50+'px';//使div向下隐藏
  }
}
//切换固定
function togglefixd(){
  // if (isNotVisible(".fr>.box"))
  if ($(".fr>.box:last").offset().top -100 <=$(window).scrollTop())
  {
    $(".fr>.box:last").addClass("fixdd");
    var offsetLeft = $(".fr>.box").offset().left;
    $(".fr>.box:last").css("left",offsetLeft);
  }
  if ($(window).scrollTop() <= $(".fr>.box:first").offset().top + $(".fr>.box:first").height())
  { $(".fr>.box:last").removeClass("fixdd");}
}

//是否超出可视范围内
function isNotVisible(el) {
   if ($(window).scrollTop() > $(el).offset().top + $(el).height())
   return true;
}
//是否出现在可视范围
function isVisible(el){
    if ($(el).offset().top <(winH + scrollTop))
    return true;
}