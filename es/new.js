document.addEventListener('DOMContentLoaded', function (event) {
    // 页面加载完成后，向服务器请求用户数据
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/market/api/message/wechat/${openid}`);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 将头像替换进去
            let head = document.querySelector('.new-banner img');
            let name = document.querySelector('.new-banner span');
            response = JSON.parse(responseText);
            head.src = response.message.headimgurl;
            name.innerText = response.message.nickname;
        }
    }
    xhr.send();
});