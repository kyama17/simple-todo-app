# 📝 シンプルTodoアプリ

モダンなデザインのシンプルなTodoアプリケーションです。フレームワークを使わずにVanilla JavaScriptで作成されており、軽量で高速に動作します。

## ✨ 機能

- ✅ タスクの追加・削除
- ✅ タスクの完了/未完了の切り替え
- ✅ フィルター機能（すべて/未完了/完了済み）
- ✅ タスクの統計表示
- ✅ 完了済みタスクの一括削除
- ✅ ローカルストレージでのデータ永続化
- ✅ レスポンシブデザイン
- ✅ オフライン対応（Service Worker）

## 🚀 使い方

1. リポジトリをクローンまたはダウンロード:
   ```bash
   git clone <repository-url>
   cd simple-todo-app
   ```

2. サーバーを起動（Python 3が必要です）:
   ```bash
   python3 server.py
   ```

3. ブラウザでアクセス:
   - http://localhost:12000

## 📁 ファイル構成

- [`index.html`](index.html) - メインのHTMLファイル
- [`style.css`](style.css) - スタイルシート
- [`script.js`](script.js) - JavaScript（アプリケーションロジック）
- [`sw.js`](sw.js) - Service Worker（オフライン対応）
- [`server.py`](server.py) - 開発用Webサーバー

## 🛠️ 技術仕様

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **データ保存**: LocalStorage
- **オフライン対応**: Service Worker
- **レスポンシブ**: CSS Grid/Flexbox

## 🎨 特徴

- **シンプルなUI**: 直感的で使いやすいインターフェース
- **高速**: Vanilla JavaScriptで軽量
- **永続化**: ブラウザを閉じてもデータが保持される
- **モバイル対応**: スマートフォンでも快適に使用可能
- **オフライン対応**: インターネット接続がなくても動作

## 🌐 ブラウザサポート

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 📸 スクリーンショット

アプリは美しいグラデーション背景とカード型のレイアウトを特徴としています。

## 🔧 開発

このアプリはVanilla JavaScriptで作成されており、フレームワークの依存関係はありません。