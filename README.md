# 学生市场
---

### 使用指南
- 环境依赖

> 1. Gunicorn
> 2. MongoDB
> 3. Pyenv + Python 3.5.1
> 4. Nvm + Node 5.11.0

- 项目初始化（包括数据库服务器的打开，以及数据库的初始化）

```bash
# 首先进入到 init.sh 所在目录
sh init.sh
```

- 项目结构

market  # 根目录
    |- init.sh  # 初始化文件
    |- db_init.py  # 数据库初始化
    |- manage.py  # 项目启动文件
    |- requirements.txt  # Python包依赖文件
    |- README.md
    |- .gitignore  # git 忽略同步的文件或文件夹
    |- app  # 应用程序文件夹
        |- __init__.py  # 包
        |- templates  # 模版
            |- *.html  # 不同页面的模版
            |- modules  # 复用的模版
                |- *.html
        |- static  # 静态文件文件夹
            |- dist  # CSS、JS
                |- *
            |- uploads  # 用户上传图片存放地址
                |- <openid>
                    |- <YYYY-MM-DD>
                        |- *
        |- main  # 服务器相关包，请求路由为 ^/market/
            |- __init__.py
            |- errors.py  # 错误请求处理
            |- views.py  # 服务器接入验证
        |- wechat  # 微信验证相关，请求路由为 ^/market/wechat/
            |- __init__.py  # 蓝图
            |- views.py  # 微信登录验证
        |- api_YYYYMM  # 学生市场API，后面是年月，请求路由为 ^/market/api/
            |- __init__.py
            |- goods.py  # 关于商品的API
            |- message.py  # 关于用户信息的API
        |- modules  # 封装模块
            |- __init__.py
            |- WechatAccess.py  # 微信验证的模块
        |- user  # 页面请求处理
            |- __init__.py
            |- views.py  # 各种页面请求，请求路由为 ^/market/user/
    |- less
        |- *.less  # 各页面对应的样式源码
    |- es
        |- *.js  # 各页面对应的 JS 源码（ES6）

- 数据库结构

```javascript
// DBName: market

// collection: users  (用户集合)
{
    "_id" : ObjectId(),
    "check" : true,  // 是否验证
    "wechat" : {
        "headimgurl" : 'value',
        "city" : 'value',
        "openid" : 'value',
        "sex" : 'value',
        "privilege" : 'value',
        "language" : 'value',
        "province" : 'value',
        "nickname" : 'value',
        "country" : 'value'
    },  // 微信相关信息
    "datas" : {
        "address" : "",
        "password" : "",
        "schoolID" : "",
        "phone" : "",
        "email" : "",
        "qq" : ""
    },  // 用户数据相关
    "goods" : [
        "omAjvv3hzVgZZNwy9uwSGvfAEHhQ20160416110821"
    ],  // 商品ID号数组
    "reply" : {
        "omAjvvwb-OwWwIDH5AjnWbvod-5QomAjvv3hzVgZZNwy9uwSGvfAEHhQ20160416111025" : {
            "status" : "view"
        }
    }  // 消息回应对象（商品ID: {状态: 看过 or 没看过}）
}

// collection: goods  (商品集合)
{
    "_id" : ObjectId(),
    "goods" : [
        {
            "picture" : [
                "url"
            ],  // 图片URL
            "clickNum" : number,
            "phone" : "value",  // 商品主人电话
            "date" : "YYYY-MM-DD hh:mm",  // 商品发布日期
            "tags" : [
                "value"
            ],  // 商品标签
            "status" : "下（上）架 / 举报",  // 商品状态
            "address" : "value",  // 商品交易地
            "qq" : "value",  // 商品主人QQ
            "id" : "value",  // 商品ID
            "price" : "value",  // 商品价格
            "cost" : "value",  // 商品原价
            "describe" : "value",  // 商品描述
            "comments" : {
                "openid" : [
                    {
                        "userID" : "value",  // 评论人ID
                        "replyID" : "value",  // 回复人ID
                        "id" : "value",  // 商品ID
                        "content" : "value",  // 评论内容
                        "date" : "value"  // 发布评论日期
                    }
                ]
            }  // 商品相关评论
        }
    ]
}

// collection: tags  (标签集合)
{
    "_id" : ObjectId(),
    "标签名" : [
        "商品ID"
    ]
}

// collection: totalTags
{
    "_id" : ObjectId(),
    "父标签": [
        "子标签"
    ]
}
```

