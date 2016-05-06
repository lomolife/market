// 字符串变为 DOM
function parseToDOM(str){
   var div = document.createElement("div");
   if(typeof str == "string")
       div.innerHTML = str;
   return div.childNodes;
}

document.addEventListener('DOMContentLoaded', function (event) {
    let $$ = selectors => {
        return document.querySelector(selectors);
    }
    // 判断用户设备
    let deviceAgent = navigator.userAgent.toLowerCase();
    let agendID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    // 利用Ajax加载数据
    // 请求用户的商品数据
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/market/api/good/${openid}/${goodid}`);
    xhr.onreadystatechange = function ready () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response =  JSON.parse(xhr.responseText);
            // 利用返回的数据渲染页面
            let good = response.good;
            let owner = response.owner;
            (Array.from(good.picture)).forEach( function(element, index) {
                let html = document.createElement('li');
                html.style.backgroundImage = `url(${element})`;
                $$('.banner > ul').appendChild(html);
            });
            $(function() {
                $('.banner').unslider({
                    dots: true
                });
            });
            $$('.goo-price').innerText = good.price;
            $$('.goo-cost').innerText = good.cost;
            $$('.goo-message>h6:first-child').innerText = '发布于'+good.date;
            $$('.goo-place').innerText = good.address;
            $$('.goo-describe').innerText = good.describe;
            good.tags.forEach( function(tag, index) {
                let li = document.createElement('li');
                li.className = 'push-tag-choosed';
                li.innerText = tag;
                $$('.goo-tags').appendChild(li);
            });
            $$('.goo-owner>img').src = owner.headimgurl;
            $$('.goo-owner-name').innerText = owner.nickname;
            if (owner.sex == 1) {
                $$('#goo-owner-sex').className = 'ui-icon-male';
            } else {
                $$('#goo-owner-sex').className = 'ui-icon-female';
            }
            // 提问板块待加载
            if (good.comments !== undefined) {
                good.comments.forEach( function(comment, index) {
                let userid = comment[0];
                let userMessage = comment[2];
                let sexHTML;
                if (userMessage.sex == 1) {
                    sexHTML = '<i class="ui-icon-male"></i>';
                } else {
                    sexHTML = '<i class="ui-icon-female"></i>';
                }
                $$('#goo-ask').appendChild((parseToDOM(`
                    <li class="ask-item">
                        <div class="ask-item-head"><img src="${userMessage.headimgurl}" alt="nickname"></div>
                        <div class="ask-item-body">
                            <div class="good-message-owner">
                                <div class="ui-flex ui-flex-align-start">
                                    <span>${userMessage.nickname}${sexHTML}</span>
                                </div>
                                <div class="ui-flex ui-flex-align-end">
                                    <span class="ui-txt-info">${comment[1][0].date}</span>
                                </div>
                            </div>
                            <ul class="ask-item-body-content">
                            </ul>
                        </div>
                    </li>
                    `.trim()))[0]);
                // 加载一个评论
                comment[1].forEach( function(content, index) {
                    let html = document.createElement('li');
                    // 每一条评论都加载
                    if (userid === content.replyID) {
                        html.innerHTML = owner.nickname + ' 回复 ' + userMessage.nickname + ' : ' + content.content;
                        html.setAttribute('data-usernickname', owner.nickname);
                        html.setAttribute('data-replynickname', userMessage.nickname);
                    } else {
                        html.innerHTML = userMessage.nickname + ' 回复 ' + owner.nickname + ' : ' + content.content;
                        html.setAttribute('data-usernickname', userMessage.nickname);
                        html.setAttribute('data-replynickname', owner.nickname);
                    }
                    if (ownerOpenid === content.replyID) {
                        html.setAttribute('data-userid', content.userID);
                        html.setAttribute('data-replyid', content.replyID);
                    }
                    $$('.ask-item-body-content').appendChild(html);
                });
                // 给可回复的 li 标签增加点击事件
                $$('#goo-ask').addEventListener('click', function (event) {
                    if (event.target.getAttribute('data-replyid') === ownerOpenid) {
                        // 弹出提问输入框
                        $$('.ask-input').style.display = 'block';
                        $$('.ask-input .weui_textarea').setAttribute('placeholder', `回复${event.target.getAttribute('data-usernickname')}:`)
                        // 发送按钮事件绑定
                        $$('.ask-input .weui_btn_mini').onclick = function () {
                            // 验证表单
                            // 传送数据
                            let form = new FormData();
                            let xhr = new XMLHttpRequest();
                            form.append('userID', ownerOpenid);
                            form.append('replyID', event.target.getAttribute('data-userid'));
                            form.append('content', $$('.ask-input .weui_textarea').value);
                            xhr.open('PUT', `/market/api/good/comment/${openid}/${goodid}`);
                            xhr.onreadystatechange = function (event) {
                                if (xhr.readyState === 4 && xhr.status === 200) {
                                    $$('.ask-input').style.display = 'none';
                                }
                            };
                            xhr.send(form);
                        };
                    } else {
                        $$('.goo-question').style.color = '#bbb';
                    }
                });
            });
            }
            // 打电话被加载
            $$('#goo-phone').setAttribute('href', 'tel:'+good.phone);
            // 短信被加载
            if (~agendID.indexOf('iphone')) {
                // 判断 iOS 版本
                let bool = Boolean(navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/i));
                if (bool) {
                    // 如果是 iOS 8 以上
                    $$('#goo-sms').setAttribute('href', `sms:${good.phone}&body=你好，我在学生市场看到你发布的闲置，想咨询一下`);
                } else {
                    $$('#goo-sms').setAttribute('href', `sms:${good.phone};body=你好，我在学生市场看到你发布的闲置，想咨询一下`);
                }
                
            } else {
                $$('#goo-sms').setAttribute('href', `sms:${good.phone}?body=你好，我在学生市场看到你发布的闲置，想咨询一下`);
            }
            // QQ号码被复制
            $$('#goo-qq').setAttribute('data-clipboard-text', good.qq);
            $$('#goo-qq').addEventListener('click', function (event) {
                let clipboard = new Clipboard('#goo-qq');
                clipboard.on('success', function(e) {
                    // 复制成功则显示复制成功的弹窗
                    $$('#toast').style.display = 'block';
                    // 2 秒后消失
                    setTimeout(function () {
                        $$('#toast').style.display = 'none';
                    }, 2000);
                });
            });
            // 给我想要绑定事件
            $$('.goo-want').addEventListener('click', function (event) {
                // 显示actionsheet
                $$('#mask').style.display = 'block';
                $$('#mask').className = 'weui_mask_transition weui_fade_toggle';
                $$('#weui_actionsheet').className = 'weui_actionsheet weui_actionsheet_toggle';
                // 绑定进入商品，编辑，售出等点击事件
                $$('#weui_actionsheet').addEventListener('click', function (event) {
                    if (event.target.innerText === '取消') {
                        $$('#mask').style.display = 'none';
                        $$('#mask').className = 'weui_mask_transition';
                        $$('#weui_actionsheet').className = 'weui_actionsheet';
                    }
                });
            });
        }
    };
    xhr.send();
    // 给提问按钮绑定事件
    if (ownerOpenid !== openid) {
        $$('.goo-question').addEventListener('click', function (event) {
            // 弹出提问输入框
            $$('.ask-input').style.display = 'block';
            // 发送按钮事件绑定
            $$('.ask-input .weui_btn_mini').onclick = function (event) {
                // 验证表单
                // 传送数据
                let form = new FormData();
                let xhr = new XMLHttpRequest();
                form.append('userID', ownerOpenid);
                form.append('replyID', openid);
                form.append('content', $$('.ask-input .weui_textarea').value);
                xhr.open('PUT', `/market/api/good/comment/${openid}/${goodid}`);
                xhr.onreadystatechange = function (event) {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        $$('.ask-input').style.display = 'none';
                    }
                };
                xhr.send(form);
            };
        });
    }
    // 给分享按钮绑定事件
    $$('.goo-share-button').addEventListener('click', function (event) {
        // 显示 share 
        $$('.goo-share').style.display = 'block';
        // 给 share 绑定事件
        $$('.goo-share').addEventListener('click', function (event) {
            this.style.display = 'none';
        });
    });
    // 返回键
    $$('.back').addEventListener('click', function (event) {
        if (document.referrer !== 'http://market.tunnel.qydev.com/market/user/sells') {
            location.href = 'http://market.tunnel.qydev.com/market/user/index';
        }
    });
    // 举报商品
    $$('.report').addEventListener('click', function (event) {
        $$('#goo-report').style.display = 'block';
    });
    $$('#goo-report-cancel').addEventListener('click', function (event) {
        $$('#goo-report').style.display = 'none';
    });
    $$('#goo-report-confirm').addEventListener('click', function (event) {
        // Ajax 提交，更新商品状态
        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `/market/api/good/report/${openid}/${goodid}`);
        xhr.onreadystatechange = function ready (argument) {
            if (xhr.readyState === 4 && xhr.status === 200) {
                $$('#goo-report').style.display = 'none';
            }
        };
        xhr.send();
    });
    window.onerror = function (errorMsg, url, lineNumber) {
        alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
    };
});