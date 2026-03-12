# emoji-notifier

Slackのemoji更新（追加・削除・名前変更）を指定チャンネルに通知するSlack botです。

## リポジトリ構成

```
emoji-notifier/
├── src/
│   └── app.ts          # アプリケーションのエントリーポイント
├── dist/               # TypeScriptのコンパイル出力先（gitignore対象）
├── node_modules/       # 依存パッケージ（gitignore対象）
├── .gitignore
├── package.json        # プロジェクト設定・依存関係・スクリプト
├── package-lock.json
├── render.yaml         # Renderへのデプロイ設定
├── tsconfig.json       # TypeScriptコンパイラ設定
└── README.md
```

### `src/app.ts`

アプリケーション唯一のソースファイルです。主な構成要素は以下の通りです。

| 要素 | 概要 |
|------|------|
| App初期化 | `@slack/bolt` の `App` を環境変数のトークンで起動 |
| `createText(event)` | 絵文字変更イベントの種類（`add` / `remove` / `rename`）に応じた通知テキストを生成 |
| `receiveEvents` | `Set<string>` で受信済みイベントIDを管理し、Events APIのリトライによる重複送信を防止 |
| `emoji_changed` ハンドラ | Slackから受信した絵文字変更イベントを処理し、指定チャンネルにメッセージを投稿 |

## 技術スタック

| 種別 | 内容 |
|------|------|
| 言語 | TypeScript 5.4 |
| ランタイム | Node.js >= 22.22.0 |
| Slackフレームワーク | `@slack/bolt` 4.6 |
| フォーマッタ | `oxfmt` |
| デプロイ | [Render](https://render.com/)（無料プラン） |

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `SLACK_BOT_TOKEN` | Bot User OAuth Token |
| `SLACK_SIGNING_SECRET` | Slackリクエストの検証に使用するSigning Secret |
| `SLACK_CHANNEL_ID` | 通知を投稿するチャンネルのID |
| `PORT` | サーバーのポート番号（省略時は `3000`） |

## セットアップ・実行

```sh
# パッケージインストール
npm install

# ビルド（dist/app.js を生成）
npm run build

# アプリ起動
node dist/app.js
```

## 利用可能なスクリプト

| スクリプト | 内容 |
|------------|------|
| `npm run build` | TypeScriptをコンパイルして `dist/` へ出力 |
| `npm run build:watch` | ファイル変更を監視して自動コンパイル |
| `npm run fmt` | `oxfmt` でコードをフォーマット |
| `npm run fmt:check` | フォーマットのチェック（変更なし） |

## デプロイ

`render.yaml` によってRenderへの自動デプロイが設定されています。`main` ブランチへのプッシュをトリガーに以下が実行されます。

```
ビルド: npm install && npm run build
起動:   node dist/app.js
```
