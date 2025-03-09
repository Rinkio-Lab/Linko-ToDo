# Linko ToDo

一个简洁而功能强大的待办事项管理应用，帮助您更好地组织和管理日常任务。

## 功能特性

- 创建、编辑和删除待办事项
- 设置任务优先级（高、中、低）
- 添加任务截止日期
- 任务分类管理
- 任务状态筛选（全部、未完成、已完成）
- 深色/浅色主题切换
- 支持跟随系统主题

## 技术栈

- 后端：Python Flask
- 前端：HTML、CSS、JavaScript
- 数据存储：SQLite

## 安装说明

1. 克隆项目到本地：
   ```
   git clone [项目地址]
   cd ToDoList
   ```

2. 创建并激活虚拟环境：
   ```
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Linux/MacOS
   source venv/bin/activate
   ```

3. 安装依赖：
   ```
   pip install -r requirements.txt
   ```

## 目录结构

```
ToDoList/
│
├── app/
│   ├── __init__.py
│   ├── routes.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── index.html
│   │   └── layout.html
│   └── static/
│       ├── css/
│       │   └── styles.css
│       └── js/
│           └── scripts.js
│
├── run.py
└── requirements.txt
```

## 使用方法

1. 启动应用：
   ```
   python run.py
   ```

2. 在浏览器中访问：
   ```
   http://localhost:5000
   ```

## 主要功能使用说明

1. 添加任务：
   - 在输入框中输入任务内容
   - 选择截止日期（可选）
   - 设置优先级
   - 添加分类（可选）
   - 点击"添加"按钮

2. 管理任务：
   - 点击复选框标记任务完成状态
   - 使用筛选按钮查看不同状态的任务
   - 点击"清除已完成"删除已完成的任务

3. 主题切换：
   - 点击"切换主题"按钮手动切换深色/浅色主题
   - 点击"跟随系统"按钮自动跟随系统主题设置