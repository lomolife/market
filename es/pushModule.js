// 关于商品发布的所有逻辑

let $ = selectors => {
    return document.querySelector(selectors);
}

// 调用微信接口，选择图片
export function chooseImage () {
    // 微信图像接口调用
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

        }
    });
}
// 检测价格是否超过五位数
export function checkPrice (event) {
    let number = this.value;
    if (number.length > 5) {
        $('#push-tip').innerHTML = '请输入五位数以内的数字';
        $('.push-tip').style.display = 'block';
        this.value = null;
        setTimeout(function () {
            $('.push-tip').style.display = 'none';
            $('#push-tip').innerHTML = '';
        }, 2000);
    }
}
// 当元素被聚焦时所显示的清空按钮
export function showClear (event) {
    let input = this;
    let base = this.parentElement;
    // 以 base 为参考，显示叉叉
    let close = base.nextElementSibling;
    if (input.getAttribute('readonly') !== 'true') {
        close.style.opacity = '1';
        // 显示出来后，给 close 绑定监听事件
        close.addEventListener('click', function clear (event) {
            input.value = null;
        });
    }
}
// 当元素失去焦点时隐藏 clear 元素
export function hideClear (event) {
    let input = this;
    let base = this.parentElement;
    let close = base.nextElementSibling;
    if (input.getAttribute('readonly') !== 'true') {
        close.style.opacity = '0';
        // 移除事件
        close.removeEventListener('click', function clear (event) {
            input.value = null;
        });
    }
}

