# wp-restore（整備中）

<<<<<<< HEAD
- WordPressを復元する際の要点など。（ドキュメント整備中）
=======
- WordPressを復元する際の要点など。
>>>>>>> 3ed4da1aa1f2813b8829dc62b627224ca86d0d97

## Reference source

- [WordPress Search Replace DB の使い方](https://www.webdesignleaves.com/pr/wp/wp_search_replace_db.html/)

## 移行（復元）前の準備

1. 万が一に備えて移行元のデータをバックアップ
2. 移行元のデータ（すべてのファイル）を移行先に設置
3. 移行元のデータベースをエクスポート
4. 移行先に空のデータベースを作成
5. エクスポートした移行元のデータベースを移行先のデータベースにインポート
6. .htaccessやwp-config.phpを移行先の環境に合わせて修正

### 1. 同梱のphpmyadmin-misc.iniファイルをマウント

- ymlのコメントアウトを外す。
- 同梱のphpmyadmin-misc.iniはインポートサイズの拡張設定されたもの。
- 以下は該当箇所。

```yml
volumes:
  - ./phpmyadmin-misc.ini:/usr/local/etc/php/conf.d/phpmyadmin-misc.ini
```

### 2. Dockerコンテナーの起動

```bash
docker-compose up -d
```

### 3. domain置換ツールのインストール

1. [Database Search and Replace Script in PHP](https://github.com/interconnectit/Search-Replace-DB)
   1. GitHubからcloneすればユーザー情報提供不要
2. 展開したフォルダー（Search-Replace-DB-master）をデータベースを編集するサイトのwp-adminやwp-content、wp-includesと同じ階層に配置。
3. 配置後、ブラウザで「ｈttp://ドメイン名/Search-Replace-DB-master/」にアクセスして設定画面が表示されればインストールは完了。

---

## エラー について

復元操作時に起きたエラーの記録。

### 【phpMyAdmin】sqlファイルのインポートエラー「Incorrect format parameter」

#### 原因

- インポートするsqlファイルのサイズが上限を超えている。（デフォルトは2048KB）

#### 対処

1. カスタム設定済（同梱）のphpmyadmin-misc.iniファイルをvolumesでマウント。
2. コンテナー再起動で設定反映。
