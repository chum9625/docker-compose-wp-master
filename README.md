# docker-compose-wordpress

- docker-composeでWordPress開発環境を構築する手順書。
- 効率よくテーマを開発するための設定を併せて記載しています。
- 復元とは切り分けよう。（環境構築が煩雑になるため）
  - [復元時の補足はこちら](wp-restore.md)

## 実行環境

- Ubuntu-20.04（owner問題あり）
- Windows10
- Mac OS Big Sur

## Reference source

- [Quickstart: Compose and WordPress](https://docs.docker.com/compose/wordpress/)
- [コマンドラインリファレンス](https://docs.docker.jp/compose/reference/toc.html)
- [Docker Composeを使ってWordPressが動作するローカル環境を作る](https://codeaid.jp/blog/docker-wp/)
- [いまさら始めるGulpでWordPressテーマ開発](https://olein-design.com/blog/gulp-wp-starter)

## Docker Composeを使う理由

- 環境構築の統一化が図れる。
- Docker Composeは複数のコンテナーを起動するツールであり、シンプルなコマンドで実行可能。
- WordPressを動作させるための、Webサーバー、PHP、データベースをまとめて起動できる。

## 環境構築手順

初期設定（手順0）済みならば、手順1～3を実行しテーマ開発をスタートする。

### 手順0. 準備

1. Docker Desktopをインストール。（Docker Composeは同梱されている）
2. __※only WSL※__ Docker Desktopの設定をする。
   1. docker-desktop > settings > Resources > WSL INTEGRATION > Ubuntu-20.04をONにする。
   2. VScode > ターミナル > Ubuntu-20.04(WSL) を選択する。

### 手順1. WordPress作業フォルダーを作る

- WordPressの作業フォルダー「wp-sample」を作成し、そこにdocker-compose.ymlファイルを保存する。

### 手順2. Dockerコンテナーの起動

1. **コンテナー起動前の確認事項：[開発しやすくなる設定](#開発しやすくする設定)に目を通し、必要に応じて設定する。**
2. 作業フォルダー（wp-sample）に移動し、コンテナーを起動する。（コマンド例は下記）

```bash
cd wp-sample
docker-compose up -d
```

### 手順3. WordPressの設定

1. Dockerコンテナー起動後、ブラウザで「localhost:8000」にアクセスする。
2. WordPressのセットアップを実行する。

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

## Docker主要コマンド

- Docker Composeのバージョンチェック ```docker-compose --version```
- Docker Composeでコンテナー起動 ```docker-compose up -d```
- コンテナーの状態を確認する ```docker-compose ps```
- 起動した環境の停止・削除 ```docker-compose down```
- 停止・削除・データベース削除 ```docker-compose down --volumes```
- dockerで立ち上げたコンテナーにログインする ```docker exec -it [コンテナ名] /bin/bash```
- ログインしたいコンテナー名やIDを確認する ```docker ps```

## 開発しやすくする設定

テーマ、プラグイン開発を効率よく行うための設定。

### 1. wp-contentディレクトリをマウントする

1. テーマやプラグインを直接扱えるように、作業フォルダー内にサブフォルダーを作る。
2. volumesオプションで定義する。（データが保持される）
3. マウント例↓
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

1. [underscores.me](https://underscores.me/) で、空テーマを取得する。
   1. sassを使う場合、Advanced Optionsをクリックし、sassify!にチェックを入れる。
2. *my-theme*という名前のテーマを作成したい場合、*my-theme*と入力してGENERATEボタンをクリック（ダウンロード）する。
3. ダウンロードしたものを作業フォルダー（wp-sample）に配置する。
4. ymlファイルのwordpressサービスに追記、*my-theme*を*volumes*で*wp-contente/themes*にマウントする。

```yml
 volumes:
      - ./my-theme:/var/www/html/wp-content/themes/my-theme
```

### 3. タスクランナーの設定手順

- 【注1】**前提：タスクランナーはテーマディレクトリで動かす。**
- 【注2】__*package.json*が無い場合、*npm install*する前に*npm init*で*package.json*を作成する。__

1. underscoresでSassを使うためにはnpm（Node.jsのパッケージ管理ツール）が必要。
2. インストール有無の確認。```node -v```
3. テーマディレクトリに移動。```cd my-theme```
4. npm初期化でpackage.jsonを作成する。```npm init```
5. package.jsonでプラグインの設定をする。
6. npmのパッケージをインストールする。```npm install```
7. Sassファイルの監視スタート。```npm run watch```

### 4. Browser-syncを使う （更新中）

Browsersyncはファイルを監視し、ブラウザをリロードして変更を反映するツール。
PCやスマートフォンなど複数の端末でスクロールやページ遷移を同期することもできる。

### 5. テーマユニットテストデータ日本語版のインポート

投稿、固定ページ、コメント、メニュー等のダミーデータをインポートする。

1. Forkした[テーマユニットテストデータ日本語版](https://github.com/chum9625/theme-test-data-ja)からwordpress-theme-test-data-ja.xmlを取得。
2. 管理画面のツール→インポートの「WordPress」からインポートを実行する。

### 6. phpMyadminを使えるようにする

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
