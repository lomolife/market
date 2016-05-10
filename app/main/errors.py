# -*- coding: utf-8 -*-
from flask import render_template
from . import main


@main.route('/market/404/')
@main.app_errorhandler(404)
def not_found():
    return render_template('404.html'), 404


@main.route('/market/500/')
@main.app_errorhandler(500)
def inter_error():
    return render_template('500.html'), 500
