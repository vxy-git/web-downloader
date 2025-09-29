#!/bin/bash

echo "========================================"
echo "批量图片下载器 - Web版本"
echo "========================================"
echo ""
echo "正在启动本地服务器..."
echo "服务器启动后，请在浏览器中访问显示的地址"
echo ""
echo "提示："
echo "1. 推荐使用Chrome浏览器获得最佳体验"
echo "2. 按 Ctrl+C 可停止服务器"
echo "3. 关闭此终端也会停止服务器"
echo ""
read -p "按回车键继续..."

echo "尝试使用Python启动服务器..."
if command -v python3 &> /dev/null; then
    echo "Python3已检测到，启动服务器在端口8000..."
    echo ""
    echo "请在浏览器中访问: http://localhost:8000"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Python已检测到，启动服务器在端口8000..."
    echo ""
    echo "请在浏览器中访问: http://localhost:8000"
    echo ""
    python -m http.server 8000
elif command -v node &> /dev/null; then
    echo "Node.js已检测到，安装并启动serve..."
    npx serve . -p 8000
else
    echo ""
    echo "错误：未检测到Python或Node.js"
    echo ""
    echo "请安装以下软件之一："
    echo "1. Python 3: https://www.python.org/downloads/"
    echo "2. Node.js: https://nodejs.org/"
    echo ""
    echo "macOS用户可以使用Homebrew安装："
    echo "brew install python3"
    echo "或"
    echo "brew install node"
    echo ""
    echo "或者直接在浏览器中打开 index.html 文件"
    echo "(注意：某些功能可能受限)"
    echo ""
    read -p "按回车键退出..."
fi