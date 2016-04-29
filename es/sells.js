import * as content from './content';

document.addEventListener('DOMContentLoaded', function (event) {
    let $ = selectors => {
        return document.querySelector(selectors);
    };
    // 请求用户的商品数据
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/market/api/goods/sells/${openid}`);
    xhr.onreadystatechange = function ready () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response =  JSON.parse(xhr.responseText);
            let goodHTML = "";
            // 将获取的数据格式化并加入商品列表
            response.goods.forEach( function(good, index) {
                goodHTML += content.generateGood(good, response.owner);
            });
            $('.goods').innerHTML = goodHTML;
        }
    };
    xhr.send();
    // 为商品提供点击事件
    $('.goods').addEventListener('click', function (event) {
        // 阻止默认事件
        event.preventDefault();
        // 获取事件元素的临近 a 标签
        if (event.target.className === 'good-link') {
            let goodElement = event.target;
            // 获取点击对象的链接
            let link = event.target.getAttribute('href');
            // 处理链接，并获取 openid 和 goodid
            let linkArr = link.split('/');
            let openid = linkArr[4];
            let goodid = linkArr[5];
            // 显示actionsheet
            $('#mask').style.display = 'block';
            $('#mask').className = 'weui_mask_transition weui_fade_toggle';
            $('#weui_actionsheet').className = 'weui_actionsheet weui_actionsheet_toggle';
            // 绑定进入商品，编辑，售出等点击事件
            $('#weui_actionsheet').addEventListener('click', function (event) {
                if (event.target.innerText === '进入商品') {
                    // 则进入商品网址
                    location.href = `/market/user/good/${openid}/${goodid}`;
                }
                if (event.target.innerText === '编辑') {
                    // 则进入编辑页面
                    location.href = `/market/user/push/edit/${openid}/${goodid}`;
                }
                if (event.target.innerText === '售出') {
                    // 显示确定窗口
                    $('#goo-report').style.display = 'block';
                        // 出售确定窗口事件
                        $('#goo-report-cancel').addEventListener('click', function (event) {
                            $('#goo-report').style.display = 'none';
                        });
                        $('#goo-report-confirm').addEventListener('click', function (event) {
                            // 执行出售操作，Ajax
                            let xhr = new XMLHttpRequest();
                            xhr.open('DELETE', `/market/api/good/${openid}/${goodid}`);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4 && xhr.status === 200) {
                                    // 显示已完成的弹窗
                                    $('#goo-report').style.display = 'none';
                                    $('#toast').style.display = 'block';
                                    setTimeout(function () {
                                        $('#toast').style.display = 'none';
                                    }, 2000);
                                    // 删除节点
                                    goodElement.parentNode.parentNode.removeChild(goodElement.parentNode);
                                    $('#mask').style.display = 'none';
                                    $('#mask').className = 'weui_mask_transition';
                                }
                            };
                            xhr.send();
                        });
                }
                if (event.target.innerText === '取消') {
                    $('#mask').style.display = 'none';
                    $('#mask').className = 'weui_mask_transition';
                    $('#weui_actionsheet').className = 'weui_actionsheet';
                }
            });
        }
    });
});