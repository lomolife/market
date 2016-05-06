# -*- coding: utf-8 -*-
# 邮件服务模块
from flask.ext.mail import Message
from threading import Thread
from ...manage import app
from .. import mail


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


def send_email(to, subject, html, **kwargs):
    msg = Message(
        subject,
        sender='market@stuzone.com',
        recipients=[to]
    )
    msg.html = html
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()
    return thr
