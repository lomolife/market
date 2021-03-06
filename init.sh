#!/bin/bash

# 安装 Python 依赖
pip install -r requirements.txt
# 安装 node 依赖环境
nvm use 5.11.0
npm install
cp -r node_modules/material-design-icons app/static/
# 执行 gulp 工具，前端编译
./node_modules/gulp/bin/gulp.js
./node_modules/gulp/bin/gulp.js estojs
# 开启数据库服务器
python db_init.py
