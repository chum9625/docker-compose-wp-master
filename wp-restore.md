# wp-restore

- WordPressを復元する際の要点など。（未完）

## Reference source

- [WordPress Search Replace DB の使い方](https://www.webdesignleaves.com/pr/wp/wp_search_replace_db.html/)

## 復元時必要な操作

データベース復元時に行う操作。

### 1. 同梱のphpmyadmin-misc.iniファイルをマウント

- sqlファイルインポート時はymlのコメントアウトを外し、volumesでマウントする。
- 同梱のphpmyadmin-misc.iniファイルはインポートサイズの拡張設定をしている。
- 以下は該当箇所。

```yml
volumes:
  - ./phpmyadmin-misc.ini:/usr/local/etc/php/conf.d/phpmyadmin-misc.ini
```

### 2. domain置換ツールの使用

1. [Database Search and Replace Script in PHP](https://github.com/interconnectit/Search-Replace-DB)
   1. GitHubからcloneすればユーザー情報提供不要
2. 展開したフォルダ（Search-Replace-DB-master）をデータベースを編集するサイトのwp-adminやwp-content、wp-includesと同じ階層に配置。
3. 配置後、ブラウザで「ｈttp://ドメイン名/Search-Replace-DB-master/」にアクセスして設定画面が表示されればインストールは完了。

---

## エラー について

復元操作時に起きたエラーの記録。

### 【phpMyAdmin】sqlファイルのインポートエラー「Incorrect format parameter」

#### 原因

- インポートするsqlファイルのサイズが上限を超えている。（デフォルトは2048KB）

#### 対処

1. カスタム設定済（同梱）のphpmyadmin-misc.iniファイルをvolumesでマウント。
2. コンテナ再起動で設定反映。
