from flask import redirect, request, url_for, session
from . import wechat
from .. import mongo
from app.modules.WechatAccess import Token

token = Token()


@wechat.route('/')
def index():
    return redirect(token.backUrl)


@wechat.route('/auth', methods=['POST', 'GET'])
def auth():
    code = request.args.get('code', '')
    # 如果用户禁止授权，则跳转到无权限页面
    if code == '':
        return redirect(url_for('user.index'))
    # 如果用户授权，则服务器可以用code来获取access_token
    else:
        req_dict = token.getToken(code)
        # 如果没有正确返回，则重新授权
        if 'errcode' in req_dict:
            return redirect(url_for('.index'))
        # 如果正确返回
        else:
            user_msg = token.getUser(
                req_dict['access_token'],
                req_dict['openid'])
            # 假设获取不成功，重新获取
            if 'errcode' in user_msg:
                return redirect(url_for('.index'))
            # 如果获取成功，则判断是否为学生
            else:
                try:
                    # 如果不是第一次登录
                    user = mongo.db.users.find_one(
                        {'wechat.openid': user_msg['openid']})
                    checked = user['check']
                except:
                    # 如果是第一次登录
                    mongo.db.users.insert({
                        'wechat': user_msg,
                        'check': False
                    })
                    checked = False
                # 将用户的 openid 纳入会话
                session['openid'] = user_msg['openid']
                if checked:
                    # 如果验证了，进入首页
                    return redirect(url_for('user.index'))
                else:
                    # 进入验证页面
                    return redirect(url_for('user.new'))
