# 🚀 GitHub Pages 部署指南

## 📋 部署步骤

### 1. 创建 GitHub 仓库
1. 登录 [GitHub](https://github.com)
2. 点击右上角的 ➕ 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `batch-image-downloader` (或您喜欢的名称)
   - **Description**: `现代化的网页批量图片下载工具`
   - **Public**: ✅ 勾选 (GitHub Pages 免费版需要公开仓库)
   - **Add a README file**: ❌ 不勾选 (我们已经有了)
4. 点击 "Create repository"

### 2. 上传代码到 GitHub
```bash
# 在项目目录中执行
cd web-downloader

# 添加远程仓库 (替换为您的仓库地址)
git remote add origin https://github.com/YOUR_USERNAME/batch-image-downloader.git

# 推送代码
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Pages
1. 进入您的 GitHub 仓库页面
2. 点击 "Settings" 选项卡
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分选择 "GitHub Actions"
5. 保存设置

### 4. 等待自动部署
- GitHub Actions 会自动构建和部署您的网站
- 在 "Actions" 选项卡中可以查看部署进度
- 部署完成后，您的网站将在以下地址可用：
  ```
  https://YOUR_USERNAME.github.io/batch-image-downloader/
  ```

## 🔧 自定义配置

### 自定义域名（可选）
1. 在仓库根目录的 `CNAME` 文件中添加您的域名：
   ```
   your-domain.com
   ```
2. 在您的域名 DNS 设置中添加 CNAME 记录：
   ```
   CNAME   www   YOUR_USERNAME.github.io
   ```

### 修改网站信息
编辑 `_config.yml` 文件：
```yaml
title: "您的网站标题"
description: "您的网站描述"
url: "https://your-domain.com"  # 您的实际域名
```

## 📊 部署状态检查

### 查看部署状态
1. 进入仓库的 "Actions" 选项卡
2. 查看最新的工作流运行状态
3. 绿色 ✅ 表示部署成功
4. 红色 ❌ 表示部署失败，点击查看详细日志

### 常见问题解决

**问题1: GitHub Actions 部署失败**
```yaml
# 检查 .github/workflows/static.yml 文件权限设置
permissions:
  contents: read
  pages: write
  id-token: write
```

**问题2: 网站无法访问**
- 确认 GitHub Pages 已启用
- 检查仓库是否为 Public
- 等待 DNS 传播 (可能需要几分钟)

**问题3: HTTPS 功能不工作**
- GitHub Pages 自动提供 HTTPS
- File System Access API 在 HTTPS 环境下正常工作
- 如果使用自定义域名，确保 SSL 证书已配置

## 🔄 更新部署

### 更新代码
```bash
# 修改代码后
git add .
git commit -m "✨ 更新功能描述"
git push origin main
```

### 自动重新部署
- 每次推送到 `main` 分支都会自动触发重新部署
- 无需手动操作，GitHub Actions 会自动处理

## 🌐 访问您的网站

部署成功后，您可以通过以下方式访问：

**GitHub Pages 默认域名:**
```
https://YOUR_USERNAME.github.io/REPOSITORY_NAME/
```

**自定义域名 (如果配置):**
```
https://your-domain.com/
```

## 📱 移动端优化

网站已针对移动设备进行优化：
- ✅ 响应式设计
- ✅ 触摸友好的界面
- ✅ 移动浏览器兼容性

## 📊 使用统计 (可选)

### 添加 Google Analytics
1. 在 `_config.yml` 中添加：
   ```yaml
   google_analytics: "G-XXXXXXXXXX"
   ```
2. 重新提交和部署

### 添加访问统计
在 `index.html` 中添加统计代码 (推荐位置：`</body>` 标签前)

## 🛡️ 安全和隐私

### 内容安全策略 (CSP)
网站已配置适当的 CSP 头，确保安全：
- 只允许来自可信源的脚本
- 防止 XSS 攻击
- 保护用户数据安全

### 隐私保护
- 所有下载操作在用户本地进行
- 不收集或存储用户数据
- 不跟踪用户行为

## 🎉 部署完成！

恭喜！您的批量图片下载器现在已经部署到 GitHub Pages。

**分享您的网站:**
- 📧 发送链接给需要使用的用户
- 🔗 添加到您的项目文档中
- 💬 在社交媒体上分享

**后续维护:**
- 定期检查 GitHub Actions 运行状态
- 根据用户反馈更新功能
- 保持代码和依赖项更新

---

**需要帮助?**
- 查看 [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- 查看 [GitHub Actions 文档](https://docs.github.com/en/actions)
- 在仓库中创建 Issue 反馈问题