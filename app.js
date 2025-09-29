/**
 * 批量图片下载器 - 主应用逻辑
 * 支持 File System Access API 和传统下载方式
 */

class BatchDownloader {
    constructor() {
        this.urls = [];
        this.downloadStats = {
            total: 0,
            success: 0,
            failed: 0,
            active: 0
        };
        this.failedUrls = [];
        this.downloadStartTime = null;
        this.directoryHandle = null;
        this.isDownloading = false;
        this.isPaused = false;
        this.downloadQueue = [];
        this.activeDownloads = new Set();
        this.config = {
            maxConcurrent: 5,
            retryCount: 3,
            delay: 200
        };

        // 检查浏览器兼容性
        this.fileSystemAPISupported = this.checkFileSystemAPISupport();

        this.initializeEventListeners();
        this.showCompatibilityNotice();
    }

    /**
     * 检查File System Access API支持
     */
    checkFileSystemAPISupport() {
        return 'showDirectoryPicker' in window && 'showSaveFilePicker' in window;
    }

    /**
     * 初始化事件监听器
     */
    initializeEventListeners() {
        // 文件上传
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const urlTextarea = document.getElementById('urlTextarea');

        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                this.handleFileUpload({ target: { files: e.dataTransfer.files } });
            }
        });

        // 手动输入
        urlTextarea.addEventListener('input', () => this.handleManualInput());

        // 配置项
        document.getElementById('maxConcurrent').addEventListener('change', (e) => {
            this.config.maxConcurrent = parseInt(e.target.value);
        });
        document.getElementById('retryCount').addEventListener('change', (e) => {
            this.config.retryCount = parseInt(e.target.value);
        });
        document.getElementById('delay').addEventListener('change', (e) => {
            this.config.delay = parseInt(e.target.value);
        });

        // 下载控制按钮
        document.getElementById('selectFolderBtn').addEventListener('click', () => this.selectDownloadFolder());
        document.getElementById('startDownloadBtn').addEventListener('click', () => this.startDownload());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseDownload());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopDownload());
    }

    /**
     * 显示兼容性提示
     */
    showCompatibilityNotice() {
        if (!this.fileSystemAPISupported) {
            document.getElementById('compatibilityNotice').style.display = 'flex';
        }
    }

    /**
     * 隐藏兼容性提示
     */
    hideCompatibilityNotice() {
        document.getElementById('compatibilityNotice').style.display = 'none';
    }

    /**
     * 处理文件上传
     */
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.txt')) {
            alert('请选择.txt文件');
            return;
        }

        try {
            const text = await file.text();
            this.parseUrls(text);
        } catch (error) {
            console.error('文件读取失败:', error);
            alert('文件读取失败，请重试');
        }
    }

    /**
     * 处理手动输入
     */
    handleManualInput() {
        const text = document.getElementById('urlTextarea').value;
        if (text.trim()) {
            this.parseUrls(text);
        }
    }

    /**
     * 解析URL列表
     */
    parseUrls(text) {
        const lines = text.split('\n')
            .map(line => line.trim())
            .filter(line => line && this.isValidUrl(line));

        this.urls = [...new Set(lines)]; // 去重
        this.updateUrlPreview();
        this.showConfigSection();
    }

    /**
     * 验证URL有效性
     */
    isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    /**
     * 更新URL预览
     */
    updateUrlPreview() {
        const urlCount = document.getElementById('urlCount');
        const urlList = document.getElementById('urlList');

        urlCount.textContent = this.urls.length;

        urlList.innerHTML = '';
        this.urls.slice(0, 10).forEach((url, index) => {
            const div = document.createElement('div');
            div.className = 'url-item';
            div.textContent = `${index + 1}. ${url}`;
            urlList.appendChild(div);
        });

        if (this.urls.length > 10) {
            const moreDiv = document.createElement('div');
            moreDiv.className = 'url-item';
            moreDiv.textContent = `... 还有 ${this.urls.length - 10} 个URL`;
            moreDiv.style.fontStyle = 'italic';
            moreDiv.style.color = '#666';
            urlList.appendChild(moreDiv);
        }
    }

    /**
     * 显示配置区域
     */
    showConfigSection() {
        document.getElementById('configSection').style.display = 'block';
        document.getElementById('downloadSection').style.display = 'block';
    }

    /**
     * 选择下载文件夹
     */
    async selectDownloadFolder() {
        if (!this.fileSystemAPISupported) {
            // 兼容模式提示
            alert('兼容模式下文件将以ZIP格式下载到默认下载文件夹');
            this.enableDownloadButton();
            return;
        }

        try {
            this.directoryHandle = await window.showDirectoryPicker();
            document.getElementById('folderInfo').style.display = 'block';
            document.getElementById('folderName').textContent = this.directoryHandle.name;
            this.enableDownloadButton();
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('选择文件夹失败:', error);
                alert('选择文件夹失败，请重试');
            }
        }
    }

    /**
     * 启用下载按钮
     */
    enableDownloadButton() {
        document.getElementById('startDownloadBtn').disabled = false;
    }

    /**
     * 开始下载
     */
    async startDownload() {
        if (this.urls.length === 0) {
            alert('请先上传URL列表');
            return;
        }

        this.isDownloading = true;
        this.isPaused = false;
        this.downloadStartTime = Date.now();
        this.downloadStats = {
            total: this.urls.length,
            success: 0,
            failed: 0,
            active: 0
        };
        this.failedUrls = [];
        this.downloadQueue = [...this.urls];
        this.activeDownloads.clear();

        this.updateDownloadControls();
        this.showProgressSection();
        this.updateProgress();

        if (this.fileSystemAPISupported && this.directoryHandle) {
            await this.startDirectDownload();
        } else {
            await this.startZipDownload();
        }
    }

    /**
     * 使用File System Access API直接下载
     */
    async startDirectDownload() {
        this.addLog('开始直接下载到指定文件夹...', 'info');

        const promises = [];
        for (let i = 0; i < Math.min(this.config.maxConcurrent, this.downloadQueue.length); i++) {
            promises.push(this.processNextDownload());
        }

        await Promise.all(promises);
        this.onDownloadComplete();
    }

    /**
     * 处理下一个下载任务
     */
    async processNextDownload() {
        while (this.downloadQueue.length > 0 && this.isDownloading && !this.isPaused) {
            const url = this.downloadQueue.shift();
            if (!url) break;

            this.downloadStats.active++;
            this.activeDownloads.add(url);
            this.updateProgress();

            try {
                await this.downloadSingleFile(url);
                this.downloadStats.success++;
                this.addLog(`✓ 下载成功: ${this.getFilenameFromUrl(url)}`, 'success');
            } catch (error) {
                this.downloadStats.failed++;
                this.failedUrls.push(url);
                this.addLog(`✗ 下载失败: ${this.getFilenameFromUrl(url)} - ${error.message}`, 'error');
            }

            this.downloadStats.active--;
            this.activeDownloads.delete(url);
            this.updateProgress();

            if (this.config.delay > 0) {
                await this.sleep(this.config.delay);
            }
        }
    }

    /**
     * 下载单个文件
     */
    async downloadSingleFile(url, retryCount = 0) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const blob = await response.blob();
            const filename = this.getFilenameFromUrl(url);

            if (this.fileSystemAPISupported && this.directoryHandle) {
                // 直接保存到选定文件夹
                const fileHandle = await this.directoryHandle.getFileHandle(filename, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
            } else {
                // 存储到临时数组，稍后打包
                this.downloadedFiles = this.downloadedFiles || [];
                this.downloadedFiles.push({ filename, blob });
            }

        } catch (error) {
            if (retryCount < this.config.retryCount) {
                this.addLog(`⚠ 重试下载 (${retryCount + 1}/${this.config.retryCount}): ${this.getFilenameFromUrl(url)}`, 'info');
                await this.sleep(1000 * (retryCount + 1));
                return this.downloadSingleFile(url, retryCount + 1);
            }
            throw error;
        }
    }

    /**
     * ZIP下载模式（兼容性方案）
     */
    async startZipDownload() {
        this.addLog('开始ZIP打包下载模式...', 'info');
        this.downloadedFiles = [];

        const promises = [];
        for (let i = 0; i < Math.min(this.config.maxConcurrent, this.downloadQueue.length); i++) {
            promises.push(this.processNextDownload());
        }

        await Promise.all(promises);

        if (this.downloadedFiles.length > 0) {
            await this.createAndDownloadZip();
        }

        this.onDownloadComplete();
    }

    /**
     * 创建并下载ZIP文件
     */
    async createAndDownloadZip() {
        this.addLog('正在创建ZIP文件...', 'info');

        // 动态加载JSZip库
        if (!window.JSZip) {
            await this.loadJSZip();
        }

        const zip = new JSZip();
        this.downloadedFiles.forEach(({ filename, blob }) => {
            zip.file(filename, blob);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `images_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.addLog('ZIP文件已开始下载', 'success');
    }

    /**
     * 动态加载JSZip库
     */
    async loadJSZip() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * 从URL提取文件名
     */
    getFilenameFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            let filename = pathname.split('/').pop() || 'image';

            // 确保有文件扩展名
            if (!filename.includes('.')) {
                filename += '.jpg';
            }

            return filename;
        } catch (error) {
            return `image_${Date.now()}.jpg`;
        }
    }

    /**
     * 暂停下载
     */
    pauseDownload() {
        this.isPaused = true;
        this.updateDownloadControls();
        this.addLog('下载已暂停', 'info');
    }

    /**
     * 停止下载
     */
    stopDownload() {
        this.isDownloading = false;
        this.isPaused = false;
        this.downloadQueue = [];
        this.activeDownloads.clear();
        this.updateDownloadControls();
        this.addLog('下载已停止', 'info');
        this.onDownloadComplete();
    }

    /**
     * 下载完成处理
     */
    onDownloadComplete() {
        this.isDownloading = false;
        this.isPaused = false;
        this.updateDownloadControls();
        this.showResults();

        const totalTime = Math.round((Date.now() - this.downloadStartTime) / 1000 / 60 * 10) / 10;
        this.addLog(`下载完成！总耗时: ${totalTime} 分钟`, 'success');
    }

    /**
     * 显示结果统计
     */
    showResults() {
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('finalSuccessCount').textContent = this.downloadStats.success;
        document.getElementById('finalFailedCount').textContent = this.downloadStats.failed;

        const totalTime = Math.round((Date.now() - this.downloadStartTime) / 1000 / 60 * 10) / 10;
        document.getElementById('finalTotalTime').textContent = totalTime;

        if (this.failedUrls.length > 0) {
            document.getElementById('failedUrlsSection').style.display = 'block';
            document.getElementById('failedUrls').value = this.failedUrls.join('\n');
        }
    }

    /**
     * 更新下载控制按钮状态
     */
    updateDownloadControls() {
        const startBtn = document.getElementById('startDownloadBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');

        if (this.isDownloading) {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
        } else {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
        }
    }

    /**
     * 显示进度区域
     */
    showProgressSection() {
        document.getElementById('progressSection').style.display = 'block';
    }

    /**
     * 更新进度显示
     */
    updateProgress() {
        const { total, success, failed, active } = this.downloadStats;
        const completed = success + failed;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('totalFiles').textContent = total;
        document.getElementById('successCount').textContent = success;
        document.getElementById('failedCount').textContent = failed;
        document.getElementById('activeCount').textContent = active;

        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('progressText').textContent = `${percentage}%`;

        // 计算下载速度和预计时间
        if (this.downloadStartTime) {
            const elapsed = (Date.now() - this.downloadStartTime) / 1000 / 60; // 分钟
            const speed = completed / elapsed;
            const remaining = total - completed;
            const estimatedTime = remaining > 0 && speed > 0 ? Math.round(remaining / speed) : 0;

            document.getElementById('downloadSpeed').textContent = Math.round(speed * 10) / 10;
            document.getElementById('estimatedTime').textContent =
                estimatedTime > 0 ? `${estimatedTime} 分钟` : '--';
        }
    }

    /**
     * 添加日志
     */
    addLog(message, type = 'info') {
        const logContent = document.getElementById('logContent');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
    }

    /**
     * 工具函数：延迟
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 全局函数
function hideCompatibilityNotice() {
    document.getElementById('compatibilityNotice').style.display = 'none';
}

function downloadFailedUrls() {
    const failedUrls = document.getElementById('failedUrls').value;
    if (!failedUrls) return;

    const blob = new Blob([failedUrls], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `failed_urls_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetApp() {
    location.reload();
}

function openDownloadFolder() {
    if (app.directoryHandle) {
        // 无法直接打开文件夹，提示用户
        alert('请在文件管理器中查看您选择的下载文件夹');
    } else {
        alert('请在默认下载文件夹中查看下载的ZIP文件');
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BatchDownloader();
});