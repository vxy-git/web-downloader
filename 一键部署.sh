#!/bin/bash

echo "🚀 批量图片下载器 - 一键部署到 GitHub Pages"
echo "账号: vxy-git (441447212@qq.com)"
echo "=================================================="

# 检查当前目录
if [ ! -f "index.html" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 确保Git配置正确
echo "📝 配置Git用户信息..."
git config user.name "vxy-git"
git config user.email "441447212@qq.com"

# 检查是否有未提交的更改
if ! git diff --quiet || ! git diff --staged --quiet; then
    echo "📦 发现未提交的更改，正在提交..."
    git add .
    git commit -m "🔧 部署前最后更新

🛠 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
fi

# 显示仓库信息
echo ""
echo "📋 部署信息:"
echo "GitHub用户: vxy-git"
echo "仓库名称: batch-image-downloader"
echo "远程地址: https://github.com/vxy-git/batch-image-downloader.git"

# 检查仓库是否存在
echo ""
echo "🔍 检查GitHub仓库是否存在..."

if git ls-remote --exit-code --heads origin >/dev/null 2>&1; then
    echo "✅ 仓库已存在，直接推送代码..."

    # 推送代码
    if git push -u origin main; then
        echo ""
        echo "🎉 代码推送成功！"

        echo ""
        echo "📊 部署状态检查:"
        echo "1. Actions: https://github.com/vxy-git/batch-image-downloader/actions"
        echo "2. Settings: https://github.com/vxy-git/batch-image-downloader/settings/pages"

        # 等待几秒钟然后检查GitHub Pages状态
        echo ""
        echo "⏳ 等待GitHub Pages自动配置..."
        sleep 5

        echo "✅ GitHub Pages将在以下地址可用(可能需要几分钟):"
        echo "🌐 https://vxy-git.github.io/batch-image-downloader/"

    else
        echo "❌ 推送失败，请检查网络连接和权限"
        exit 1
    fi

else
    echo "❌ 仓库不存在，请先创建仓库："
    echo ""
    echo "📋 创建步骤："
    echo "1. 访问: https://github.com/new"
    echo "2. Repository name: batch-image-downloader"
    echo "3. Description: 现代化的网页批量图片下载工具，支持选择本地文件夹直接下载"
    echo "4. ✅ Public"
    echo "5. ❌ 不要添加README、.gitignore等文件"
    echo "6. 点击 'Create repository'"
    echo ""
    echo "仓库创建完成后，重新运行此脚本即可完成部署！"

    # 询问是否打开GitHub创建页面
    read -p "是否现在打开GitHub创建仓库页面? (y/n): " open_github
    if [ "$open_github" = "y" ] || [ "$open_github" = "Y" ]; then
        open "https://github.com/new"
        echo "✅ 已为您打开GitHub创建仓库页面"
        echo "创建完成后重新运行: ./一键部署.sh"
    fi
fi

echo ""
echo "=================================================="
echo "✨ 部署脚本执行完毕"
echo "=================================================="