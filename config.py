# -*- coding: utf-8 -*-
import os
from urllib.parse import quote


class CommonConfig:
    """通用的配置"""
    SECRET_KEY = 'Fxw4JNWQMrL7HqGWcpkn'
    # 上传文件的文件夹
    UPLOAD_FOLDER = os.path.dirname(__file__) + '/app/static/uploads'
    # 邮件设置
    MAIL_SERVER = 'smtp.mxhichina.com'
    MAIL_PORT = '465'
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'market@stuzone.com'
    MAIL_PASSWORD = 'love_bit1314'


class DevConfig(CommonConfig):
    """开发环境的配置"""
    # Flask-PyMongo 的设置
    MONGO_DBNAME = 'market_dev'
    # 微信开发相关
    wechatConfig = {
        'appid': 'wxf7f810a7869d2c09',
        'redirect_url': quote(
            'http://stuzone.com:8000/market/wechat/auth'
        ),
        'scope': 'snsapi_userinfo',
        'token': 'dwcJAM9WTiZyfg8qTZJcnprmKsCbsA',
        'secret': 'd4624c36b6795d1d99dcf0547af5443d'
    }


class ProConfig(CommonConfig):
    """生产环境的配置"""
    # Flask-PyMongo 的设置
    MONGO_DBNAME = 'market'


class TestConfig(CommonConfig):
    """测试环境的配置"""

# app.config 配置
config = {
    # 三种配置的选择
    'devConfig': DevConfig,
    'proConfig': ProConfig,
    'testConfig': TestConfig,
    # 默认配置的设置
    'default': DevConfig
}

# 主服务器
server = 'stuzone.com:8000'
