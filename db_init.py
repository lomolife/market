# -*- coding: utf-8 -*-
from pymongo import MongoClient
from bson.son import SON

client = MongoClient('localhost', 27017)
db = client.market_dev

# 定义父子标签字典
totalTags = SON(
    [
        ('学科资料', [
            '经济', '管理', '计算机', '数学/统计',
            '生物', '电信', '法学', '文学/新闻传播',
            '美术', '民族学', '外语', '化学', '药学',
            '体育', '音乐'
        ]),
        ('生活用品', [
            '伞', '摆件', '清洁用品', '拉杆箱', '脸盆',
            '植物', '手工艺品', '热水袋'
        ]),
        ('图书', ['教材', '考研', '托福/GRE', '文艺', '人文社科', '励志', '教育', '证书', '四六级']),
        ('数码/电子', [
            '手机/手机配件', '电脑/电脑配件', '相机/摄像机',
            '游戏机', 'U盘', '硬盘', '闪存卡', '电风扇', '台灯', '插座'
        ]),
        ('寝室用品', [
            '座椅', '床边篮', '鞋架', '床帘', '书桌',
            '拖把', '背包', '秤', '储物工具', '四件套'
        ]),
        ('文体', [
            '文具', '记事本', '乐器', '球类', '篮球',
            '足球', '羽毛球', '乒乓球', '网球', '棋盘', '健身器材'
        ]),
        ('校园代步', ['自行车', '轮滑', '火星车', '滑板', '骑行配件']),
        ('服装穿戴', ['男装', '女装', '女鞋', '男鞋', '帽子', '手套']),
        ('其他', ['其他'])
    ]
)
# 插入父标签和子标签列表
db.totalTags.insert_one(totalTags).inserted_id
# 数据库插入
# db.users.insert_one({}).inserted_id
# db.goods.insert_one({}).inserted_id
# db.tags.insert_one({}).inserted_id
