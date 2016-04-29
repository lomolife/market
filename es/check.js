import * as effect from './effect';
import * as push from './pushModule';

document.addEventListener('DOMContentLoaded', function (event) {
    // 变量初始化
    let $ = selector => {
        return document.querySelector(selector);
    };
    // 加载表单数据
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/market/api/message/datas/${openid}`);
    xhr.onreadystatechange = function (event) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText).message;
            if (response.datas === undefined) {
                // 取消显示其他表单
                $('#phone-box').style.display = 'none';
                $('#qq-box').style.display = 'none';
                $('.push-address').style.display = 'none';
                $('#phone-box input').required = false;
                $('#qq-box input').required = false;
                $('.push-address input').required = false;
            } else {
                // 加载默认项
                let form  = document.forms[0];
                (Object.keys(response.datas)).forEach( function(key, index) {
                    form[key]['value'] = response.datas[key];
                });
                form.schoolID.setAttribute('readonly', true);
                form.password.setAttribute('readonly', true);
                form.address.setAttribute('readonly', true);
            }
        }
    };
    xhr.send();
    // 表单地点点击事件绑定
    $('.push-address').addEventListener('click', effect.clickPushAddress);
    // 表单元素被聚焦的事件绑定
    let inputs = document.querySelectorAll('.weui_input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('focus', push.showClear);
        inputs[i].addEventListener('blur', push.hideClear);
    }
    // .push-tip .ui-icon-close 事件绑定
    $('.push-tip .ui-icon-close').addEventListener('click', function (event) {
        $('.push-tip').style.display = 'none';
        $('#push-tip').innerHTML = '';
    });
    // 点击提交按钮执行 ajax 请求
    $('.push-button > a').addEventListener('click', function (event) {
        let errorMsg = "";
        // 表单验证是否通过
        if (!document.forms[0].checkValidity()) {
            $('.push-tip').style.display = 'block';
            let count = 0;  // 计时器
            // 未通过则检查
            Array.from(document.forms[0]).forEach( function(input, index) {
                if (!input.checkValidity()) {
                    (function (input, count) {
                        setTimeout(function (event) {
                            $('#push-tip').innerHTML = input.getAttribute('required') || input.validationMessage;
                        }, count*1500);
                    })(input, count);
                    count = count + 1;
                }
                if (index === document.forms[0].length-1) {
                    setTimeout(function (event) {
                        $('.push-tip').style.display = 'none';
                        $('#push-tip').innerHTML = "";
                        count = 0;
                    }, (count)*1500);
                }
            });
            return;
        }
        // 表单提交
        let form = new FormData($('#checkForm'));
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `/market/api/message/datas/${openid}`);
        xhr.onreadystatechange = function ready () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                location.href = 'index';
            }
        };
        xhr.send(form);
    });
});