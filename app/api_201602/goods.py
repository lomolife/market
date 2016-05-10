# -*- coding: utf-8 -*-
import os
from datetime import datetime
import time
import hashlib
import random
from flask import jsonify, request
from . import api
from .. import mongo
from werkzeug import secure_filename
from ...config import config
from ..modules.Email import send_email


# 检验文件安全不
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in set(['png', 'jpg', 'jpeg', 'gif'])


# 创建一个商品
@api.route('/goods/create/<openid>', methods=['POST'])
def create(openid):
    # 生成时间
    date = datetime.now()
    # 格式化为数据库存储字符串
    dateString = date.strftime("%Y-%m-%d %H:%M")
    # 格式化为文件夹名
    dateFolder = date.strftime("%Y-%m-%d")
    # 将用户提交的数据格式化
    # 创建 文件存储地址
    path = config['default'].UPLOAD_FOLDER + \
        '/{}/{}'.format(openid, dateFolder)
    # 数据库存储格式地址
    paths = []
    # 检测文件夹是否存在
    if os.path.exists(path):
        pass
    else:
        # 不存在就创建一个
        os.makedirs(path)
    # 存储文件
    for file in request.files.getlist('picture'):
        if file and allowed_file(file.filename):
            filename = hashlib.sha1((secure_filename(file.filename) + str(
                random.randint(1, 1000))).encode()).hexdigest()
            paths.append('/market/static/uploads/{}/{}/{}'.format(
                openid, dateFolder, filename
            ))
            file.save(os.path.join(path, filename))
    # 数据库写入的对象生成
    form = {}
    for i in ['describe', 'address', 'price', 'cost', 'phone', 'qq']:
        form[i] = request.form[i]
    form['tags'] = request.form['tags'].split(',')
    form['picture'] = list(set(paths))
    form['date'] = dateString
    form['status'] = '上架'
    form['id'] = openid + date.strftime("%Y%m%d%H%M%S")
    form['clickNum'] = 0
    # 数据库写入
    try:
        # 把 id 写入 users 集合中
        mongo.db.users.update(
            {'wechat.openid': openid},
            {
                '$push': {
                    'goods': form['id']
                }
            }
        )
        # 把商品对象写入 goods 集合中
        mongo.db.goods.update(
            {},
            {
                '$push': {
                    'goods': form
                }
            }
        )
        # 把标签写入 tags 集合中
        for i in form['tags']:
            # 标签字典
            tagDict = {}
            tagDict[i] = form['id']
            mongo.db.tags.update(
                {},
                {'$push': tagDict}
            )
        return jsonify(errMsg='ok')
    except Exception as e:
        print(e)
        return jsonify(errMsg='Internal Error'), 500


# 返回用户的所有未下架的商品数据
@api.route('/goods/sells/<openid>')
def getGoods(openid):
    try:
        # 查询用户的商品id
        collection = mongo.db.users.find_one_or_404(
            {'wechat.openid': openid},
            {'goods': 1, 'wechat': 1, '_id': 0}
        )
        goodsID = collection.get('goods', [])
        owner = collection.get('wechat', {})
        # 要返回的商品列表
        goods = []
        # 查询 goods
        goodsAll = (mongo.db.goods.find_one_or_404(
            {}, {'goods': 1}
        )).get('goods', [])
        # 对 goodsAll 遍历
        for good in goodsAll:
            if good['id'] in goodsID and good['status'] != '下架':
                goods.append(good)
        # 返回 goods
        return jsonify(owner=owner, goods=goods)
    except Exception as e:
        print(e)
        return jsonify(errMsg='Internal Error'), 500


# 返回所有未下架的商品数据
@api.route('/goods/all/<num>')
def getAllGoods(num):
    num = int(num)
    try:
        # 查询商品
        Goods = mongo.db.goods.find_one_or_404(
            {},
            {'goods': 1, '_id': 0}
        )
        collection = Goods.get('goods', [])
        # 商品按时间排序
        collection.reverse()
        # 从哪里开始搜索
        collection = collection[num:]
        # 要返回的数据
        response = []
        # 筛选出符合 status != '下架' 条件的的数据
        for good in collection:
            num += 1
            if good['status'] != '下架':
                # 去查找 good['id'] 对应的用户
                owner = mongo.db.users.find_one_or_404(
                    {'goods': good['id']},
                    {'wechat': 1, '_id': 0}
                ).get('wechat', {})
                good['owner'] = owner
                response.append(good)
                if len(response) == 10:
                    break
        return jsonify(message=response, errMsg='ok', num=num)
    except Exception as e:
        print(e)
        return jsonify(errMsg='Internal Error'), 500


