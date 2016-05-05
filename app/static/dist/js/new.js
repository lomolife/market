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
/***/ function(module, exports) {

	'use strict';

	document.addEventListener('DOMContentLoaded', function (event) {
	    // 页面加载完成后，向服务器请求用户数据
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', '/market/api/message/wechat/' + openid);
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState === 4 && xhr.status === 200) {
	            // 将头像替换进去
	            var head = document.querySelector('.new-banner img');
	            var name = document.querySelector('.new-banner span');
	            var response = JSON.parse(xhr.responseText);
	            head.src = response.message.headimgurl;
	            name.innerText = response.message.nickname;
	        }
	    };
	    xhr.send();
	});

/***/ }
/******/ ]);
//# sourceMappingURL=new.js.map
