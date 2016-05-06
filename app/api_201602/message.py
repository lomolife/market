# -*- coding: utf-8 -*-
# 仅获取用户相关信息的接口
import time
from flask import jsonify, request
from ...config import server
from . import api
from .. import mongo
from ..modules.Email import send_email


# 请求用户的微信信息
@api.route('/message/wechat/<openid>')
def wechat(openid):
    # 向服务器查询符合 openid 的信息
    try:
        result = mongo.db.users.find_one_or_404({
            'wechat.openid': openid
        })
        response = result['wechat']
        return jsonify(message=response, errMsg='ok')
    except Exception as e:
        print(e)
        response = '请求数据库时出错'
        return jsonify(message=response, errMsg='Internal Error'), 500


# 请求或提交用户的个人信息
@api.route('/message/datas/<openid>', methods=['GET', 'POST'])
def datas(openid):
    if request.method == 'POST':
        # 将用户传输的数据放入数据库
        datas = dict(request.form)
        # 对数据进行去数组化
        for key in datas:
            datas[key] = datas[key][0]
        try:
            mongo.db.users.update(
                {'wechat.openid': openid},
                {'$set': {'datas': datas}}
            )
            # 发送验证邮件
            subject = '学生市场用户验证'
            html = '''
            <a href="http://{}/market/api/message/check/{}">点击此处验证邮箱</a>
            '''.format(server, openid).strip()
            send_email(datas['email'], subject, html)
            return jsonify(errMsg='ok')
        except Exception as e:
            print(e)
            return jsonify(errMsg='Internal Error'), 500
    else:
        # 请求用户数据
        try:
            response = mongo.db.users.find_one_or_404(
                {'wechat.openid': openid},
                {'datas': 1, '_id': 0}
            )
            return jsonify(message=response, errMsg='ok')
        except Exception as e:
            print(e)
            return jsonify(errMsg='Internal Error'), 500


# 邮箱验证
@api.route('/message/check/<openid>')
def check(openid):
    try:
        mongo.db.users.update(
            {'wechat.openid': openid},
            {'$set': {'check': True}}
        )
        return '验证成功，请在微信中使用'
    except Exception as e:
        print(e)
        return jsonify(errMsg='Internal Error'), 500


# 返回用户是否有新消息和新商品
@api.route('/message/hasnew/<openid>/<date>')
def hasnew(openid, date):
    # date的格式 ---- 时间戳
    date = int(date) // 1000
    # hasnewgoods 的状态默认为假
    hasnew = False
    hasnewgoods = False
    # 将 reply 提取出来，格式如下
    # {
    # commentID: { status: new/view }
    # }
    try:
        Users = mongo.db.users.find_one_or_404(
            {'wechat.openid': openid},
            {'reply': 1, 'wechat': 1, 'datas': 1, '_id': 0}
        )
        reply = Users.get('reply', {})
        # nickname = Users.get('wechat', {}).get('nickname', '')
        # email = Users.get('datas', {}).get('email', '')
        number = 0
        # 遍历字典，判断是否有新消息，并且记录键的个数
        for commentID in reply:
            if reply[commentID]['status'] == 'new':
                hasnew = True
            number += 1
        # if hasnew:
        #     # 发送提醒邮件
        #     subject = '你在［学生市场］有了新消息'
        #     html = '''
        #     <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{}同学：</p>
        #     <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你好。</p>
        #     <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你在学生市场的东西有了新回复，请前往学生市场查看</p>
        #     <p style="text-align: right;"><span>学生市场管理员</span></p>
        #     <p style="text-align: right;"><span>{}</span></p>
        #     '''.format(
        #         nickname, datetime.strftime(datetime.now(), '%Y年%m月%d日')
        #     )
        #     send_email(email, subject, html)
        # 将所有商品拿出来分析
        Goods = mongo.db.goods.find_one_or_404(
            {},
            {'goods': 1, '_id': 0}
        )
        goods = Goods.get('goods', [])
        # 遍历 goods ，看是否有大于 date 的时间的商品
        for good in goods:
            timeArray = time.strptime(good['date'], "%Y-%m-%d %H:%M")
            timeStamp = int(time.mktime(timeArray))
            if timeStamp > date and good['status'] != '下架':
                hasnewgoods = True
        return jsonify(hasnew=hasnew, hasnewgoods=hasnewgoods, number=number)
    except Exception as e:
        print(e)
        return jsonify(errMsg='Internal Error'), 500
