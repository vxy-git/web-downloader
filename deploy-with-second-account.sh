#!/bin/bash

echo "=================================================="
echo "🚀 使用第二个GitHub账号部署批量图片下载器"
echo "账号邮箱: 441447212@qq.com"
echo "=================================================="
echo ""

# 获取GitHub用户名
echo "请输入您 441447212@qq.com 对应的GitHub用户名:"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ 错误: 必须提供GitHub用户名"
    exit 1
fi

echo ""
echo "📋 将使用以下信息:"
echo "GitHub用户名: $GITHUB_USERNAME"
echo "邮箱: 441447212@qq.com"
echo "仓库名: batch-image-downloader"
echo ""

# 确认信息
read -p "信息正确吗? (y/n): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ 操作已取消"
    exit 0
fi

echo ""
echo "🔧 配置Git用户信息..."

# 设置项目专用的Git配置
git config user.name "wming"
git config user.email "441447212@qq.com"

echo "✅ Git配置完成"

echo ""
echo "🌐 准备GitHub仓库..."

# 构建仓库URL
REPO_URL="https://github.com/$GITHUB_USERNAME/batch-image-downloader.git"

echo "仓库地址: $REPO_URL"

# 检查是否已有远程仓库
if git remote get-url origin > /dev/null 2>&1; then
    echo "🔄 移除现有的远程仓库配置..."
    git remote remove origin
fi

# 添加远程仓库
echo "📡 添加远程仓库..."
git remote add origin $REPO_URL

echo ""
echo "=================================================="
echo "⚠️  重要提示："
echo "=================================================="
echo ""
echo "请您手动完成以下步骤："
echo ""
echo "1️⃣  创建GitHub仓库:"
echo "   - 访问: https://github.com/new"
echo "   - 仓库名: batch-image-downloader"
echo "   - 设为公开 ✅"
echo "   - 不要添加README、.gitignore等文件"
echo ""
echo "2️⃣  确保登录正确账号:"
echo "   - 确认当前登录的是 $GITHUB_USERNAME 账号"
echo "   - 如果不是，请先登出并重新登录"
echo ""

read -p "我已经创建了仓库，按回车继续..."

echo ""
echo "📤 推送代码到GitHub..."

# 推送代码
if git push -u origin main; then
    echo ""
    echo "🎉 代码推送成功！"
    echo ""
    echo "3️⃣  启用GitHub Pages:"
    echo "   - 访问: https://github.com/$GITHUB_USERNAME/batch-image-downloader/settings/pages"
    echo "   - Source 选择: GitHub Actions"
    echo "   - 等待2-3分钟自动部署"
    echo ""
    echo "4️⃣  访问您的网站:"
    echo "   🌐 https://$GITHUB_USERNAME.github.io/batch-image-downloader/"
    echo ""
    echo "=================================================="
    echo "✅ 部署完成！"
    echo "=================================================="
else
    echo ""
    echo "❌ 推送失败，可能的原因："
    echo "1. 仓库尚未创建"
    echo "2. 没有推送权限"
    echo "3. 网络问题"
    echo ""
    echo "请检查上述问题后重新运行此脚本"
fi