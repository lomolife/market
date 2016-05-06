from flask import Flask
from flask.ext.pymongo import PyMongo
from flask.ext.mail import Mail
from config import config

# 扩展实例化
mongo = PyMongo()
mail = Mail()


def create_app(config_name):
    app = Flask(__name__, static_url_path='/market/static')
    app.config.from_object(config[config_name])
    # 扩展实例应用到 app
    mongo.init_app(app)
    mail.init_app(app)

    # 加载蓝图
    from .main import main as main_blueprint  # 主要模块
    from .wechat import wechat as wechat_blueprint  # 微信登录验证模块
    # from .admin import admin as admin_blueprint  # 管理员模块
    from .user import user as user_blueprint  # 用户模块
    from .api_201602 import api as api_blueprint  # api模块
    # 注册蓝图
    app.register_blueprint(main_blueprint, url_prefix='/')
    app.register_blueprint(wechat_blueprint, url_prefix='/market/wechat')
    # app.register_blueprint(admin_blueprint, url_prefix='/market/admin')
    app.register_blueprint(user_blueprint, url_prefix='/market/user')
    app.register_blueprint(api_blueprint, url_prefix='/market/api')

    return app
