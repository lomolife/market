/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _content = __webpack_require__(1);

	var content = _interopRequireWildcard(_content);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	document.addEventListener('DOMContentLoaded', function (event) {
	    var $ = function $(selectors) {
	        return document.querySelector(selectors);
	    };
	    // 请求用户的商品数据
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', '/market/api/goods/sells/' + openid);
	    xhr.onreadystatechange = function ready() {
	        if (xhr.readyState === 4 && xhr.status === 200) {
	            (function () {
	                var response = JSON.parse(xhr.responseText);
	                var goodHTML = "";
	                // 将获取的数据格式化并加入商品列表
	                response.goods.forEach(function (good, index) {
	                    goodHTML += content.generateGood(good, response.owner);
	                });
	                $('.goods').innerHTML = goodHTML;
	            })();
	        }
	    };
	    xhr.send();
	    // 为商品提供点击事件
	    $('.goods').addEventListener('click', function (event) {
	        // 阻止默认事件
	        event.preventDefault();
	        // 获取事件元素的临近 a 标签
	        if (event.target.className === 'good-link') {
	            (function () {
	                var goodElement = event.target;
	                // 获取点击对象的链接
	                var link = event.target.getAttribute('href');
	                // 处理链接，并获取 openid 和 goodid
	                var linkArr = link.split('/');
	                var openid = linkArr[4];
	                var goodid = linkArr[5];
	                // 显示actionsheet
	                $('#mask').style.display = 'block';
	                $('#mask').className = 'weui_mask_transition weui_fade_toggle';
	                $('#weui_actionsheet').className = 'weui_actionsheet weui_actionsheet_toggle';
	                // 绑定进入商品，编辑，售出等点击事件
	                $('#weui_actionsheet').addEventListener('click', function (event) {
	                    if (event.target.innerText === '进入商品') {
	                        // 则进入商品网址
	                        location.href = '/market/user/good/' + openid + '/' + goodid;
	                    }
	                    if (event.target.innerText === '编辑') {
	                        // 则进入编辑页面
	                        location.href = '/market/user/push/edit/' + openid + '/' + goodid;
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
	                            var xhr = new XMLHttpRequest();
	                            xhr.open('DELETE', '/market/api/good/' + openid + '/' + goodid);
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
	            })();
	        }
	    });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.generateGood = generateGood;
	// 用 JS 代码来生成 HTML 的内容，参数是商品对象，用户信息对象， 返回HTML字符串
	function generateGood(message, owner) {
	    var sexHTML = void 0;
	    function tagsToHTML(tags) {
	        var response = '';
	        tags.forEach(function (element, index) {
	            response += '<label class="ui-label">' + element + '</label>';
	        });
	        return response;
	    }
	    if (owner.sex == 1) {
	        sexHTML = '<i class="ui-icon-male"></i>';
	    } else {
	        sexHTML = '<i class="ui-icon-female"></i>';
	    }
	    var response = '\n            <li class="ui-whitespace good">\n                <div class="ui-border-t good-tag">\n                    ' + tagsToHTML(message.tags) + '\n                </div>\n                <a href="/market/user/good/' + owner.openid + '/' + message.id + '" class="good-link">\n                    <div class="ui-row-flex">\n                        <div class="ui-col">\n                            <img class="good-banner" src="' + message.picture[0] + '" alt="首图">\n                        </div>\n                        <div class="ui-col ui-col-2 ui-row-flex ui-row-flex-ver good-content">\n                            <div class="ui-col-2">\n                                <h1 class="ui-nowrap-multi ui-flex-pack-start ui-col-3 good-topic">' + message.describe + '</h1>\n                            </div>\n                            <h2 class="ui-col good-price">¥' + message.price + '<i class="good-cost">¥' + message.cost + '</i></h2>\n                        </div>\n                    </div>\n                    <ul class="ui-justify-flex good-message">\n                        <li>\n                            <div class="ui-row-flex">\n                                <img class="ui-avatar" src="' + owner.headimgurl + '"></img>\n                                <div class="good-message-owner">\n                                    <div class="ui-flex ui-flex-align-start">\n                                        <span>' + owner.nickname + sexHTML + '</span>\n                                    </div>\n                                    <div class="ui-flex ui-flex-align-end">\n                                        <span class="ui-txt-info">' + message.date + '</span>\n                                    </div>\n                                </div>\n                            </div>\n                        </li>\n                        <li>\n                            <div class="ui-row-flex">\n                                <i class="ui-icon-pin ui-txt-info"></i>\n                                <span class="ui-flex ui-flex-align-center ui-txt-info">' + message.address + '</span>\n                            </div>\n                        </li>\n                    </ul>\n                </a>\n            </li>';

	    return response;
	}

/***/ }
/******/ ]);
//# sourceMappingURL=sells.js.map
