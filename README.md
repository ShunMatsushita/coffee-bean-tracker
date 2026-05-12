# Coffee Bean Tracker

買ったコーヒー豆を記録するシンプルな Web アプリ。

- **保存先**: ブラウザの IndexedDB（端末ローカル）
- **共有**: JSON エクスポート / インポート
- **公開**: <https://shunmatsushita.github.io/coffee-bean-tracker/>

## 開発

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint
npm run typecheck
npm run build      # dist/
```

## デプロイ

`main` への push で GitHub Actions が走り、Pages に自動デプロイされる。
