# 🚀 快速部署到 GitHub Pages

## 📝 简化步骤 (3分钟完成)

### 第1步: 创建 GitHub 仓库
1. 访问 https://github.com/new
2. 仓库名称: `batch-downloader`
3. 设为公开 ✅
4. 点击 "Create repository"

### 第2步: 上传代码
在您的终端/命令提示符中执行：

**Windows 用户:**
```batch
cd "web-downloader文件夹路径"
git remote add origin https://github.com/YOUR_USERNAME/batch-downloader.git
git branch -M main
git push -u origin main
```

**Mac/Linux 用户:**
```bash
cd /path/to/web-downloader
git remote add origin https://github.com/YOUR_USERNAME/batch-downloader.git
git branch -M main
git push -u origin main
```

### 第3步: 启用 GitHub Pages
1. 进入您的仓库页面
2. 点击 "Settings" → "Pages"
3. Source 选择 "GitHub Actions"
4. 等待 2-3 分钟自动部署

## ✅ 部署完成！

您的网站地址：
```
https://YOUR_USERNAME.github.io/batch-downloader/
```

## 🎯 测试功能

访问网站后：
1. 上传 `demo-urls.txt` 文件测试
2. 或手动粘贴一些图片URL
3. Chrome 浏览器可选择下载文件夹
4. 其他浏览器自动使用ZIP下载

## 📱 分享给用户

告诉您的用户：
- 网站地址: `https://您的用户名.github.io/仓库名/`
- 推荐使用 Chrome 86+ 获得最佳体验
- 支持拖拽上传 .txt 文件
- 可批量下载数千张图片

---

**就是这么简单！** 🎉