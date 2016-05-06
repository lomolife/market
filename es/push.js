import * as effect from './effect';
import * as push from './pushModule';

document.addEventListener('DOMContentLoaded', function (event) {
    let $ = selectors => {
        return document.querySelector(selectors);
    };
    let imgNumber;
    let number;
    let fileList = [];
    // 拉取后台数据
    if (goodid === 'new') {
        // 则只需拉取用户信息
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `/market/api/message/datas/${openid}`);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = (JSON.parse(xhr.responseText)).message.datas;
                let form = document.forms[0];
                if (response.phone) {
                    form.phone.value = Number(response.phone);
                }
                if (response.qq) {
                    form.qq.value = Number(response.qq);
                }
                if (response.address) {
                    $('.push-address-value').innerText = response.address;
                }
                number = { value: 4 };
            }
        };
        xhr.send();
    } else {
        // 拉取该商品的信息
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `/market/api/good/${openid}/${goodid}`);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = (JSON.parse(xhr.responseText)).good;
                let html = '';
                let form = document.forms[0];
                form.describe.value = response.describe;
                form.price.value = Number(response.price);
                form.cost.value = Number(response.cost);
                form.phone.value = Number(response.phone);
                form.qq.value = Number(response.qq);
                $('.push-address-value').innerText = response.address;
                $('.push-tag-value').innerText = (response.tags).join(' ');
                // 图片版块
                (response.picture).forEach( function(picture, index) {
                    if (index === 0) {
                        html += `<li class="weui_uploader_file weui_uploader_status" style="background-image: url(${picture})">
                                    <i class="material-icons">close</i>
                                    <div class="weui_uploader_status_content">首图</div>
                                </li>`;
                    } else {
                        html += `<li class="weui_uploader_file" style="background-image: url(${picture})">
                                    <i class="material-icons">close</i>
                                </li>`;
                    }
                });
                $('.push-picture').innerHTML = html;
                imgNumber = $('.push-picture').childNodes.length;
                if (imgNumber > 0) {
                    number = { value: 4 - imgNumber }; // 图片选择数量
                } else {
                    number = { value: 4 };
                }
                // 初始化 fileList
                for (var i = 0; i < imgNumber; i++) {
                    fileList[i] = 'oldimg';
                }
            }
        };
        xhr.send();
    }
    // 描述字数
    $('#pushForm .weui_textarea').addEventListener('input', function (event) {
        let value = this.value.length;
        $('.words-sign').innerText = `${value}/200`;
        if (value > 200) {
            this.value = this.value.slice(0, 200);
            $('.words-sign').innerText = '200/200';
        }
    });
    // 表单图片选择事件绑定
    $('.push-picture-button input').addEventListener('change', function (event) {
        push.addPicture(event, number, fileList);
    });
    // 表单图片删除事件绑定
    $('.push-picture').addEventListener('click', function (event) {
        if (event.target.tagName.toUpperCase() === 'I') {
            // 第几个元素
            let index = Array.from(event.target.parentElement.parentElement.children).indexOf(event.target.parentElement);
            // 删除图片
            event.target.parentElement.parentElement.removeChild(
                event.target.parentElement.parentElement.children[index]
                );
            // 删除 flielist 里面的
            fileList.splice(index, 1);
            // number.value可以增加一个
            number.value++;
            if (number.value > 0) {
                $('.push-picture-button').style.display = 'block';
            }
        }
    });
    // 表单地点点击事件绑定
    $('.push-address').addEventListener('click', effect.clickPushAddress);
    // 表单价格区域的事件绑定
    $('#push-price').addEventListener('change', push.checkPrice);
    $('#push-cost').addEventListener('change', push.checkPrice);
    // 表单元素被聚焦的事件绑定
    let inputs = document.querySelectorAll('.weui_input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('focus', push.showClear);
        inputs[i].addEventListener('blur', push.hideClear);
    }
    // 表单标签事件绑定
    $('.push-tag').addEventListener('click', function (event) {
        push.chooseTag(event, totalTags);
    });
    // 表单提交事件
    $('.push-button a').addEventListener('click', function (event) {
        push.pushForm(event, fileList);
    });
    // 提示关闭事件
    $('.push-tip ui-icon-close').addEventListener('click', function (event) {
        $('.push-tip').style.display = 'none';
        $('#push-tip').innerHTML = "";
    });
    window.onerror = function (errorMsg, url, lineNumber) {
        alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
    };
});