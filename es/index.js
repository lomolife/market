// 导入模块
import * as effect from './effect';
import * as push from './pushModule';
import * as content from './content';

// 字符串变为 DOM
function parseToDOM(str){
   var div = document.createElement("div");
   if(typeof str == "string")
       div.innerHTML = str;
   return div.childNodes;
}

function addMessage() {
    // 变量初始化
    let $ = selector => {
        return document.querySelector(selector);
    };
    // 加载所有未下架的商品
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/market/api/goods/all/${num}`);
    xhr.onreadystatechange = function (event) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 将获得的东西进行判断
            let response =  JSON.parse(xhr.responseText);
            if (response.message.length === 0) {
                $('.no-more').style.display = 'block';
                $('.click-more').style.display = 'none';
            }
            else {
                $('.no-more').style.display = 'none';
                $('.click-more').style.display = 'block';
            }
            let goodHTML = "";
            // 将获取的数据格式化并加入商品列表
            response.message.forEach( function(good, index) {
                goodHTML += content.generateGood(good, good.owner);
            });
            Array.from(parseToDOM(goodHTML)).forEach( function(element, index) {
                if (index % 2 == 1) {
                    $('.goods').appendChild(element);
                }
            });
            num = response.num;
        }
    };
    xhr.send();
}

document.addEventListener('DOMContentLoaded', function () {
    // 变量初始化
    let $ = selector => {
        return document.querySelector(selector);
    };
    addMessage();
    $('.click-more').addEventListener('click', function (event) {
        addMessage();
    });
    // 页面的事件绑定
    $('main').addEventListener('click', function (event) {
        if (event.target.getAttribute('data-dialog') === 'check') {
            event.preventDefault();
            // 执行点击事件
            effect.dialog(event.target, event);
        }
    });
    // 加号按钮点击事件绑定
    $('.touch > img').addEventListener('click', function (event) {
        if (dialogCheck === 'false') {
            // 执行点击事件
            effect.dialog(event.target, event);
        } else {
            location.href = 'push';
        }
    });
    // 点击新东西发布按钮
    $('.index-newgoods').addEventListener('click', function (event) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `/market/api/good/alllimit/${date}`);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 获取的商品信息
                let response = JSON.parse(xhr.responseText);
                // 遍历
                response.message.forEach( function(good, index) {
                    let html = content.generateGood(good, good.owner);
                    html = html.trim();
                    let DOM = parseToDOM(html)[0];
                    $('.goods').insertBefore(DOM, $('.goods').childNodes[0]);
                });
                date = (new Date()).valueOf();
                $('.index-newgoods').style.display = 'none';
            }
        };
        xhr.send();
    });
    // 
    // $('.index-banner-head').addEventListener('click', function (event) {
    //     if (dialogCheck === 'true') {
    //         $('.eddit-dialog').style.display = 'block';
    //     }
    // });
    $('.eddit-dialog .default').addEventListener('click', function (event) {
        $('.eddit-dialog').style.display = 'none';
    });
    $('.eddit-dialog .primary').addEventListener('click', function (event) {
        location.href = 'check';
    });
    $('a[href=sells]').onclick = function (event) {
        if (dialogCheck === 'true') {
            location.href = event.target.href;
        }
    };
    $('a[href=message]').onclick = function (event) {
        if (dialogCheck === 'true') {
            location.href = event.target.href;
        }
    };
    // Ajax 长轮询
    window.setInterval(function () {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `/market/api/message/hasnew/${openid}/${date}`);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.hasnew) {
                    // 我的消息显示提醒
                    $('.index-banner-message').className = 'index-banner-message ui-reddot';
                    // 显示提醒的数量
                    $('.index-banner-num').innerText = response.number;
                }
                if (response.hasnewgoods) {
                    // 显示有新消息
                    $('.index-newgoods').style.display = 'block';
                }
            }
        };
        xhr.send();
    }, 3000);
    window.onerror = function (errorMsg, url, lineNumber) {
        alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
    };
});