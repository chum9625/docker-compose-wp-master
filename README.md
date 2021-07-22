# docker-compose-wordpress

- docker-composeでWordpress開発環境を構築する手順書。
- テーマ開発のための環境構築。
- 復元とは切り分ける。
  - [復元時の補足はこちら](wp-restore.md)

## Reference source

- [Quickstart: Compose and WordPress](https://docs.docker.com/compose/wordpress/)
- [コマンドラインリファレンス](https://docs.docker.jp/compose/reference/toc.html)
- [Docker Composeを使ってWordPressが動作するローカル環境を作る](https://codeaid.jp/blog/docker-wp/)

## Docker Composeを使う理由

- Docker Composeは複数のコンテナを起動するツールであり、シンプルなコマンドで実行可能。
- WordPressを動作させるために、Webサーバー、PHP、データベースをまとめて起動する。

## WordPress開発環境を作る

1. Docker Desktopをインストール。（Docker Composeは同梱されている）
2. Docker Desktopの設定をする。
   1. docker-desktop > settings > Resources > WSL INTEGRATION > Ubuntu-20.04 をONにする。
   2. VScode > ターミナル > Ubuntu-20.04(WSL) を選択する。
3. WordPressの作業フォルダを作成し、そこにdocker-compose.ymlファイルを保存する。
4. 作業フォルダ（wp-sample）に移動し、以下のコマンドでコンテナを起動する。

__※コンテナ起動前に[開発しやすくなる設定](#開発しやすくする設定)に目を通し、必要に応じて設定する※__

```bash
cd wp-sample
docker-compose up -d
```

## WordPressの設定

1. Dockerコンテナ起動後、ブラウザで「localhost:8000」にアクセスする。
2. Wordpressのセットアップを実行する。

## コマンド

- Docker Composeのバージョンチェック ```docker-compose --version```
- Docker Composeでコンテナ起動 ```docker-compose up -d```
- コンテナの状態を確認する ```docker-compose ps```
- 起動した環境の停止・削除 ```docker-compose down```
- 停止・削除・データベース削除 ```docker-compose down --volumes```
- dockerで立ち上げたコンテナにログインする ```docker exec -it [コンテナ名] /bin/bash```
- ログインしたいコンテナ名やIDを確認する ```docker ps```

## 開発しやすくする設定

### テーマ、プラグイン開発に便利

#### その1. wp-contentディレクトリをマウント

- テーマやプラグインを直接扱えるように、作業フォルダ内にサブフォルダを作る。
- volumesオプションで定義する。（データが保持される）
- マウント例）
  - サブフォルダhtml：WordPressファイル群全て
  - サブフォルダwp-content：wp-contentフォルダのみ
  - 上記どちらか一方でもよい

```yml
  wordpress:
    volumes:
      - ./html:/var/www/html
      - ./wp-content:/var/www/html/wp-content
```

#### その2. 開発用空テーマをダウンロード

- [underscores.me](https://underscores.me/) で、空テーマを取得する。
- *my-theme*という名前のテーマを作成したい場合、*my-theme*と入力してGENERATEボタンをクリック（ダウンロード）する。
- ダウンロードしたものを作業フォルダ（wp-sample）に配置する。
- ymlファイルのwordpressサービスに追記、*my-theme*を*volumes*で*wp-contente/themes*にマウントする。

```yml
 volumes:
      - ./my-theme:/var/www/html/wp-content/themes/my-theme
```

### phpMyadminを使えるようにする

- データベース操作のGUIツール：phpMyAdminを使えるようにする。

```yml
phpmyadmin:
  depends_on:
    - db
  image: phpmyadmin/phpmyadmin
  environment:
    PMA_HOST: db
  restart: always
  ports:
    - "8080:80"
```

## ディレクトリ構成

ここまでの操作では以下となる。

```markdown
wp-sample
├── html/
├── phpmyadmin/   # volumesを追記した場合
├── wp-content/   #どちらか一方でよい
├── my-theme/    #どちらか一方でよい
└── docker-compose.yml
```

---

## エラー について

実行時に起きたエラーについて記録する。

### 【Linux特有】volumeマウント時のファイルowner問題

#### 背景

- 新規ファイル作成や編集はパーミッションエラーのため不可。
- Linux(Ubuntu-20.04)環境で起きた。
- Windowsでは追加、編集可能。

#### 回避策

- Windowsユーザーディレクトリで開発する。

#### 解決策

検証中

---

## Linux Tips

### ユーザーのユーザーIDやグループIDを調べる

- ユーザーID（uid）やグループID（gid）を調べるには、idコマンドを使用する。

```bash
whoami
hoge

id hoge
uid=500（hoge） gid=501（hoge） 所属グループ=501（hoge）
```

【解説】ユーザーIDが500、グループIDが501、所属グループが501。ユーザー名と同じ名前のグループ名である。
