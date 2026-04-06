# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# 開発サーバー起動（1Password CLI で環境変数を注入）
pnpm dev

# ビルド
pnpm build

# スクリプト実行（bun を使う）
bun --env-file=.env.development -r tsconfig-paths/register scripts/bulkLoad.ts
```

パッケージマネージャーは **pnpm**。スクリプト類は **bun** で実行する。

### データフロー

1. **番組選択**: フロントエンド（`/` → `/d/[n]`）で日付・局・番組を選択
2. **録音リクエスト**: `POST /api/save` が `docker run radigo rec ...` を非同期実行
3. **ストレージ**: 録音済み MP3 と meta.json を MinIO（S3 互換）に保存
4. **配信**: `updateList()` が MinIO 上の `feed.xml` を更新 → `/api/feed` でリダイレクト配信

### 通知

`postMessage()` は `HOOK` 環境変数に設定した Webhook URL（Discord 想定）に録音進捗を通知する。

### モジュール解決

`tsconfig.json` の `baseUrl: "./src"` により `lib/xxx` や `types` を絶対パスでインポートできる。スクリプト用の `scripts/tsconfig.json` は `baseUrl: "../src"` で同様の解決を行う。

### 環境変数

| 変数 | 用途 |
|------|------|
| `MINIO_ENDPOINT` | MinIO ホスト |
| `MINIO_BUCKET` | バケット名 |
| `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` | MinIO 認証 |
| `DOMAIN` | RSS フィード URL |
| `ASSET_DOMAIN` | MP3 直リンクのベース URL |
| `HOOK` | 進捗通知用 Webhook URL |

### スクリプト（`scripts/`）

- `upload.ts` — 単一アイテムを手動で MinIO にアップロード
- `bulkUpload.ts` / `bulkLoad.ts` / `bulkPurge.ts` — バルク操作ユーティリティ
- `file2dir.ts` — ファイル構造の変換
