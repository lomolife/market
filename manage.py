#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import urllib.request
import json
from threading import Timer
from flask.ext.script import Manager, Shell
# from flask.ext.mail import Message
from .app import create_app
from .config import config

wechatConfig = config.get('default', '').wechatConfig


# 微信定时任务
def getAccessTocken():
    global resultAccess
    url = '''
    https://api.weixin.qq.com/cgi-bin/token?
    grant_type=client_credential&
    appid={}&
    secret={}
    '''.format(wechatConfig['appid'], wechatConfig['secret']) \
        .replace(' ', '').replace('\n', '')
    resultAccess = json.loads(urllib.request.urlopen(url).read().decode(
        'utf-8'))
    if 'access_token' in resultAccess:
        return resultAccess
    else:
        return getAccessTocken()
getAccessTocken()
Timer(resultAccess['expires_in'], getAccessTocken)

# 根据配置文件的选择创建实例
app = create_app(os.getenv('FLSAK_CONFIG') or 'default')
manager = Manager(app)


# 邮件服务
# def send_async_email(app, msg):
#     with app.app_context():
#         mail.send(msg)


# def send_email(to, subject, html, **kwargs):
#     msg = Message(
#         subject,
#         sender='market@stuzone.com',
#         recipients=[to]
#     )
#     msg.html = html
#     thr = Thread(target=send_async_email, args=[app, msg])
#     thr.start()
#     return thr


def make_shell_context():
    return dict(app=app)
manager.add_command('shell', Shell(make_context=make_shell_context))


if __name__ == '__main__':
    manager.run()
