import { $ } from './common/js/query';
import ajax from './common/js/ajax';

/**
 * 用户验证提交页面
 * 
 */
document.addEventListener('DOMContentLoaded', function () {
    // 点击提交按钮执行 ajax 请求
    $('.push-button > a').addEventListener('click', function () {
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
        
    });
});