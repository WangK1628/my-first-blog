---
description: 介绍一下自配置环境
title: 🔧 环境安装
readingTime: false
tag:
 - 配置
recommend: 3
---



### 一、准备工作：安装基础环境

OpenClaw 运行依赖 `Node.js 24+` 和 `Git`。

`npm` 已包含在 Node.js 安装包中，无需单独安装。

注意：Windows 建议全程使用“管理员身份”运行 PowerShell。

### 1）安装 Node.js

### 方式 A：官方下载（新手推荐）

- 地址：`HTTPS://nodejs.org/`
- 选择 `LTS v24+` 稳定版本
- 安装时勾选 `Add to PATH`

### 方式 B：包管理器安装（开发者推荐）

```text
# macOS: 先安装 Homebrew（如未安装）
/bin/bash -C 「$(curl -fsSL HTTPS://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)」

# 安装 Node.js
brew install node

# 强制重建软链接（部分环境需要）
brew link node --overwrite --force
# 配置 npm 国内镜像（可选，用于加速下载）
npm config set registry HTTPS://registry.npmmirror.com/
```

### 2）安装 Git

### 方式 A：官方下载

- 地址：`HTTPS://git-scm.com/`
- Windows 选择 64 位版本
- 安装时勾选 `Add Git to PATH`

### 方式 B：包管理器安装

```text
# macOS
brew install git

# Debian / Ubuntu
sudo apt install -y git

# CentOS / RHEL
sudo dnf install -y git
```

### 3）安装完成后验证（必做）

```text
# 验证 Node.js
node -v

# 验证 npm
npm -v

# 验证 Git
git --version
```

可选：配置 Git 全局身份，避免后续提交报错。

```text
# 设置全局用户名
git config --global user.name 「你的用户名」

# 设置全局邮箱
git config --global user.email 「你的邮箱」
```

### 二、OpenClaw 安装步骤

### 1）macOS / Linux

```text
# 官方安装脚本
curl -fsSL HTTPS://openclaw.ai/install.sh | bash

# 全局安装 openclaw 命令
npm i -g openclaw
```

### 2）Windows（管理员 PowerShell）

```text
# 执行官方 PowerShell 安装脚本
iwr -useb HTTPS://openclaw.ai/install.ps1 | iex
```

> 说明：若 macOS/Linux 出现权限问题，可在命令前增加 `sudo`。

### 三、安装后交互式配置（核心）

安装完成后会进入交互式配置流程。

建议先按“最小可用”原则完成初始化，后续再在 Web UI 或终端细化配置。

建议按以下顺序确认：

1. 运行模式与端口配置
2. 模型提供方与密钥配置
3. 渠道接入配置（如飞书）
4. 配置保存与服务启动

### 四、飞书机器人接入（实操）

以下步骤与飞书开发者后台对应，你可以配合截图逐步说明。

### 步骤 1：创建企业自建应用

