# -*- coding: utf-8 -*-
from flask import render_template, session, redirect, url_for, jsonify, json
import collections
from . import user
from .. import mongo


@user.route('/new')
def new():
    # 如果已经登录
    if session['openid']:
        return render_template('new.html')
    # 未登录则去登录
    else:
        return redirect(url_for('wechat.index'))


@user.route('/check')
def check():
    if session['openid']:
        return render_template('check.html')
    else:
        return redirect(url_for('wechat.index'))


@user.route('/index')
def index():
    if session['openid']:
        try:
            # 获得商品ID序列和头像的文档
            Users = mongo.db.users.find_one_or_404(
                {'wechat.openid': session['openid']},
                {'goods': 1, 'wechat': 1, 'check': 1, 'reply': 1, '_id': 0}
            )
            # 获得所有商品的文档
            Goods = mongo.db.goods.find_one_or_404(
                {},
                {'goods': 1, '_id': 0}
            )
            check = Users.get('check', False)
            goodsID = Users.get('goods', [])
            goodsAll = Goods.get('goods', [])
            reply = Users.get('reply', {})
            headimgurl = Users.get('wechat', []).get('headimgurl', '')
            nickname = Users.get('wechat', []).get('nickname', '')
            # 判断该用户是否为授权用户
            if check:
                dialogCheck = 'true'
            else:
                dialogCheck = 'false'
            # 计算未下架商品个数
            sellNum = 0
            # 遍历商品计数
            for good in goodsAll:
                if good['status'] != '下架' and good['id'] in goodsID:
                    sellNum = sellNum + 1
            # 计算消息个数，暂时为0
            msgNum = len(reply.keys())
            return render_template(
                'index.html', dialogCheck=dialogCheck, sellNum=sellNum,
                msgNum=msgNum, headimgurl=headimgurl, num=0, nickname=nickname
            )
        except Exception as e:
            print(e)
            return jsonify(errMsg='Internal Error'), 500
    else:
        return redirect(url_for('wechat.index'))


@user.route('/push')
def push():
    if session['openid']:
        totalTags = mongo.db.totalTags.find_one_or_404({}, {'_id': 0})
        totalTags = json.dumps(totalTags, ensure_ascii=False)
        return render_template('push.html', title='发布商品', totalTags=totalTags)
    else:
        return redirect('wechat.index')


@user.route('/push/edit/<openid>/<goodid>')
def edit(openid, goodid):
    if session['openid']:
        return render_template(
            'push.html', openid=openid, goodid=goodid, title='编辑商品'
        )
    else:
        return redirect('wechat.index')


@user.route('/search')
def search():
    if session['openid']:
        # 搜索所有的父子标签
        try:
            totalTags = mongo.db.totalTags.find_one_or_404({}, {'_id': 0})
            print(totalTags)
            totalTagsHTML = totalTags
            totalTags = json.dumps(totalTags, ensure_ascii=False)
            return render_template(
                'search.html', totalTags=totalTags, totalTagsHTML=totalTagsHTML
            )
        except Exception as e:
            print(e)
            return jsonify(errMsg='Internal Error'), 500
    else:
        return redirect('wechat.index')


@user.route('/sells')
def sells():
    if session['openid']:
        return render_template('sells.html')
    else:
        return redirect('wechat.index')


@user.route('/good/<openid>/<goodid>')
def good(openid, goodid):
    if session['openid']:
        return render_template('good.html', openid=openid, goodid=goodid)
    else:
        return redirect('wechat.index')


@user.route('/message')
def message():
    if session['openid']:
        # 点击我的消息意味着将 reply status 设为 view
        Users = mongo.db.users.find_one_or_404(
            {'wechat.openid': session['openid']},
            {'reply': 1, '_id': 0}
        )
        reply = Users.get('reply', {})
        response = []
        for key in reply:
            insert = {}
            reply[key]['status'] = 'view'
            insert['reply'] = reply
            mongo.db.users.update(
                {'wechat.openid': session['openid']},
                {'$set': insert}
            )
            # 根据 key 找到 comments
            Goods = mongo.db.goods.find_one_or_404(
                {},
                {'goods': 1, '_id': 0}
            )
            goods = Goods.get('goods', [])
            # 遍历 goods
            for good in goods:
                # 如果有 comments 属性则继续查找
                if 'comments' in good:
                    # 遍历 comments.values
                    for item in list(good['comments'].values()):
                        for i in item:
                            if i['id'] == key:
                                # 根据 i['userID'] 寻找用户
                                userOne = mongo.db.users.find_one_or_404(
                                    {'wechat.openid': i['userID']},
                                    {'wechat': 1, '_id': 0}
                                )
                                i['userWechat'] = userOne.get('wechat', {})
                                i['picture'] = good['picture'][0]
                                i['goodid'] = good['id']
                                i['openid'] = good['id'][0:-14]
                                response.append(i)
        return render_template('message.html', response=response)