// 标签DOM对象生成器，参数是数组，返回HTML字符串
function convertTag (array) {
    let response = '';
    array.forEach( function(element, index) {
        response += `<li class="ui-border-b ui-arrowlink" data-tag='${element}'>${element}</li>`;
    });

    return response;
}
// 点击标签的事件
function clickTag (event, choosedTag) {
    if (event.target.tagName.toUpperCase() === 'LI') {
        let dataTag = event.target.getAttribute('data-tag');
        // 判断 data-tag 是否在数组中
        if (!~choosedTag.indexOf(dataTag) && choosedTag.length < 5) {
            // 没有就加入数组中
            choosedTag.push(dataTag);
            // 搜索框的变化
            let newNode = document.createElement('li');
            newNode.className = "push-tag-choosed";
            newNode.innerHTML = `${dataTag}<i class="material-icons">close</i>`;
            $('.push-tag-search').insertBefore(newNode,$('.push-tag-search-box'));
        }
    }
}
// 点击取消事件
function clickCancelTag (choosedTag) {
    // 标签数组归位
    choosedTag = [];
    // 已选标签全部删除
    let arrayTag = document.querySelectorAll('.push-tag-choosed');
    for (let i = 0; i < arrayTag.length; i++) {
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
export function chooseTag (event, totalTags) {
    // 加载标签
    let tags = totalTags;
    let keys = Object.keys(tags).reverse();
    let values = Object.values(tags);
    let choosedTag;
    // 初始化 choosedTag
    if ($('.push-tag-value').innerText === '最多选择五个标签') {
        choosedTag = [];
    } else {
        choosedTag = $('.push-tag-value').innerText.split(' ');
    }
    // 初始化标签
    choosedTag.forEach( function(element, index) {
        // 搜索框的变化
        let newNode = document.createElement('li');
        newNode.className = "push-tag-choosed";
        newNode.innerHTML = `${element}<i class="material-icons">close</i>`;
        $('.push-tag-search').insertBefore(newNode,$('.push-tag-search-box'));
    });
    // 标签搜索插件初始化
    let demoKeyword = new jsKeyword();
    let searchList = [];
    demoKeyword.init();
    values.forEach( function(element, index) {
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
            let key = event.target.getAttribute('data-tag');
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
            let text = event.target.parentElement.textContent.slice(0, -5);
            // 删除数组中的该文本
            choosedTag.splice(choosedTag.indexOf(text), 1);
            // 删除这个节点
            $('.push-tag-search').removeChild(event.target.parentElement);
        }
    };
    $('.push-tag-search input').oninput = function (event) {
        let keywords = this.value, response = '', array;
        // 获得查找到的数组
        array = demoKeyword.autoComplete(keywords);
        // 将数组变成HTML字符串
        array.forEach( function(element, index) {
            response += `<li data-tag="${element}">${element}</li>`;
        });
        if (array.length === 0) {
            response = '<li>未找到相关标签</li>'
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
export function addPicture (event, number, fileList) {
    let that = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
            let result = event.target.result;
            let element = document.createElement('li');
            if (fileList.length === 0) {
                element.className = 'weui_uploader_file weui_uploader_status';
                element.innerHTML = '<i class="material-icons">close</i><div class="weui_uploader_status_content">首图</div>';
            } else {
                element.className = 'weui_uploader_file';
                element.innerHTML = '<i class="material-icons">close</i>';
            }
            element.style.backgroundImage = `url(${result})`;
            // 加入到 push-picture 中
            $('.push-picture').appendChild(element);
            // 加入到存储对象中
            fileList.push(result);
            if (fileList.length === 4) {
                $('.push-picture-button').style.display = 'none';
            }
            console.log(fileList);
            // if (i === files.length - 1) {
            //     number.value = number.value - files.length;
            // }
            // if (number.value <= 0) {
            //     $('.push-picture-button').style.display = 'none';
            //     number.value = 0;
            // }
    };
    reader.readAsDataURL(file);

}

// 表单提交
export function pushForm(event, fileList) {
    let form = new FormData($('#pushForm'));
    let errorMsg = "";
    // 表单验证是否通过
    if (!document.forms[0].checkValidity()) {
        let forms = Array.from(document.forms[0]);
        $('.push-tip').style.display = 'block';
        // 未通过则检查
        // Array.from(document.forms[0]).forEach( function(input, index) {
        //     if (!input.checkValidity()) {
        //         (function (input, index) {
        //             setTimeout(function (event) {
        //                 $('#push-tip').innerHTML = input.getAttribute('required') || input.validationMessage;
        //             }, index*1500);
        //         })(input, index);
        //     };
        //     if (index === document.forms[0].length-1) {
        //         setTimeout(function (event) {
        //             $('.push-tip').style.display = 'none';
        //             $('#push-tip').innerHTML = "";
        //         }, index*1500);
        //     }
        // });
        for (var i = 0; i < forms.length; i++) {
            let input = forms[i];
            if (!input.checkValidity()) {
                $('#push-tip').innerHTML = input.getAttribute('required') || input.validationMessage;
                setTimeout(function () {
                    $('.push-tip').style.display = 'none';
                    $('#push-tip').innerHTML = "";
                }, 1500);
                break;
            };
        }
        return;
    }
    // 判断地址是否选择了
    if ($('.push-address-value').innerText === '交易地点') {
        $('.push-tip').style.display = 'block';
        $('#push-tip').innerHTML = '请输入交易地点';
        setTimeout(function () {
            $('.push-tip').style.display = 'none';
            $('#push-tip').innerHTML = "";
        }, 1500);
        return;
    }
    // 判断手机和QQ是否填写
    if (document.forms[0].phone.value === '' && document.forms[0].qq.value === '') {
        $('.push-tip').style.display = 'block';
        $('#push-tip').innerHTML = '请至少填写手机和QQ中的一项';
        setTimeout(function () {
            $('.push-tip').style.display = 'none';
            $('#push-tip').innerHTML = "";
        }, 1500);
        return;
    }
    // 判断标签是否选择了
    if ($('.push-tag-value').innerText === '最多选择五个标签' || $('.push-tag-value').innerText === '') {
        $('.push-tip').style.display = 'block';
        $('#push-tip').innerHTML = '请输入标签';
        setTimeout(function () {
            $('.push-tip').style.display = 'none';
            $('#push-tip').innerHTML = "";
        }, 1500);
        return;
    }
    // 给表单增加地址
    let address = $('.push-address-value').innerText;
    // 获取 tag
    let tagValue = ($('.push-tag-value').innerText).split(' ');
    // 处理图片
    let picture = document.forms[0].picture;
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
        $('#loadingToast').style.display = 'block';
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `/market/api/goods/create/${openid}`);
        xhr.onreadystatechange = function ready () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                $('#loadingToast').style.display = 'none';
                $('#toast').style.display = 'block';
                setTimeout(function () {
                     $('#toast').style.display = 'none';
                     location.href = 'index';
                }, 2000);
            }
        };
        xhr.send(form);
    } else {
        $('#loadingToast').style.display = 'block';
        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `/market/api/good/all/${openid}/${goodid}`);
        xhr.onreadystatechange = function ready () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                $('#loadingToast').style.display = 'none';
                $('#toast').style.display = 'block';
                setTimeout(function () {
                     $('#toast').style.display = 'none';
                     location.href = 'index';
                }, 2000);
            }
        };
        xhr.send(form);
    }
}