- API

```javascript
// 用户信息获取接口

GET /message/wechat/<openid>  // 请求用户的微信信息
// 成功返回
{
    "message" : {
        "headimgurl" : 'value',
        "city" : 'value',
        "openid" : 'value',
        "sex" : 'value',
        "privilege" : 'value',
        "language" : 'value',
        "province" : 'value',
        "nickname" : 'value',
        "country" : 'value'
    },
    "errMsg": 'ok'
}
// 错误时返回 500
{
    "message": '错误信息',
    "errMsg": 'Internal Error'
}

GET /message/datas/<openid>  // 请求用户的个人信息
// 返回信息类似上一个API

POST /message/datas/<openid>  // 提交用户的个人信息
// 返回信息类似上方，但只返回 errMsg

GET /message/hasnew/<openid>/<date>  // 返回用户是否有新消息和新商品
// 成功时返回
{
    "hasnew": bool,
    "hasnewgoods": bool,
    "number": number  // 分页用的
}
// 错误时返回类似上一个API


// 商品信息获取接口
GET /goods/sells/<openid>  // 返回用户的所有未下架的商品数据
// 成功时返回
{
    "owner": {
        // 商品用户的微信信息（参考数据库结构，下同）
    },
    "goods": {
        // 商品信息（参考数据库结构，下同）
    }
}
// 错误时返回 500
{
    "errMsg": 'Internal Error'
}

GET /goods/all/<num>  // 返回所有未下架的商品数据，num为分页标志
// 成功时返回
{
    "message": {
        // 商品信息
        "owner": {
            // 商品主人信息
        }
    },
    "errMsg": 'ok',
    "num": number  // 下次分页标志
}
// 错误时返回 500，类似上一个API

GET /goods/limit/<keyword>/<tag>/<address>/<sorts>/<num>
// 返回有限制的商品
// keyword根据关键字来查，tag根据标签来查，address根据地点来查，sorts根据排序规则
// sorts 的排序规则为 none, cheep(价格从低到高), expense(价格从高到低), date
// 其他的查询规则未给定字符串均为 none
// 返回结果类似上一个API

GET /good/alllimit/<date>  // 返回所有未下架并且大于某一日期的商品
// 返回结果类似上一个API，没有 num 字段

GET /good/<openid>/<goodid>  // 返回用户的某个商品
// 成功时返回
{
    "owner": {
        // 商品用户微信信息
    }
    "good": {
        // 商品信息
    }
}
// 错误时返回，类似上一个API

PUT /good/report/<openid>/<goodid>  // 举报某个商品

PUT /good/comment/<openid>/<goodid>  // 添加商品评论

PUT /good/all/<openid>/<goodid>  // 更新某个商品

DELETE /good/<openid>/<goodid>  // 下架某个商品
```

- 功能

1. 商品信息的验证与上传，表单验证利用原生表单验证的API，表单上传利用 Formdata API，多图上传利用 FileList API（不过，最终还是自己写了个数组，存储 File，因为用户再次选择图片时，FileList会重置）
2. 商品消息提醒与新商品提醒，采用Ajax轮询，下一个版本一定采用 WebSocket！
3. 打电话、发短信利用 HTML5 的移动特性，安卓与 iOS 都已可使用
4. 标签搜索、商品出售、信息验证等都采用 Ajax 实现

- 样式

样式采用 WeUI，FrozenUI框架，一些图标字体引用了 material design icon
