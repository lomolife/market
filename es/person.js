import * as content from './content';

document.addEventListener('DOMContentLoaded', function () {
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
});