在[飞书开放平台](https://zhida.zhihu.com/search?content_id=270915025&content_type=Article&match_order=1&q=飞书开放平台&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NzU3MTk3MTksInEiOiLpo57kuablvIDmlL7lubPlj7AiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNzA5MTUwMjUsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.ZTO2lW8iTVoGPMjNsNFTEz0MCHqNpV9OjcIhMX9U9uU&zhida_source=entity)创建“企业自建应用”，填写：

- 应用名称
- 应用描述
- 应用图标

![img](https://pic1.zhimg.com/v2-087a2c88da817df1cd044741004b6df0_r.jpg)



### 步骤 2：添加应用能力

在应用左侧菜单选择“添加应用能力”，添加“机器人”能力。

![img](https://pic3.zhimg.com/v2-735d0ec265a26d70986a87e1e219eee8_1440w.jpg)



### 步骤 3：获取应用凭证

进入“凭证与基础信息”，记录：

- `App ID`
- `App Secret`

![img](https://pic4.zhimg.com/v2-2f407e0b3ddb0a6a2c80ae81866ba23d_r.jpg)

> 这两个参数用于 OpenClaw 与飞书的鉴权，务必妥善保存。

### 步骤 4：配置事件与回调

进入“事件与回调”页面：

- 选择订阅方式（长连接 / 推送到开发服务器）
- 保存配置
- 按需添加事件

![img](https://pic3.zhimg.com/v2-1d7d6a85f30bae00ff85164bde5a72e2_r.jpg)

### 步骤 5：在 OpenClaw 中填写飞书参数

将 `App ID` 与 `App Secret` 写入 OpenClaw 配置（建议使用环境变量），然后重启服务。

### 五、建议的环境变量写法（推荐）

```text
# 飞书应用 ID（来自飞书开放平台）
export FEISHU_APP_ID=「cli_xxxxxxxxxxxxx」

# 飞书应用 Secret（来自飞书开放平台）
export FEISHU_APP_SECRET=「xxxxxxxxxxxxxxxx」

# OpenClaw 监听端口（按需调整）
export OPENCLAW_PORT=「3000」
```

Windows PowerShell 可使用：

```text
# 设置当前会话环境变量
$env:FEISHU_APP_ID=「cli_xxxxxxxxxxxxx」
$env:FEISHU_APP_SECRET=「xxxxxxxxxxxxxxxx」
$env:OPENCLAW_PORT=「3000」
```

### 六、联调与验证

建议按以下链路验证：

1. 启动 OpenClaw 服务
2. 在飞书群内 `@机器人` 发送测试消息
3. 检查 OpenClaw 终端日志是否收到事件
4. 确认机器人是否正常回复

### 七、常见问题与排查（快速版）

### 1）机器人无回复

- 检查机器人是否已加入目标群聊
- 检查事件订阅是否保存成功
- 检查应用可见范围与发布状态

### 2）鉴权失败

- 核对 `App ID / App Secret` 是否有误
- 排查是否存在前后空格或旧密钥未更新

### 3）回调失败

- 推送模式下需保证回调地址公网可达
- 检查端口、防火墙、网关和证书配置

### 八、问题排查与卸载

这部分覆盖最常见的安装、运行、飞书接入问题，以及本地卸载回滚方法。

### 8.1 常见问题排查

### 1）命令找不到：`openclaw: command not found`

可能原因：

- 全局安装失败
- npm 全局路径未加入 `PATH`

排查步骤：

```text
# 检查是否全局安装成功
npm list -g --depth=0 | grep openclaw

# 查看 npm 全局安装目录
npm root -g
npm config get prefix
```

若未安装成功，重新安装：

```text
npm i -g openclaw
```

### 2）Node 版本过低或不兼容

OpenClaw 依赖 Node.js 24+。先确认版本：

```text
node -v
```

如果版本过低，升级 Node.js 后重试安装。

### 3）安装时报权限错误（EACCES）

常见于 macOS/Linux 全局安装。可使用以下两种方式：

```text
# 方式 A：临时提升权限
sudo npm i -g openclaw
# 方式 B：调整 npm 全局目录到用户目录（更推荐）
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 『export PATH=~/.npm-global/bin:$PATH』 >> ~/.bashrc
source ~/.bashrc
npm i -g openclaw
```

> 若使用 zsh，请把 `.bashrc` 改为 `.zshrc`。

### 4）飞书机器人收不到消息

优先检查：

- 应用是否已添加“机器人”能力
- 机器人是否已拉入群聊
- 事件与回调配置是否保存
- 订阅事件是否已添加
- 应用是否发布到可用范围

### 5）飞书鉴权失败（401 / 无权限）

常见原因：

- `App ID`、`App Secret` 填写错误
- 使用了旧密钥（重置后未同步）
- 环境变量存在空格或引号问题

建议重新复制后再写入环境变量并重启服务。

### 6）端口被占用，服务启动失败

检查端口占用并更换端口：

```text
# macOS / Linux：查看 3000 端口占用
lsof -i :3000
# Windows PowerShell：查看 3000 端口占用
netstat -ano | findstr 3000
```

修改端口后重启服务。

### 7）代理或网络导致依赖下载失败

可先切换 npm 镜像：

```text
npm config set registry HTTPS://registry.npmmirror.com/
```

安装完成后如需恢复官方源：

```text
npm config set registry HTTPS://registry.npmjs.org/
```

### 8.2 运行日志与诊断建议

建议保留三类日志：

1. OpenClaw 启动日志（是否启动成功）
2. 渠道接入日志（飞书事件是否到达）
3. 错误堆栈日志（鉴权、网络、权限）

排查优先级建议：

1. 先看“是否启动成功”
2. 再看“事件是否进来”
3. 最后看“业务处理是否返回”

### 8.3 卸载 OpenClaw（按系统）

### 1）通用卸载（npm 全局安装）

```text
# 卸载全局 openclaw
npm uninstall -g openclaw
```

校验是否卸载成功：

```text
openclaw --version
# 如果提示 command not found，说明卸载完成
```

### 2）清理 npm 缓存（可选）

```text
npm cache verify
# 如需强制清理：
npm cache clean --force
```

### 3）清理本地配置与数据（可选，谨慎）

```text
# 以下为示例路径，请按你的实际安装目录调整
rm -rf ~/.openclaw
rm -rf ~/.config/openclaw
```

Windows PowerShell 示例：

```text
# 按实际目录删除
Remove-Item -Recurse -Force 「$env:USERPROFILE\.openclaw」
Remove-Item -Recurse -Force 「$env:USERPROFILE\.config\openclaw」
```

> 注意：删除配置目录会清空本地配置与缓存，请先备份密钥和自定义配置。

### 8.4 飞书侧回滚（可选）

若你暂时不再使用飞书接入，可在飞书开放平台执行：

- 移除机器人能力（或停用应用）
- 删除事件订阅
- 重置 `App Secret`（防止旧配置继续生效）

### 8.5 一键“最小回滚”建议

如果只想恢复到“干净可重装”状态，建议执行：

1. 卸载 `openclaw`
2. 清理本地配置目录
3. 保留 Node.js / Git（避免重复装环境）
4. 重新按本文安装流程走一遍