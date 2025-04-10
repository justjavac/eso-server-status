# Eso Server Status

A simple Deno server that retrieves and refreshes server status from
[esoserverstatus.net](https://esoserverstatus.net).

## 概述

该项目通过 Deno 实现了一个服务器，使用 CSRF Token
进行身份验证并动态刷新服务器状态。主要功能包括：

- 从目标网站获取 CSRF Token（见 [`getXsrfToken`](main.ts)）
- 根据 CSRF Token 获取服务器状态（见 [`getServerStatus`](main.ts)）
- 处理 Token 过期的情况，自动重新获取 Token

## 运行项目

确保已安装 [Deno](https://deno.land/)。

项目中包含一个 [deno.json](deno.json)
文件，定义了任务。可以用以下命令启动开发模式：

```sh
deno task dev
```

该命令会使用 `--allow-net` 权限启动 main.ts 并监听代码更改。

## 文件结构

- **deno.json**: 配置文件，定义了项目任务
- **main.ts**: 服务器逻辑实现，处理 CSRF Token 获取和服务器状态刷新
- **README.md**: 项目前的说明文件

## 代码说明

- **DEFAULT_USER_AGENT**: 设置请求头中的用户代理，用于模拟常见浏览器
- **CSRF_TOKEN_RE**: 正则表达式，用于从 Cookie 中提取 CSRF Token
- **getXsrfToken**: 异步函数，从目标网站获取 CSRF Token
- **getServerStatus**: 异步函数，根据 CSRF Token 请求服务器状态数据

项目启动后，Deno 服务器将自动处理请求，并根据 CSRF Token
的状态返回服务器数据，若发现 Token 失效会重新获取 Token。
