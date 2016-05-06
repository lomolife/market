# -*- coding: utf-8 -*-
import hashlib
from flask import request
from . import main
from ...config import config

wechatConfig = config.get('default', '').wechatConfig


@main.route('/')
@main.route('/market')
def index():
    # 微信服务器接入验证
    token, timestamp, nonce, signature = wechatConfig['token'], \
        request.args.get('timestamp'), \
        request.args.get('nonce'), \
        request.args.get('signature')
    sorter = sorted([token, timestamp, nonce])
    string = ''.join(sorter).encode()
    secret = hashlib.sha1(string).hexdigest()
    if secret == signature:
        return request.args.get('echostr')
    else:
        return '不是微信请求'
