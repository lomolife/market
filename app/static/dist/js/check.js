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

	var _typeof2 = __webpack_require__(1);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _from = __webpack_require__(33);

	var _from2 = _interopRequireDefault(_from);

	var _keys = __webpack_require__(49);

	var _keys2 = _interopRequireDefault(_keys);

	var _effect = __webpack_require__(53);

	var effect = _interopRequireWildcard(_effect);

	var _pushModule = __webpack_require__(55);

	var push = _interopRequireWildcard(_pushModule);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	document.addEventListener('DOMContentLoaded', function (event) {
	    // 变量初始化
	    var $ = function $(selector) {
	        return document.querySelector(selector);
	    };
	    // 加载表单数据
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', '/market/api/message/datas/' + openid);
	    xhr.onreadystatechange = function (event) {
	        if (xhr.readyState === 4 && xhr.status === 200) {
	            (function () {
	                var response = JSON.parse(xhr.responseText).message;
	                if (response.datas === undefined) {
	                    // 取消显示其他表单
	                    $('#phone-box').style.display = 'none';
	                    $('#qq-box').style.display = 'none';
	                    $('.push-address').style.display = 'none';
	                    $('#phone-box input').required = false;
	                    $('#qq-box input').required = false;
	                    $('.push-address input').required = false;
	                } else {
	                    (function () {
	                        // 加载默认项
	                        var form = document.forms[0];
	                        (0, _keys2.default)(response.datas).forEach(function (key, index) {
	                            form[key]['value'] = response.datas[key];
	                        });
	                        form.schoolID.setAttribute('readonly', true);
	                        form.password.setAttribute('readonly', true);
	                        form.address.setAttribute('readonly', true);
	                    })();
	                }
	            })();
	        }
	    };
	    xhr.send();
	    // 表单地点点击事件绑定
	    $('.push-address').addEventListener('click', effect.clickPushAddress);
	    // 表单元素被聚焦的事件绑定
	    var inputs = document.querySelectorAll('.weui_input');
	    for (var i = 0; i < inputs.length; i++) {
	        inputs[i].addEventListener('focus', push.showClear);
	        inputs[i].addEventListener('blur', push.hideClear);
	    }
	    // .push-tip .ui-icon-close 事件绑定
	    $('.push-tip .ui-icon-close').addEventListener('click', function (event) {
	        $('.push-tip').style.display = 'none';
	        $('#push-tip').innerHTML = '';
	    });
	    // 点击提交按钮执行 ajax 请求
	    $('.push-button > a').addEventListener('click', function (event) {
	        var errorMsg = "";
	        // 表单验证是否通过
	        if (!document.forms[0].checkValidity()) {
	            var _ret3 = function () {
	                $('.push-tip').style.display = 'block';
	                var count = 0; // 计时器
	                // 未通过则检查
	                (0, _from2.default)(document.forms[0]).forEach(function (input, index) {
	                    if (!input.checkValidity()) {
	                        (function (input, count) {
	                            setTimeout(function (event) {
	                                $('#push-tip').innerHTML = input.getAttribute('required') || input.validationMessage;
	                            }, count * 1500);
	                        })(input, count);
	                        count = count + 1;
	                    }
	                    if (index === document.forms[0].length - 1) {
	                        setTimeout(function (event) {
	                            $('.push-tip').style.display = 'none';
	                            $('#push-tip').innerHTML = "";
	                            count = 0;
	                        }, count * 1500);
	                    }
	                });
	                return {
	                    v: void 0
	                };
	            }();

	            if ((typeof _ret3 === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret3)) === "object") return _ret3.v;
	        }
	        // 表单提交
	        var form = new FormData($('#checkForm'));
	        var xhr = new XMLHttpRequest();
	        xhr.open('POST', '/market/api/message/datas/' + openid);
	        xhr.onreadystatechange = function ready() {
	            if (xhr.readyState === 4 && xhr.status === 200) {
	                location.href = 'index';
	            }
	        };
	        xhr.send(form);
	    });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Symbol = __webpack_require__(2)["default"];

	exports["default"] = function (obj) {
	  return obj && obj.constructor === _Symbol ? "symbol" : typeof obj;
	};

	exports.__esModule = true;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	__webpack_require__(32);
	module.exports = __webpack_require__(11).Symbol;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $              = __webpack_require__(5)
	  , global         = __webpack_require__(6)
	  , has            = __webpack_require__(7)
	  , DESCRIPTORS    = __webpack_require__(8)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(14)
	  , $fails         = __webpack_require__(9)
	  , shared         = __webpack_require__(17)
	  , setToStringTag = __webpack_require__(18)
	  , uid            = __webpack_require__(20)
	  , wks            = __webpack_require__(19)
	  , keyOf          = __webpack_require__(21)
	  , $names         = __webpack_require__(26)
	  , enumKeys       = __webpack_require__(27)
	  , isArray        = __webpack_require__(28)
	  , anObject       = __webpack_require__(29)
	  , toIObject      = __webpack_require__(22)
	  , createDesc     = __webpack_require__(16)
	  , getDesc        = $.getDesc
	  , setDesc        = $.setDesc
	  , _create        = $.create
	  , getNames       = $names.get
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , setter         = false
	  , HIDDEN         = wks('_hidden')
	  , isEnum         = $.isEnum
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , useNative      = typeof $Symbol == 'function'
	  , ObjectProto    = Object.prototype;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(setDesc({}, 'a', {
	    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = getDesc(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  setDesc(it, key, D);
	  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
	} : setDesc;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var isSymbol = function(it){
	  return typeof it == 'symbol';
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(D && has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return setDesc(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key);
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
	    ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  var D = getDesc(it = toIObject(it), key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
	  return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
	  return result;
	};
	var $stringify = function stringify(it){
	  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	  var args = [it]
	    , i    = 1
	    , $$   = arguments
	    , replacer, $replacer;
	  while($$.length > i)args.push($$[i++]);
	  replacer = args[1];
	  if(typeof replacer == 'function')$replacer = replacer;
	  if($replacer || !isArray(replacer))replacer = function(key, value){
	    if($replacer)value = $replacer.call(this, key, value);
	    if(!isSymbol(value))return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var buggyJSON = $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	});

	// 19.4.1.1 Symbol([description])
	if(!useNative){
	  $Symbol = function Symbol(){
	    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString(){
	    return this._k;
	  });

	  isSymbol = function(it){
	    return it instanceof $Symbol;
	  };

	  $.create     = $create;
	  $.isEnum     = $propertyIsEnumerable;
	  $.getDesc    = $getOwnPropertyDescriptor;
	  $.setDesc    = $defineProperty;
	  $.setDescs   = $defineProperties;
	  $.getNames   = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(31)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call((
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
	  'species,split,toPrimitive,toStringTag,unscopables'
	).split(','), function(it){
	  var sym = wks(it);
	  symbolStatics[it] = useNative ? sym : wrap(sym);
	});

	setter = true;

	$export($export.G + $export.W, {Symbol: $Symbol});

	$export($export.S, 'Symbol', symbolStatics);

	$export($export.S + $export.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 5 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 7 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(9)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(6)
	  , core      = __webpack_require__(11)
	  , ctx       = __webpack_require__(12)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 11 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(13);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15);

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(5)
	  , createDesc = __webpack_require__(16);
	module.exports = __webpack_require__(8) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(6)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(5).setDesc
	  , has = __webpack_require__(7)
	  , TAG = __webpack_require__(19)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(17)('wks')
	  , uid    = __webpack_require__(20)
	  , Symbol = __webpack_require__(6).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(5)
	  , toIObject = __webpack_require__(22);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = $.getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(23)
	  , defined = __webpack_require__(25);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(24);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(22)
	  , getNames  = __webpack_require__(5).getNames
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return getNames(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.get = function getOwnPropertyNames(it){
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var $ = __webpack_require__(5);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getSymbols = $.getSymbols;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = $.isEnum
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
	  }
	  return keys;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(24);
	module.exports = Array.isArray || function(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(30);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 32 */
/***/ function(module, exports) {

	

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(34), __esModule: true };

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(35);
	__webpack_require__(41);
	module.exports = __webpack_require__(11).Array.from;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(36)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(38)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(37)
	  , defined   = __webpack_require__(25);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(31)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(14)
	  , hide           = __webpack_require__(15)
	  , has            = __webpack_require__(7)
	  , Iterators      = __webpack_require__(39)
	  , $iterCreate    = __webpack_require__(40)
	  , setToStringTag = __webpack_require__(18)
	  , getProto       = __webpack_require__(5).getProto
	  , ITERATOR       = __webpack_require__(19)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if($native){
	    var IteratorPrototype = getProto($default.call(new Base));
	    // Set @@toStringTag to native iterators
	    setToStringTag(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    // fix Array#{values, @@iterator}.name in V8 / FF
	    if(DEF_VALUES && $native.name !== VALUES){
	      VALUES_BUG = true;
	      $default = function values(){ return $native.call(this); };
	    }
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES  ? $default : getMethod(VALUES),
	      keys:    IS_SET      ? $default : getMethod(KEYS),
	      entries: !DEF_VALUES ? $default : getMethod('entries')
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(5)
	  , descriptor     = __webpack_require__(16)
	  , setToStringTag = __webpack_require__(18)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(15)(IteratorPrototype, __webpack_require__(19)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx         = __webpack_require__(12)
	  , $export     = __webpack_require__(10)
	  , toObject    = __webpack_require__(42)
	  , call        = __webpack_require__(43)
	  , isArrayIter = __webpack_require__(44)
	  , toLength    = __webpack_require__(45)
	  , getIterFn   = __webpack_require__(46);
	$export($export.S + $export.F * !__webpack_require__(48)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , $$      = arguments
	      , $$len   = $$.length
	      , mapfn   = $$len > 1 ? $$[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        result[index] = mapping ? mapfn(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(25);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(29);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(39)
	  , ITERATOR   = __webpack_require__(19)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(37)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(47)
	  , ITERATOR  = __webpack_require__(19)('iterator')
	  , Iterators = __webpack_require__(39);
	module.exports = __webpack_require__(11).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(24)
	  , TAG = __webpack_require__(19)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(19)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(50), __esModule: true };

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(51);
	module.exports = __webpack_require__(11).Object.keys;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(42);

	__webpack_require__(52)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(10)
	  , core    = __webpack_require__(11)
	  , fails   = __webpack_require__(9);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.dialog = dialog;
	exports.clickPushAddress = clickPushAddress;

	var _logic = __webpack_require__(54);

	var logic = _interopRequireWildcard(_logic);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var $ = function $(selectors) {
	    return document.querySelector(selectors);
	};

	// 弹窗效果，参数是DOM对象，事件对象和一个回调函数
	// 导入模块
	function dialog(object, event) {
	    var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

	    // 判断 DOM 对象 data-is-check 是否为真
	    var isCheck = logic.isCheck(dialogCheck);
	    // 如果是未验证状态则弹出要验证的窗口
	    if (!isCheck) {
	        (function () {
	            // 取消默认事件
	            event.preventDefault();
	            // 窗体
	            var dialog = document.querySelector('.check-dialog');
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
	        })();
	    } else {
	        // 如果验证了要执行的函数
	        callback();
	    }
	}

	// 点击表单弹出选项的效果
	function clickPushAddress(event) {
	    var address = void 0;
	    $('.push-address-choose').style.display = 'block';
	    // 地址选择器的点击事件
	    $('.push-address-choose').onclick = function confirm(event) {
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

/***/ },
/* 54 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isCheck = isCheck;
	// 检测 data-is-check 属性的值，参数为DOM对象，返回布尔值
	function isCheck(dialogCheck) {
	    var attr = dialogCheck;
	    if (attr === 'true') {
	        // 验证过的返回真值
	        return true;
	    } else if (attr === 'false') {
	        // 未验证返回假值
	        return false;
	    } else {
	        console.error('属性值有误');
	        // 有错的情况下返回假值
	        return false;
	    }
	}

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _from = __webpack_require__(33);

	var _from2 = _interopRequireDefault(_from);

	var _values = __webpack_require__(56);

	var _values2 = _interopRequireDefault(_values);

	var _keys = __webpack_require__(49);

	var _keys2 = _interopRequireDefault(_keys);

	exports.chooseImage = chooseImage;
	exports.checkPrice = checkPrice;
	exports.showClear = showClear;
	exports.hideClear = hideClear;
	exports.chooseTag = chooseTag;
	exports.addPicture = addPicture;
	exports.pushForm = pushForm;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 关于商品发布的所有逻辑

	var $ = function $(selectors) {
	    return document.querySelector(selectors);
	};

	// 调用微信接口，选择图片
	function chooseImage() {
	    // 微信图像接口调用
	    wx.chooseImage({
	        count: 1, // 默认9
	        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	        success: function success(res) {
	            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
	        }
	    });
	}
	// 检测价格是否超过五位数
	function checkPrice(event) {
	    var number = this.value;
	    if (number.length > 5) {
	        $('#push-tip').innerHTML = '不要超过5位数，太贵不会有人买哒～';
	        $('.push-tip').style.display = 'block';
	        this.value = null;
	        setTimeout(function () {
	            $('.push-tip').style.display = 'none';
	            $('#push-tip').innerHTML = '';
	        }, 2000);
	    }
	}
	// 当元素被聚焦时所显示的清空按钮
	function showClear(event) {
	    var input = this;
	    var base = this.parentElement;
	    // 以 base 为参考，显示叉叉
	    var close = base.nextElementSibling;
	    if (input.getAttribute('readonly') !== 'true') {
	        close.style.opacity = '1';
	        // 显示出来后，给 close 绑定监听事件
	        close.addEventListener('click', function clear(event) {
	            input.value = null;
	        });
	    }
	}
	// 当元素失去焦点时隐藏 clear 元素
	function hideClear(event) {
	    var input = this;
	    var base = this.parentElement;
	    var close = base.nextElementSibling;
	    if (input.getAttribute('readonly') !== 'true') {
	        close.style.opacity = '0';
	        // 移除事件
	        close.removeEventListener('click', function clear(event) {
	            input.value = null;
	        });
	    }
	}

	// 标签DOM对象生成器，参数是数组，返回HTML字符串
	function convertTag(array) {
	    var response = '';
	    array.forEach(function (element, index) {
	        response += '<li class="ui-border-b ui-arrowlink" data-tag=\'' + element + '\'>' + element + '</li>';
	    });

	    return response;
	}
	// 点击标签的事件
	function clickTag(event, choosedTag) {
	    if (event.target.tagName.toUpperCase() === 'LI') {
	        var dataTag = event.target.getAttribute('data-tag');
	        // 判断 data-tag 是否在数组中
	        if (! ~choosedTag.indexOf(dataTag) && choosedTag.length < 5) {
	            // 没有就加入数组中
	            choosedTag.push(dataTag);
	            // 搜索框的变化
	            var newNode = document.createElement('li');
	            newNode.className = "push-tag-choosed";
	            newNode.innerHTML = dataTag + '<i class="material-icons">close</i>';
	            $('.push-tag-search').insertBefore(newNode, $('.push-tag-search-box'));
	        }
	    }
	}
	// 点击取消事件
	function clickCancelTag(choosedTag) {
	    // 标签数组归位
	    choosedTag = [];
	    // 已选标签全部删除
	    var arrayTag = document.querySelectorAll('.push-tag-choosed');
	    for (var i = 0; i < arrayTag.length; i++) {
	        $('.push-tag-search').removeChild(arrayTag[i]);
	    }
	    // 搜索结果消失
	    $('.push-tag-result').innerHTML = '';
	    // 搜索内容取消
	    $('.push-tag-search-box input').value = null;
	    // 标签界面消失
	    $('.push-tag-choose').style.display = 'none';
	}

	// 当点击标签选项时触发的事件
	function chooseTag(event, totalTags) {
	    // 加载标签
	    var tags = totalTags;
	    var keys = (0, _keys2.default)(tags).reverse();
	    var values = (0, _values2.default)(tags);
	    var choosedTag = void 0;
	    // 初始化 choosedTag
	    if ($('.push-tag-value').innerText === '最多选择五个标签') {
	        choosedTag = [];
	    } else {
	        choosedTag = $('.push-tag-value').innerText.split(' ');
	    }
	    // 初始化标签
	    choosedTag.forEach(function (element, index) {
	        // 搜索框的变化
	        var newNode = document.createElement('li');
	        newNode.className = "push-tag-choosed";
	        newNode.innerHTML = element + '<i class="material-icons">close</i>';
	        $('.push-tag-search').insertBefore(newNode, $('.push-tag-search-box'));
	    });
	    // 标签搜索插件初始化
	    var demoKeyword = new jsKeyword();
	    var searchList = [];
	    demoKeyword.init();
	    values.forEach(function (element, index) {
	        searchList = searchList.concat(element);
	    });
	    // 将数据推入数组中
	    demoKeyword.push(searchList);
	    // 显示标签选择器
	    $('.push-tag-choose').style.display = 'block';
	    // 加载父标签
	    $('.push-tag-parent > ul').innerHTML = convertTag(keys);
	    // 为父标签绑定事件
	    $('.push-tag-parent > ul').onclick = function (event) {
	        if (event.target.tagName.toUpperCase() === 'LI') {
	            var key = event.target.getAttribute('data-tag');
	            $('.push-tag-child > ul').innerHTML = convertTag(tags[key]);
	            // 为子元素绑定事件
	            $('.push-tag-child > ul').addEventListener('click', function (event) {
	                clickTag(event, choosedTag);
	            });
	        }
	    };
	    // 为搜索框绑定事件
	    $('.push-tag-search').onclick = function (event) {
	        // 标签移除
	        if (event.target.tagName.toUpperCase() === 'I') {
	            // 获取点击对象的父元素的文本
	            var text = event.target.parentElement.textContent.slice(0, -5);
	            // 删除数组中的该文本
	            choosedTag.splice(choosedTag.indexOf(text), 1);
	            // 删除这个节点
	            $('.push-tag-search').removeChild(event.target.parentElement);
	        }
	    };
	    $('.push-tag-search input').oninput = function (event) {
	        var keywords = this.value,
	            response = '',
	            array = void 0;
	        // 获得查找到的数组
	        array = demoKeyword.autoComplete(keywords);
	        // 将数组变成HTML字符串
	        array.forEach(function (element, index) {
	            response += '<li data-tag="' + element + '">' + element + '</li>';
	        });
	        if (array.length === 0) {
	            response = '<li>未找到相关标签</li>';
	        }
	        $('.push-tag-result').innerHTML = response;
	    };
	    // 点击搜索出来的选项所发生的事件
	    $('.push-tag-result').onclick = function (event) {
	        clickTag(event, choosedTag);
	    };
	    // 取消事件绑定
	    $('.push-tag-cancel').onclick = function (event) {
	        clickCancelTag(choosedTag);
	    };
	    // 确定事件绑定
	    $('.push-tag-ok').onclick = function (event) {
	        // 将标签数组内的东西放入表单中
	        $('.push-tag-value').innerText = choosedTag.join(' ');
	        clickCancelTag(choosedTag);
	    };
	}

	// 图片选择事件，参数为事件，数量，文件存储对象
	function addPicture(event, number, fileList) {
	    var that = this;
	    var files = event.target.files;
	    for (var i = 0; i < files.length; i++) {
	        var reader = new FileReader();
	        reader.onload = function (i) {
	            return function (event) {
	                var result = event.target.result;
	                if (i < number.value) {
	                    var element = document.createElement('li');
	                    if (i === 0 && $('.push-picture').innerText === '') {
	                        element.className = 'weui_uploader_file weui_uploader_status';
	                        element.innerHTML = '<i class="material-icons">close</i><div class="weui_uploader_status_content">首图</div>';
	                    } else {
	                        element.className = 'weui_uploader_file';
	                        element.innerHTML = '<i class="material-icons">close</i>';
	                    }
	                    element.style.backgroundImage = 'url(' + result + ')';
	                    // 加入到 push-picture 中
	                    $('.push-picture').appendChild(element);
	                    // 加入到存储对象中
	                    fileList.push(files[i]);
	                }
	                if (i === files.length - 1) {
	                    number.value = number.value - files.length;
	                }
	                if (number.value <= 0) {
	                    $('.push-picture-button').style.display = 'none';
	                    number.value = 0;
	                }
	            };
	        }(i);
	        reader.readAsDataURL(files[i]);
	    }
	}

	// 表单提交
	function pushForm(event, fileList) {
	    var form = new FormData($('#pushForm'));
	    var errorMsg = "";
	    // 表单验证是否通过
	    if (!document.forms[0].checkValidity()) {
	        $('.push-tip').style.display = 'block';
	        // 未通过则检查
	        (0, _from2.default)(document.forms[0]).forEach(function (input, index) {
	            if (!input.checkValidity()) {
	                (function (input, index) {
	                    setTimeout(function (event) {
	                        $('#push-tip').innerHTML = input.getAttribute('required') || input.validationMessage;
	                    }, index * 1500);
	                })(input, index);
	            };
	            if (index === document.forms[0].length - 1) {
	                setTimeout(function (event) {
	                    $('.push-tip').style.display = 'none';
	                    $('#push-tip').innerHTML = "";
	                }, index * 1500);
	            }
	        });
	        return;
	    }
	    // 给表单增加地址
	    var address = $('.push-address-value').innerText;
	    // 获取 tag
	    var tagValue = $('.push-tag-value').innerText.split(' ');
	    // 处理图片
	    var picture = document.forms[0].picture;
	    // 循环
	    // for (var i = 0; i < picture.files.length; i++) {
	    //     delete picture.files[i];
	    // }
	    // fileList.forEach( function(element, index) {
	    //     if (element !== 'oldimg') {
	    //         picture.files.append(element);
	    //     }
	    // });

	    delete form.picture;
	    form.append('picture', fileList);
	    form.append('address', address);
	    form.append('tags', tagValue);
	    if (goodid === 'new') {
	        (function () {
	            var xhr = new XMLHttpRequest();
	            xhr.open('POST', '/market/api/goods/create/' + openid);
	            xhr.onreadystatechange = function ready() {
	                if (xhr.readyState === 4 && xhr.status === 200) {
	                    $('#toast').style.display = 'block';
	                    setTimeout(function () {
	                        $('#toast').style.display = 'none';
	                        location.href = 'index';
	                    }, 2000);
	                }
	            };
	            xhr.send(form);
	        })();
	    } else {
	        (function () {
	            var xhr = new XMLHttpRequest();
	            xhr.open('PUT', '/market/api/good/all/' + openid + '/' + goodid);
	            xhr.onreadystatechange = function ready() {
	                if (xhr.readyState === 4 && xhr.status === 200) {
	                    $('#toast').style.display = 'block';
	                    setTimeout(function () {
	                        $('#toast').style.display = 'none';
	                        location.href = 'index';
	                    }, 2000);
	                }
	            };
	            xhr.send(form);
	        })();
	    }
	}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(57), __esModule: true };

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(58);
	module.exports = __webpack_require__(11).Object.values;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// http://goo.gl/XkBrjD
	var $export = __webpack_require__(10)
	  , $values = __webpack_require__(59)(false);

	$export($export.S, 'Object', {
	  values: function values(it){
	    return $values(it);
	  }
	});

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(5)
	  , toIObject = __webpack_require__(22)
	  , isEnum    = $.isEnum;
	module.exports = function(isEntries){
	  return function(it){
	    var O      = toIObject(it)
	      , keys   = $.getKeys(O)
	      , length = keys.length
	      , i      = 0
	      , result = []
	      , key;
	    while(length > i)if(isEnum.call(O, key = keys[i++])){
	      result.push(isEntries ? [key, O[key]] : O[key]);
	    } return result;
	  };
	};

/***/ }
/******/ ]);
//# sourceMappingURL=check.js.map
