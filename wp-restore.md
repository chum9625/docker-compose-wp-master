# wp-restore

- Wordpressを復元する際の要点など。（未完）

## Reference source

- [Quickstart: Compose and WordPress](https://docs.docker.com/compose/wordpress/)
- [コマンドラインリファレンス](https://docs.docker.jp/compose/reference/toc.html)

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

- [Database Search and Replace Script in PHP](https://github.com/interconnectit/Search-Replace-DB)
  - GitHubからcloneすればユーザー情報提供不要

---

## エラー について

復元操作時に起きたエラーの記録。

### 【phpMyAdmin】sqlファイルのインポートエラー「Incorrect format parameter」

#### 原因

- インポートするsqlファイルのサイズが上限を超えている。（デフォルトは2048KB）

#### 対処

1. カスタム設定済（同梱）のphpmyadmin-misc.iniファイルをvolumesでマウント。
2. コンテナ再起動で設定反映。