# 返回有限制的商品
# keyword根据关键字来查，tag根据标签来查，address根据地点来查，sorts根据排序规则
# sorts 的排序规则为 none, cheep(价格从低到高), expense(价格从高到低), date
# 其他的查询规则未给定字符串均为 none
@api.route('/goods/limit/<keyword>/<tag>/<address>/<sorts>/<num>')
def limitGoods(keyword, tag, address, sorts, num):
    num = int(num)
    print(keyword, tag, address, sorts, num)
    # 数据库中搜索出商品
    try:
        # 查询商品
        Goods = mongo.db.goods.find_one_or_404(
            {},
            {'goods': 1, '_id': 0}
        )
        collection = Goods.get('goods', [])
        # 关键字筛选管道
        if keyword != 'none':
            for good in collection:
                # 判断是否是其标签或描述中的一部分
                if keyword not in good['tags'] and \
                   keyword not in good['describe']:
                        # 如果不是，则删除 collection 中的 good
                        collection.pop(collection.index(good))
        # 标签筛选管道
        if tag != 'none':
            for good in collection:
                # 严格判断是否是其标签
                if tag.replace('&', '/') not in good['tags']:
                    collection.pop(collection.index(good))
        # 地点筛选管道
        if address != 'none':
            for good in collection:
                # 严格判断是否是对应地点
                if address not in good['tags']:
                    collection.pop(collection.index(good))
        # sorted 排序
        if sorts == 'none':
            collection = sorted(
                collection, key=lambda item: int(item['clickNum'])
            )
        elif sorts == 'cheep':
            collection = sorted(
                collection, key=lambda item: int(item['price'])
            )
        elif sorts == 'expense':
            collection = sorted(
                collection, key=lambda item: int(item['price'])
            )
        elif sorts == 'date':
            collection.reverse()
        # 筛选出符合 status != '下架' 条件的的数据
        for good in collection:
            if good['status'] == '下架':
                collection.pop(collection.index(good))
        for good in collection:
            # 去查找 good['id'] 对应的用户
            owner = mongo.db.users.find_one_or_404(
                {'goods': good['id']},
                {'wechat': 1, '_id': 0}
            ).get('wechat', {})
            collection[collection.index(good)]['owner'] = owner
        # 取 collection 的 num 到 num+9 个
        return jsonify(message=collection[num:num + 10], errMsg='ok',
                       num=num + 10)
    except Exception as e:
        print(e)
        return jsonify(errMsg='Internal Error'), 500


# 返回所有未下架并且大于某一日期的商品
@api.route('/good/alllimit/<date>')
def alllimit(date):
    # date的格式 ---- 时间戳
    date = int(date) // 1000
    # 返回的数据
    response = []
    # 提取所有商品
    try:
        Goods = mongo.db.goods.find_one_or_404(
            {},
            {'goods': 1, '_id': 0}
        )
        goods = Goods.get('goods', [])
        for good in goods:
            timeArray = time.strptime(good['date'], "%Y-%m-%d %H:%M")
            timeStamp = int(time.mktime(timeArray))
            if timeStamp > date and good['status'] != '下架':
                # 去查找 good['id'] 对应的用户
                owner = mongo.db.users.find_one_or_404(
                    {'goods': good['id']},
                    {'wechat': 1, '_id': 0}
                ).get('wechat', {})
                good['owner'] = owner
                response.append(good)
        # 返回
        return jsonify(message=response, errMsg='ok')
    except Exception as e:
        print(e)
        return jsonify(errMsg='Internal Error'), 500


