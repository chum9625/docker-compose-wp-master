# docker-compose-wordpress

- docker-composeでWordPress開発環境を構築する手順書。
- テーマ開発のための環境構築。
- 復元とは切り分ける。
  - [復元時の補足はこちら](wp-restore.md)

## Reference source

- [Quickstart: Compose and WordPress](https://docs.docker.com/compose/wordpress/)
- [コマンドラインリファレンス](https://docs.docker.jp/compose/reference/toc.html)
- [Docker Composeを使ってWordPressが動作するローカル環境を作る](https://codeaid.jp/blog/docker-wp/)

## Docker Composeを使う理由

- 環境構築の統一化が図れる。
- Docker Composeは複数のコンテナーを起動するツールであり、シンプルなコマンドで実行可能。
- WordPressを動作させるための、Webサーバー、PHP、データベースをまとめて起動できる。

## 環境構築手順

初期設定（手順0）済みならば、手順1～3を実行しテーマ開発をスタートする。

### 手順0. 準備

1. Docker Desktopをインストール。（Docker Composeは同梱されている）
2. Docker Desktopの設定をする。
   1. docker-desktop > settings > Resources > WSL INTEGRATION > Ubuntu-20.04をONにする。
   2. VScode > ターミナル > Ubuntu-20.04(WSL) を選択する。

### 手順1. WordPress作業フォルダーを作る

- WordPressの作業フォルダー「wp-sample」を作成し、そこにdocker-compose.ymlファイルを保存する。

### 手順2. Dockerコンテナーの起動

1. __※コンテナー起動前に[開発しやすくなる設定](#開発しやすくする設定)に目を通し、必要に応じて設定する※__
2. 作業フォルダー（wp-sample）に移動し、コンテナーを起動する。（コマンド例は下記）

```bash
cd wp-sample
docker-compose up -d
```

### 手順3. WordPressの設定

1. Dockerコンテナー起動後、ブラウザで「localhost:8000」にアクセスする。
2. WordPressのセットアップを実行する。

## 主要コマンド

- Docker Composeのバージョンチェック ```docker-compose --version```
- Docker Composeでコンテナー起動 ```docker-compose up -d```
- コンテナーの状態を確認する ```docker-compose ps```
- 起動した環境の停止・削除 ```docker-compose down```
- 停止・削除・データベース削除 ```docker-compose down --volumes```
- dockerで立ち上げたコンテナーにログインする ```docker exec -it [コンテナ名] /bin/bash```
- ログインしたいコンテナー名やIDを確認する ```docker ps```

## 開発しやすくする設定

テーマ、プラグイン開発に便利な設定や、データベースを扱うGUI設定。

### 1. wp-contentディレクトリをマウントする

- テーマやプラグインを直接扱えるように、作業フォルダー内にサブフォルダーを作る。
- volumesオプションで定義する。（データが保持される）
- マウント例）
  - サブフォルダーhtml：WordPressファイル群すべて
  - サブフォルダーwp-content：wp-contentフォルダーのみ
  - 上記どちらか一方でもよい

```yml
  wordpress:
    volumes:
      - ./html:/var/www/html
      - ./wp-content:/var/www/html/wp-content
```

### 2. 開発用空テーマをダウンロードし、そのディレクトリをマウントする

- [underscores.me](https://underscores.me/) で、空テーマを取得する。
  - sassを使う場合、Advanced Optionsをクリックし、sassify!にチェックを入れる。
- *my-theme*という名前のテーマを作成したい場合、*my-theme*と入力してGENERATEボタンをクリック（ダウンロード）する。
- ダウンロードしたものを作業フォルダー（wp-sample）に配置する。
- ymlファイルのwordpressサービスに追記、*my-theme*を*volumes*で*wp-contente/themes*にマウントする。

```yml
 volumes:
      - ./my-theme:/var/www/html/wp-content/themes/my-theme
```

### 3. phpMyadminを使えるようにする

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
├── wp-content/   #どちらか一方でもよい
├── my-theme/    #どちらか一方でもよい
└── docker-compose.yml
```

---

## エラー について

実行時に起きたエラーについて記録する。

### 【WSL特有】volumeマウント時のファイルowner問題

#### 背景

- 新規ファイル作成や編集はパーミッションエラーのため不可。
- WSL2(Ubuntu-20.04)環境で起きた。
- Windows環境では編集可能。

#### 回避策

- Windows環境で開発する。

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
