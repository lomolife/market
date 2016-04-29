// 导入模块
import * as logic from './logic';

let $ = selectors => {
    return document.querySelector(selectors);
};

// 弹窗效果，参数是DOM对象，事件对象和一个回调函数
export function dialog (object, event, callback = () => {}) {
    // 判断 DOM 对象 data-is-check 是否为真
    let isCheck = logic.isCheck(dialogCheck);
    // 如果是未验证状态则弹出要验证的窗口
    if (!isCheck) {
        // 取消默认事件
        event.preventDefault();
        // 窗体
        let dialog = document.querySelector('.check-dialog');
        dialog.style.display = 'block';
        dialog.onclick = function (event) {
            if (event.target.className === 'weui_btn_dialog default') {
                // 如果点击的是取消
                dialog.style.display = 'none';
            } else if (event.target.className === 'weui_btn_dialog primary') {
                // 如果点击的是确定
                dialog.style.display = 'none';
                // 重定向到验证页面
                location.href = 'check';
            }
        };
    } else {
        // 如果验证了要执行的函数
        callback();
    }
}

// 点击表单弹出选项的效果
export function clickPushAddress (event) {
    let address;
    $('.push-address-choose').style.display = 'block';
    // 地址选择器的点击事件
    $('.push-address-choose').onclick = function confirm (event) {
        // 如果选中父元素，则当前元素变灰，并加载子元素
        if (event.target.id === 'south') {
            $('#south').style.backgroundColor = '#F5F5F5';
            $('#north').style.backgroundColor = 'white';
            $('.south-child').style.display = 'block';
            $('.north-child').style.display = 'none';
        } else if (event.target.id === 'north') {
            $('#north').style.backgroundColor = '#F5F5F5';
            $('#south').style.backgroundColor = 'white';
            $('.north-child').style.display = 'block';
            $('.south-child').style.display = 'none';
        } else if (event.target.getAttribute('data-address')) {
            address = event.target.getAttribute('data-address');
        } else if (event.target.id === 'address-cancel') {
            $('.push-address-choose').style.display = 'none';
        } else if (event.target.id === 'address-ok') {
            if (address) {
                if ($(".push-address-value").tagName.toUpperCase() === 'INPUT') {
                    $('.push-address-value').value = address;
                } else {
                    $('.push-address-value').innerHTML = address;
                }
            }
            $('.push-address-choose').style.display = 'none';
        }
    };
}