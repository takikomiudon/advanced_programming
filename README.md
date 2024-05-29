# Chat Syllabus

RAGを用いてシラバスの内容をチャット形式で検索できるようにしました。

## 開始方法

このプロジェクトをローカルで動作させるための手順は以下の通り。

### 前提条件

- Node.js
- Python
- pip

### インストール方法

1. フロントエンドの依存関係のインストール:

```bash
cd FE
npm install
```

2. バックエンドの依存関係のインストール:

```bash
cd BE
pip install -r requirements.txt
```

### 実行方法
フロントエンドを起動するには以下のコマンドを実行

```bash
cd FE
npm start
```

バックエンドを起動するには以下のコマンドを実行

```bash
cd BE
python main.py
```

Dockerを使用する場合は以下のコマンドを実行

```bash
docker build -t advanced-programming .
docker run --rm -p 8080:8080 advanced-programming
```

以下のvercelのURLでも公開しています
https://advanced-programming-gilt.vercel.app/


## 使用技術
- フロントエンド: React, Mantine
- バックエンド: Flask, Llamaindex, supabase
