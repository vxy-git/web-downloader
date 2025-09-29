@echo off
chcp 65001 >nul
echo ========================================
echo 批量图片下载器 - Web版本
echo ========================================
echo.
echo 正在启动本地服务器...
echo 服务器启动后，请在浏览器中访问显示的地址
echo.
echo 提示：
echo 1. 推荐使用Chrome浏览器获得最佳体验
echo 2. 按 Ctrl+C 可停止服务器
echo 3. 关闭此窗口也会停止服务器
echo.
pause

echo 尝试使用Python启动服务器...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python已检测到，启动服务器在端口8000...
    echo.
    echo 请在浏览器中访问: http://localhost:8000
    echo.
    python -m http.server 8000
) else (
    echo 未检测到Python，尝试使用Node.js...
    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo Node.js已检测到，安装并启动serve...
        npx serve . -p 8000
    ) else (
        echo.
        echo 错误：未检测到Python或Node.js
        echo.
        echo 请安装以下软件之一：
        echo 1. Python 3: https://www.python.org/downloads/
        echo 2. Node.js: https://nodejs.org/
        echo.
        echo 或者直接在浏览器中打开 index.html 文件
        echo ^(注意：某些功能可能受限^)
        echo.
        pause
    )
)