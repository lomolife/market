// 该页面用到的接口
// /goods/limit/<keyword>/<tag>/<address>/<sorts>/<num>
// # 返回有限制的商品
// # keyword根据关键字来查，tag根据标签来查，address根据地点来查，sorts根据排序规则
// # sorts 的排序规则为 none, cheep(价格从低到高), expense(价格从高到低), date
// # 其他的查询规则未给定字符串均为 none
import * as content from './content';

// 字符串变为 DOM
function parseToDOM(str){
   var div = document.createElement("div");
   if(typeof str == "string")
       div.innerHTML = str;
   return div.childNodes;
}
// 标签DOM对象生成器，参数是数组，返回HTML字符串
function convertTag (array) {
    let response = '';
    array.forEach( function(element, index) {
        response += `<li class="ui-border-b ui-arrowlink" data-tag='${element}'>${element}</li>`;
    });

    return response;
}

document.addEventListener('DOMContentLoaded', function () {
    let $ = selectors => {
        return document.querySelector(selectors);
    };
    // 得到父标签数组和子标签数组
    let keys = Object.keys(totalTags);
    let values = Object.values(totalTags);
    // 标签搜索插件初始化
    let demoKeyword = new jsKeyword();
    let searchList = [];
    demoKeyword.init();
    values.forEach( function(element, index) {
        searchList = searchList.concat(element);
    });
    // 将数据推入数组中
    demoKeyword.push(searchList);
    // 搜索框输入的事件
    $('.push-tag-search input').oninput = function (event) {
        let keywords = this.value, response = '', array;
        // 获得查找到的数组
        array = demoKeyword.autoComplete(keywords);
        // 将数组变成HTML字符串
        array.forEach( function(element, index) {
            response += `<li data-tag="${element}">${element}</li>`;
        });
        $('.push-tag-result').innerHTML = response;
    };
    // 点击 push-tag-result 中的 li 标签的事件代理
    $('.push-tag-result').addEventListener('click', function (event) {
        if (event.target.tagName.toUpperCase() === 'LI') {
            location.href = location.href + '#' + event.target.innerText;
            // 显示搜索选项，隐藏标签超市
            $('.search-box').style.display = 'block';
            $('.tag-market').style.display = 'none';
            // num 置零
            num = 0;
            // 获取该标签的 data-tag
            let keyword = event.target.getAttribute('data-tag'),
                tag = 'none', address = 'none', sorts = 'none';
            // 点击加载更多
            $('.click-more').onclick = function (event) {
                // 发送搜索请求并返回数据
                let xhr = new XMLHttpRequest();
                xhr.open('GET', `/market/api/goods/limit/${keyword}/${tag}/${address}/${sorts}/${num}`);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        // 成功返回数据后的操作
                        // 显示 search-result
                        $('.search-result').style.display = 'block';
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
            };
            // 发送搜索请求并返回数据
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `/market/api/goods/limit/${keyword}/${tag}/${address}/${sorts}/${num}`);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // 成功返回数据后的操作
                    // 显示 search-result
                    $('.search-result').style.display = 'block';
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
                    $('.goods').innerHTML = '';
                    Array.from(parseToDOM(goodHTML)).forEach( function(element, index) {
                        if (index % 2 == 1) {
                            $('.goods').appendChild(element);
                        }
                    });
                    num = response.num;
                    // 选择标签事件
                    $('.search-menu-tag').onclick = function () {
                        $('.search-choose').style.display = 'block';
                        $('.search-choose-tag').setAttribute('data-active', 'active');
                        $('.search-choose-address').setAttribute('data-active', 'none');
                        $('.search-choose-sorts').setAttribute('data-active', 'none');
                        // 加载父标签
                        $('.push-tag-parent > ul').innerHTML = convertTag(keys);
                        // 为父标签绑定事件
                        $('.push-tag-parent > ul').onclick = function (event) {
                            if (event.target.tagName.toUpperCase() === 'LI') {
                                let key = event.target.getAttribute('data-tag');
                                $('.push-tag-child > ul').innerHTML = convertTag(totalTags[key]);
                                // 为子元素绑定事件
                                $('.push-tag-child > ul').onclick = function (event) {
                                    if (event.target.tagName.toUpperCase() === 'LI') {
                                        num = 0;
                                        tag = event.target.innerText;
                                        // 菜单栏改变
                                        $('.search-menu-tag').innerText = tag;
                                        // $('.search-choose-tag')
                                        $('.search-choose-tag').setAttribute('data-active', 'none');
                                        $('.search-choose').style.display = 'none';
                                        // 发送搜索请求并返回数据
                                        let xhr = new XMLHttpRequest();
                                        xhr.open('GET', `/market/api/goods/limit/${keyword}/${tag}/${address}/${sorts}/${num}`);
                                        xhr.onreadystatechange = function () {
                                            if (xhr.readyState === 4 && xhr.status === 200) {
                                                // 成功返回数据后的操作
                                                // 显示 search-result
                                                $('.search-result').style.display = 'block';
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
                                                $('.goods').innerHTML = '';
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
                                };
                            }
                        };
                    };
                    // 地址选择事件
                    // 地址选择器的点击事件
                    $('.search-menu-address').onclick = function (event) {
                        $('.search-choose').style.display = 'block';
                        $('.search-choose-tag').setAttribute('data-active', 'none');
                        $('.search-choose-address').setAttribute('data-active', 'active');
                        $('.search-choose-sorts').setAttribute('data-active', 'none');
                        // search-choose-address
                        $('.search-choose-address').onclick = function (event) {
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
                                num = 0;
                                address = event.target.getAttribute('data-address');
                                // 菜单栏改变
                                $('.search-menu-address').innerText = address;
                                // $('.search-choose-address')
                                $('.search-choose-address').setAttribute('data-active', 'none');
                                $('.search-choose').style.display = 'none';
                                // 发送搜索请求并返回数据
                                let xhr = new XMLHttpRequest();
                                xhr.open('GET', `/market/api/goods/limit/${keyword}/${tag}/${address}/${sorts}/${num}`);
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === 4 && xhr.status === 200) {
                                        // 成功返回数据后的操作
                                        // 显示 search-result
                                        $('.search-result').style.display = 'block';
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
                                        $('.goods').innerHTML = '';
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
                        };
                    };
                    // 排序的点击事件
                    $('.search-menu-sorts').onclick = function () {
                        $('.search-choose').style.display = 'block';
                        $('.search-choose-tag').setAttribute('data-active', 'none');
                        $('.search-choose-address').setAttribute('data-active', 'none');
                        $('.search-choose-sorts').setAttribute('data-active', 'active');
                        // 为search-choose-sorts绑定事件
                        $('.search-choose-sorts').onclick = function (event) {
                            if (event.target.tagName.toUpperCase() === 'LI') {
                                num = 0;
                                sorts = event.target.innerText;
                                // 菜单栏文字改变
                                $('.search-menu-sorts').innerText = sorts;
                                if (sorts === '默认排序') {
                                    sorts = 'none';
                                } else if (sorts === '价格从低到高') {
                                    sorts = 'cheep';
                                } else if (sorts === '价格从高到低') {
                                    sorts = 'expense';
                                } else if (sorts === '最新发布') {
                                    sorts = 'date';
                                }
                                // $('.search-choose-tag')
                                $('.search-choose-sorts').setAttribute('data-active', 'none');
                                $('.search-choose').style.display = 'none';
                                // 发送搜索请求并返回数据
                                let xhr = new XMLHttpRequest();
                                xhr.open('GET', `/market/api/goods/limit/${keyword}/${tag}/${address}/${sorts}/${num}`);
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === 4 && xhr.status === 200) {
                                        // 成功返回数据后的操作
                                        // 显示 search-result
                                        $('.search-result').style.display = 'block';
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
                                        $('.goods').innerHTML = '';
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
                        };
                    };
                }
            };
            xhr.send();
            // 清除 push-tag-result 的内容
            $('.push-tag-result').innerHTML = '';
            // 标签超市隐藏
            $('.tag-market').style.display = 'none';
        }
    });
    // 点击黑框会消失
    $('.search-choose').addEventListener('click', function (event) {
        if (event.target.className === 'search-choose') {
            $('.search-choose').style.display = 'none';
            $('.search-choose-tag').setAttribute('data-active', 'none');
            $('.search-choose-address').setAttribute('data-active', 'none');
            $('.search-choose-sorts').setAttribute('data-active', 'none');
        }
    });
    // 点击标签超市
    $('.search-tag').addEventListener('click', function (event) {
        // 如果是子项
        if (event.target.className.toLowerCase() === 'ui-nowrap ui-whitespace search-tag-choosed') {
            location.href = location.href + '#' + event.target.innerText;
            // 显示搜索选项，隐藏标签超市，搜索框的值设置
            $('.search-box').style.display = 'block';
            $('.tag-market').style.display = 'none';
            $('.push-tag-search-box .weui_input').value = event.target.innerText;
            // num 置零
            num = 0;
            // 获取该标签的 data-tag
            let tag = event.target.innerText.replace('/', '&'),
                keyword = 'none', address = 'none', sorts = 'none';
            // 点击加载更多
            $('.click-more').onclick = function (event) {
                // 发送搜索请求并返回数据
                let xhr = new XMLHttpRequest();
                xhr.open('GET', `/market/api/goods/limit/${keyword}/${tag}/${address}/${sorts}/${num}`);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        // 成功返回数据后的操作
                        // 显示 search-result
                        $('.search-result').style.display = 'block';
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
            };
            // 发送搜索请求并返回数据
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `/market/api/goods/limit/${keyword}/${tag}/${address}/${sorts}/${num}`);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // 成功返回数据后的操作
                    // 显示 search-result
                    $('.search-result').style.display = 'block';
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
                    $('.goods').innerHTML = '';
                    Array.from(parseToDOM(goodHTML)).forEach( function(element, index) {
                        if (index % 2 == 1) {
                            $('.goods').appendChild(element);
                        }
                    });
                    num = response.num;
                    // 选择标签事件
                    $('.search-menu-tag').onclick = function () {
                        $('.search-choose').style.display = 'block';
                        $('.search-choose-tag').setAttribute('data-active', 'active');
                        $('.search-choose-address').setAttribute('data-active', 'none');
                        $('.search-choose-sorts').setAttribute('data-active', 'none');
                        // 加载父标签
                        $('.push-tag-parent > ul').innerHTML = convertTag(keys);
                        // 为父标签绑定事件
                        $('.push-tag-parent > ul').onclick = function (event) {
                            if (event.target.tagName.toUpperCase() === 'LI') {
                                let key = event.target.getAttribute('data-tag');
                                $('.push-tag-child > ul').innerHTML = convertTag(totalTags[key]);
                                // 为子元素绑定事件
                                $('.push-tag-child > ul').onclick = function (event) {
                                    if (event.target.tagName.toUpperCase() === 'LI') {
                                        num = 0;
                                        tag = event.target.innerText;
                                        // $('.search-choose-tag')
                                        $('.search-choose-tag').setAttribute('data-active', 'none');
                                        $('.search-choose').style.display = 'none';
                                        // 发送搜索请求并返回数据
                                        let xhr = new XMLHttpRequest();
                                        xhr.open('GET', `/market/api/goods/limit/${keyword}/${tag}/${address}/${sorts}/${num}`);
                                        xhr.onreadystatechange = function () {
                                            if (xhr.readyState === 4 && xhr.status === 200) {
                                                // 成功返回数据后的操作
                                                // 显示 search-result
                                                $('.search-result').style.display = 'block';
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
                                                $('.goods').innerHTML = '';
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
                                };
                            }
                        };
                    };
                    // 地址选择事件
                    // 地址选择器的点击事件
                    $('.search-menu-address').onclick = function (event) {
                        $('.search-choose').style.display = 'block';
                        $('.search-choose-tag').setAttribute('data-active', 'none');
                        $('.search-choose-address').setAttribute('data-active', 'active');
                        $('.search-choose-sorts').setAttribute('data-active', 'none');
                        // search-choose-address
                        $('.search-choose-address').onclick = function (event) {
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
                                num = 0;
                                address = event.target.getAttribute('data-address');
                                // $('.search-choose-address')
                                $('.search-choose-address').setAttribute('data-active', 'none');
                                $('.search-choose').style.display = 'none';
                                // 发送搜索请求并返回数据
                                let xhr = new XMLHttpRequest();
                                xhr.open('GET', `/market/api/goods/limit/${keyword}/${tag}/${address}/${sorts}/${num}`);
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === 4 && xhr.status === 200) {
                                        // 成功返回数据后的操作
                                        // 显示 search-result
                                        $('.search-result').style.display = 'block';
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
                                        $('.goods').innerHTML = '';
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
                        };
                    };
                    // 排序的点击事件
                    $('.search-menu-sorts').onclick = function () {
                        $('.search-choose').style.display = 'block';
                        $('.search-choose-tag').setAttribute('data-active', 'none');
                        $('.search-choose-address').setAttribute('data-active', 'none');
                        $('.search-choose-sorts').setAttribute('data-active', 'active');
                        // 为search-choose-sorts绑定事件
                        $('.search-choose-sorts').onclick = function (event) {
                            if (event.target.tagName.toUpperCase() === 'LI') {
                                num = 0;
                                sorts = event.target.innerText;
                                if (sorts === '默认排序') {
                                    sorts = 'none';
                                } else if (sorts === '价格从低到高') {
                                    sorts = 'cheep';
                                } else if (sorts === '价格从高到低') {
                                    sorts = 'expense';
                                } else if (sorts === '最新发布') {
                                    sorts = 'date';
                                }
                                // $('.search-choose-tag')
                                $('.search-choose-sorts').setAttribute('data-active', 'none');
                                $('.search-choose').style.display = 'none';
                                // 发送搜索请求并返回数据
                                let xhr = new XMLHttpRequest();
                                xhr.open('GET', `/market/api/goods/limit/${keyword}/${tag}/${address}/${sorts}/${num}`);
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === 4 && xhr.status === 200) {
                                        // 成功返回数据后的操作
                                        // 显示 search-result
                                        $('.search-result').style.display = 'block';
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
                                        $('.goods').innerHTML = '';
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
                        };
                    };
                }
            };
            xhr.send();
        }
    });
    window.onhashchange = function(){
        if (!/#/.test(location.href)) {
            // 显示搜索选项，隐藏标签超市
            $('.search-box').style.display = 'none';
            $('.tag-market').style.display = 'block';
        }
    }
});