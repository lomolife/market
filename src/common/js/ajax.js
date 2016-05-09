'use strict';
/**
 * Ajax函数的封装
 * @param {object} options 请求相关的配置，包括 method，url，data，type，success，failed
 */
let ajax = function (options) {
    // 微信浏览器等现代浏览器兼容
    let xhr = new XMLHttpRequest(),
        method = options.method,
        url = options.url,
        type = options.type,
        data = options.data,
        success = options.success,
        failed = options.failed;  // 异常的处理方式
    // Ajax
    xhr.open(method, url);
    if (type) {
        xhr.setRequestHeader('Content-type', type);
    }
    xhr.onreadystatechange = function () {
        // 设置一个超时定时器
        let timeout = setTimeout(function () {
            if (xhr.readyState !== 4) {
                // -1 代表超时
                ajaxStatus(-1, -1);
            }
        }, 20000);
        // 不同状态的提示，辅助函数
        ajaxStatus(xhr.readyState || -1, xhr.status || undefined);
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 清除超时定时器
            clearTimeout(timeout);
            // 执行 success 回调函数
            success();
        } else {
            // 执行 failed 回调函数
            failed();
        }
    }
    if (data) {
        xhr.send(data);
    } else {
        xhr.send();
    }
}

/**
 * 配合 Ajax 函数处理异常的 failed 函数，配合 weui 的 toast，loadingToast 使用（见 flask weui 模块）
 * @param {number} readyState Ajax状态码，可选
 * @param {number} status HTTP返回码，可选
 */
let ajaxStatus = function (readyState, status) {
    // 获取 toast，loadingToast元素
    let toast = document.getElementById('toast'),
        loadingToast = document.getElementById('loadingToast');
    // 获取 toast 元素下显示信息的部分的元素
    let toastTip = toast.getElementsByClassName('weui_toast_content')[0];
    if (readyState === 4) {
        switch (status) {
            case 404:
                // 资源未找到，显示 toast 并修改 toast 元素下显示信息的部分
                toast.style.display = 'block';
                toastTip.innerText = '资源未找到';
                break;
            case 500:
                // 服务器内部错误
                toast.style.display = 'block';
                toastTip.innerText = '服务器内部出错';
                break;
            default:
                // 其他错误
                toast.style.display = 'block';
                toastTip.innerText = '遇到了一些问题';
                break;
        }
        setTimeout(function () {
            toast.style.display = 'none';
            toastTip.innerText = '';
        }, 1500);
    } else {
        if (status === -1) {
            // 超时
            toast.style.display = 'block';
            toastTip.innerText = '服务器请求超时';
        } else {
            // 加载中
            loadingToast.style.display = 'block';
            setTimeout(function () {
                 loadingToast.style.display = 'none';
            }, 1500);
        }
    }
}

export default ajax;