# 返回用户的某个商品
@api.route('/good/<openid>/<goodid>')
def getGood(openid, goodid):
    try:
        # 查询用户的商品
        collection = mongo.db.users.find_one_or_404(
            {'wechat.openid': openid},
            {'goods': 1, 'wechat': 1, '_id': 0}
        )
        owner = collection['wechat']
        # 查询商品
        goodsAll = (mongo.db.goods.find_one_or_404()).get('goods', [])
        for good in goodsAll:
            if good['status'] != '下架' and good['id'] == goodid:
                # goodsAll[goodsAll.index(good)]['clickNum'] += 1
                # 处理 good['comment']
                # 排好序的如下
                # [('ask', [{'date': '1'}]),
                # ('new', [{'date': '0'}, {'date': 1}])]
                if 'comments' in good:
                    sortList = sorted(
                        good['comments'].items(),
                        key=lambda d: int(
                            time.mktime(
                                time.strptime(
                                    (d[1][0]['date']), "%Y-%m-%d %H:%M"
                                )
                            )
                        ),
                        reverse=True)
                    # 处理 [('ask', [{'date': '1'}]),
                    # ('new', [{'date': '0'}, {'date': 1}])]
                    # 变为 [['ask', [{'date': '1'}]],
                    # ['new', [{'date': '0'}, {'date': 1}]]]
                    i = 0
                    while i < len(sortList):
                        sortList[i] = list(sortList[i])
                        # 寻找 askUser
                        askUser = mongo.db.users.find_one_or_404(
                            {'wechat.openid': sortList[i][0]},
                            {'wechat': 1, '_id': 0}
                        )
                        askUser = askUser.get('wechat', {})
                        sortList[i].append(askUser)
                        i += 1
                    # 将排好序的给good['comment']
                    good['comments'] = sortList
                return jsonify(owner=owner, good=good)
    except Exception as e:
        print(e)
        return jsonify(errMsg='Internal Error'), 500


# 举报某个商品，修改商品的 status 状态，并将goodid放入 reports 集合中
@api.route('/good/report/<openid>/<goodid>', methods=['PUT'])
def setReport(openid, goodid):
    try:
        # 更新该商品的状态
        mongo.db.goods.update(
            {'goods.id': goodid},
            {'$set': {'goods.$.status': '被举报'}}
        )
        # 将商品的 goodid 放入到 reports 集合中
        mongo.db.reports.update(
            {},
            {'$push': {'reports': goodid}}
        )
        return jsonify(errMsg='ok')
    except Exception as e:
        print(e)
        return jsonify(errMsg='Internal Error'), 500


@api.route('/good/comment/<openid>/<goodid>', methods=['PUT'])
def setCommont(openid, goodid):
    comment = {}
    comment['userID'] = request.form['userID']
    comment['replyID'] = request.form['replyID']
    comment['content'] = request.form['content']
    comment['date'] = datetime.now().strftime("%Y-%m-%d %H:%M")
    comment['id'] = request.form['userID'] + request.form['replyID'] + \
        datetime.now().strftime("%Y%m%d%H%M%S")
    try:
        # Users = mongo.db.users.find_one_or_404(
        #     {'wechat.openid': comment['replyID']},
        #     {'reply': 1, 'wechat': 1, 'datas': 1, '_id': 0}
        # )
        # email = Users.get('datas', {}).get('email', '')
        # nickname = Users.get('wechat', {}).get('nickname', '')
        # # 发送提醒邮件
        # subject = '你在［学生市场］有了新消息'
        # html = '''
        # <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{}同学：</p>
        # <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你好。</p>
        # <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你在学生市场的东西有了新回复，请前往学生市场查看</p>
        # <p style="text-align: right;"><span>学生市场管理员</span></p>
        # <p style="text-align: right;"><span>{}</span></p>
        # '''.format(
        #     nickname, datetime.strftime(datetime.now(), '%Y年%m月%d日')
        # )
        # send_email(email, subject, html)
        updateComment = {}
        # 判断是否是物主回复
        if comment['userID'] == openid:
            # 是物主回复，则更新的字段为 goods.$.comments.replyID
            Filed = 'goods.$.comments.' + comment['replyID']
        else:
            # 不是物主回复
            Filed = 'goods.$.comments.' + comment['userID']
        updateComment[Filed] = comment
        # 更新数据库中的comments
        mongo.db.goods.update(
            {'goods.id': goodid},
            {
                '$push': updateComment
            }
        )
        # 更新reply
        reply = {'reply': {}}
        reply['reply'][comment['id']] = {'status': 'new'}
        mongo.db.users.update(
            {'wechat.openid': comment['replyID']},
            {'$set': reply}
        )
        return jsonify(errMsg='ok')
    except Exception as e:
        print(e)
        return jsonify(errMsg='Internal Error'), 500


# 更新某个商品
@api.route('/good/all/<openid>/<goodid>', methods=['PUT'])
def updateAll(openid, goodid):
    return jsonify(errMsg='ok')


# 下架某个商品，修改商品的 status 状态
@api.route('/good/<openid>/<goodid>', methods=['DELETE'])
def delete(openid, goodid):
    try:
        # 更新该商品的状态
        mongo.db.goods.update(
            {'goods.id': goodid},
            {'$set': {'goods.$.status': '下架'}}
        )
        return jsonify(errMsg='ok')
    except Exception as e:
        print(e)
        return jsonify(errMsg='Internal Error'), 500
