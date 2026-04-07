---
description: 手把手教你将Openclaw接入飞书机器人
title: 🔧 openclaw&Feishu
readingTime: true
tag:
 - 配置
recommend: 3
---

# 一、准备工作

在开始之前，请确认你已经完成：

✅ 知道OpenClaw Gateway的默认端口是 18789

✅ 有一个飞书账号（企业版或个人版均可）

✅ 电脑保持开机，OpenClaw服务运行中

先检查一下OpenClaw状态：

①键盘同时按下：按Win + S

②搜索框中输入：PowerShell



![img](https://pic3.zhimg.com/v2-cd75f148b723547816574ebf3c147774_r.jpg)



③打开PowerShell，输入：openclaw gateway status



![img](https://pic3.zhimg.com/v2-022bc048ba992a787d85b6757eb38b46_r.jpg)



你应该看到类似这样的输出（重点关注 RPC probe: ok）：

Runtime: running

RPC probe: ok

Listening: 127.0.0.1:18789

如果状态不正常，请先参照上一篇教程重启服务。

# 二、在[飞书开放平台](https://zhida.zhihu.com/search?content_id=270926351&content_type=Article&match_order=1&q=飞书开放平台&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NzU3MDQ5ODksInEiOiLpo57kuablvIDmlL7lubPlj7AiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNzA5MjYzNTEsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.qZm--w3WQFX6oBdvNC47D8V_-cpPY4HSLa5ocUhmMJw&zhida_source=entity)创建应用

OpenClaw需要通过飞书开放平台提供的机器人接口与飞书通信，所以第一步是创建一个飞书应用。

1.访问飞书开放平台*

①浏览器打开 [https://open.feishu.cn/app](https://link.zhihu.com/?target=https%3A//open.feishu.cn/app)

②使用你的飞书账号登录。

2.创建企业自建应用

①　点击右上角 “创建应用”

②　选择“创建企业自建应用”。



![img](https://pic4.zhimg.com/v2-3cb2beb132c1b3f39ec935dc3240641d_1440w.jpg)





![img](https://pic1.zhimg.com/v2-87e98a4987aed6483fd944216ecfa54e_r.jpg)



3.添加机器人，并填写基本信息

①　应用名称：例如“我的AI助理”

②　应用描述：随便写，如“基于OpenClaw的智能助手”

③　图标：可不上传，后续再改

④　点击 “创建”。



![img](https://pic4.zhimg.com/v2-42c52c26c84e645ab83aef38fe0f53af_1440w.jpg)





![img](https://pic1.zhimg.com/v2-5b5538c46f529a0e6c1743118eb2d2dc_r.jpg)



创建成功后，你会进入应用的管理后台。

# 三、配置应用权限

机器人需要获得相应权限才能读取和发送消息。

1.在左侧菜单找到 “权限管理”。

2.点击“添加权限”，搜索并勾选以下关键权限（建议直接搜索关键字）：

①　获取用户发给机器人的单聊消息

②　接收群聊中@机器人消息事件

③　获取与发送单聊、群组消息

④　以应用的身份发消息

⑤　获取用户 user ID

3.勾选后点击“批量开通”。



![img](https://pic3.zhimg.com/v2-c8416266e48662c09b6aef042d67ceec_r.jpg)



小贴士：如果后续需要使用更多功能（如读取文档），可随时回来添加权限。

# 四、获取应用的 [App ID](https://zhida.zhihu.com/search?content_id=270926351&content_type=Article&match_order=1&q=App+ID&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NzU3MDQ5ODksInEiOiJBcHAgSUQiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNzA5MjYzNTEsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.Ind9ZyuzHEdLrxEugAcSrUz-ycxOKgZhJnpFW3x19fA&zhida_source=entity) 和 [App Secret](https://zhida.zhihu.com/search?content_id=270926351&content_type=Article&match_order=1&q=App+Secret&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NzU3MDQ5ODksInEiOiJBcHAgU2VjcmV0IiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6MjcwOTI2MzUxLCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.wj03I9EO_n3DSKltMlFD7UDR0fKZqWqYQXAsQyHhKB4&zhida_source=entity)

这两个凭证是OpenClaw连接飞书应用的“钥匙”。

1.左侧菜单进入“凭证与基础信息”。

2.复制App ID 和App Secret（点击右侧复制图标）。



![img](https://pica.zhimg.com/v2-eadf3dd4104b8d2e9a67bfd39af0d2fa_r.jpg)



注意！！！App Secret 非常重要，请勿泄露！

# 五、在OpenClaw中添加飞书频道

现在回到PowerShell，我们要把飞书应用的信息告诉OpenClaw。

1.确保OpenClaw Gateway正在运行（前面检查过）。

输入以下命令开始添加频道：openclaw channels add



![img](https://pic4.zhimg.com/v2-7acca2825df46dbade58a0215cacf345_r.jpg)



2.按照提示一步步填写：



![img](https://pic1.zhimg.com/v2-eb9d9be39f901cd5442cf84f9effc3ba_r.jpg)



Enter Feishu App ID：粘贴刚才复制的 App ID

Enter Feishu App Secret：粘贴 App Secret

也有跟快速的方法把两项在Open Claw的Web界面中直接发送给他让他自己配置，但是容易报错可尝试，尝试后不行继续一步一步执行现在办法。

3.选择飞书域名：国内用户选 Feishu ([http://feishu.cn](https://link.zhihu.com/?target=http%3A//feishu.cn)) - China



![img](https://pic2.zhimg.com/v2-ebaa6036c7e7273c082c67962aa325c3_r.jpg)





![img](https://pic3.zhimg.com/v2-9a1ba83b269f3fe7c54dfc148aee2fac_r.jpg)



4.群聊策略：推荐选 Open - respond in all groups (requires mention)，这样机器人在所有群聊中只要被@就能响应。



![img](https://pic3.zhimg.com/v2-d7fcb2919b10a78626a58b4e8781b116_r.jpg)



5.私聊访问策略：选默认的 No（使用配对模式），这样需要你先批准用户才能私聊，更安全。

6.是否添加显示名称：选 No。

7.绑定到智能体：选 Yes，然后选择 main (default)。

完成以上步骤后，OpenClaw会自动保存配置，并提示重启Gateway。

# 六、重启Gateway使配置生效

在PowerShell中执行：openclaw gateway

等待几秒，然后用 openclaw gateway status 确认服务恢复正常。



![img](https://pic2.zhimg.com/v2-4b11c9808b30109d0e5c4a0ae4623c9b_r.jpg)



# 七、配置[事件订阅](https://zhida.zhihu.com/search?content_id=270926351&content_type=Article&match_order=1&q=事件订阅&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NzU3MDQ5ODksInEiOiLkuovku7borqLpmIUiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNzA5MjYzNTEsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.o_Al26vdPrnKmhWL682a5jdPwa1DOmhsf6HfyB1ndG8&zhida_source=entity)（长连接方式）

飞书需要通过“事件”把用户消息推送给OpenClaw。这里我们选择长连接方式，无需公网IP，配置更简单。

1.左侧菜单进入“事件与回调” →“事件配置”。



![img](https://picx.zhimg.com/v2-3b7212b9cf2d7c5a5aea2c53773acfc1_r.jpg)



3.点击“添加事件”，搜索 接收消息 v2.0，勾选后确认。



![img](https://picx.zhimg.com/v2-e9d66d3be42ba228d5be267d84b578a5_r.jpg)



4.稍后我们需要在OpenClaw中启动长连接服务，此处先保存。

# 八、在飞书中找到机器人并配对

1.打开飞书APP，在搜索框输入你的应用名称（例如“我的AI助理”）。

2.点击进入机器人聊天窗口，发送任意消息（比如“你好”）。

此时机器人会回复一条配对消息，内容类似：

Your Feishu user id: ou_xxxx...

Pairing code:ABC123XYZ

Ask the bot owner to approve with: openclaw pairing approve feishu ABC123XYZ



![img](https://pic3.zhimg.com/v2-4099c10b695184ca5c58e64d54facca0_r.jpg)



复制配对码，回到PowerShell，执行批准命令：openclaw pairing approve feishu ABC123XYZ

（将 ABC123XYZ 替换为实际的配对码）就是你收到的哪个

3.批准成功后，再次在飞书中发送消息，机器人就会正常回复了！



![img](https://pic2.zhimg.com/v2-05d1e0dfe1579778b89d8b94dfab58bb_r.jpg)



# 九、常见问题排查

❓ 问题1：添加频道时提示 spawn EINVAL

-原因：可能是[Node.js](https://zhida.zhihu.com/search?content_id=270926351&content_type=Article&match_order=1&q=Node.js&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NzU3MDQ5ODksInEiOiJOb2RlLmpzIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6MjcwOTI2MzUxLCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.iTK-hfV_ZIwoZKHzgU1Uz2tjDjqy2OEsiPbHlGI4NYw&zhida_source=entity)版本过高或路径包含中文。

-解决：尝试在命令提示符（cmd） 中运行，而非PowerShell；或降级Node.js到18.x LTS。

❓ 问题2：飞书机器人一直回复 API rate limit reached

-原因：飞书API调用超限，通常因为权限校验太频繁。

-解决：等待15-30分钟自动恢复；长期优化可修改OpenClaw源码中的 probe.ts，减少校验频率。



![img](https://pic4.zhimg.com/v2-86e953dd82b1dbc7a384ab9095ab4a7d_r.jpg)



❓ 问题3：长连接状态显示“未连接”

-原因：OpenClaw Gateway未运行或网络不通。

-解决：检查Gateway状态，重启服务；确认防火墙未阻止端口。

❓ 问题4：Gateway重启超时，端口被占用

-解决：先停止服务 openclaw gateway stop，再手动终止占用进程（taskkill /PID 进程号 /F），最后启动。

恭喜！你的OpenClaw已经成功接入飞书，现在它是一名7×24小时在线的智能助理了。你可以通过飞书私聊或在群里@它，让它帮你处理文档、查询信息、管理任务……

下一篇文章，我们将探讨如何给OpenClaw安装更多的Skills（技能），让它学会上网搜索、处理PDF、操作浏览器……真正成为你的超级助手！