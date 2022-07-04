# 概要

- docker-composeでWordPress開発環境を構築する手順書。
- 復元とは切り分ける。
  - [復元時の補足はこちら](wp-restore.md)

## Docker Composeを使う理由

- 環境構築の統一化を図るため。
  - 複数のコンテナ（Webサーバー＋PHP＋データベース）を組み合わせてWordPress環境を作る。
  - 高速で環境が整う。数秒でWordPressインストール画面が立ち上がる。
- 応用の効く開発環境構築の習得目的。

## 実行環境

- macOS Monterey
- Windows 10
- ~~Ubuntu-20.04~~（権限問題があるので扱わない）

## Reference source

- [【公式】クィックスタート: Compose と WordPress](https://docs.docker.jp/compose/wordpress.html)
- [コマンドラインリファレンス](https://docs.docker.jp/compose/reference/toc.html)
- [Docker Composeを使ってWordPressが動作するローカル環境を作る](https://codeaid.jp/blog/docker-wp/)

## 環境構築手順

- 初期設定（手順0）済みならば、手順1～3を実行しテーマ開発をスタートする。
- プロジェクトは Dev/Docker/ 配下とする。

### 手順0. 準備

1. [Docker Desktop](https://www.docker.com/products/docker-desktop)をインストール。（Docker Composeは同梱されている）
2. ~~__※only WSL※__ Docker Desktopの設定をする。~~
   ~~1. docker-desktop > settings > Resources > WSL INTEGRATION > Ubuntu-20.04をONにする。~~
   ~~2. VScode > ターミナル > Ubuntu-20.04(WSL) を選択する。~~

### 手順1. リポジトリをCloneする

- このリポジトリをCloneし、ディレクトリ名（例：wp-sample）を変更。

### 手順2. Dockerコンテナの起動

0. **初回コンテナ起動前に確認：[推奨設定](#推奨設定)に目を通し、必要に応じて設定する。**
1. ターミナルで作業フォルダ（wp-sample）に移動。
2. コンテナを起動。

```bash
cd wp-sample
```

```bash
docker-compose up -d
```

- 実行中、directoryをShareするか質問されるので許可する。
- 拒否するとエラーになる：Error response from daemon: user declined directory sharing
- [ボリューム共有が有効にならない。 Docker CE for Windows の設定でのボリューム共有の有効化 (Linux コンテナーのみ)](https://docs.microsoft.com/ja-jp/visualstudio/containers/troubleshooting-docker-errors?view=vs-2022#volume-sharing-is-not-enabled-enable-volume-sharing-in-the-docker-ce-for-windows-settings--linux-containers-only)

### 手順3. WordPressの設定

1. Dockerコンテナ起動後、ブラウザで「localhost:8000」にアクセスする。
2. WordPressのセットアップを実行する。

## ディレクトリ構成

ここまでの操作では以下となる。

```markdown
wp-sample
├── html/
├── phpmyadmin/   # volumesを追記した場合
├── wp-content/   #プラグイン操作するなら
├── my-theme/
└── docker-compose.yml
```

## Docker主要コマンド

|コマンド|内容|
|---|---|
|docker-compose up -d|コンテナ起動|
|docker-compose down|起動した環境の停止・削除|
|docker-compose down --volumes|停止・削除・データベース削除|
|docker-compose ps|コンテナの状態を確認する|
|docker-compose --version|Docker Composeのバージョンチェック|
|docker ps|ログインしたいコンテナ名やIDを確認する|
|docker exec -it [コンテナ名] /bin/bash|dockerで立ち上げたコンテナにログインする|

## 推奨設定

テーマ、プラグイン開発を効率よく行うための設定。

### 1. wp-contentディレクトリをマウントする

1. テーマやプラグインを直接扱えるように、作業フォルダー内にサブフォルダーを作る。
2. volumesオプションで定義する。（データが保持される）
3. マウント例：扱いやすいよう次のいずれかを設定すると良い
   - html：WordPressファイル群すべて
   - wp-content：wp-contentディレクトリのみ
   - cocoon-child-master：子テーマディレクトリのみ

```yml
  wordpress:
    volumes:
      - ./html:/var/www/html
      - ./wp-content:/var/www/html/wp-content
      - ./cocoon-child-master:/var/www/html/wp-content/themes/cocoon-child-master
```

### 2. phpMyadminを使う

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

### 付録1. SSHでサーバーにWordPressをインストールする

1. 本番サーバーにSSHで接続する。
2. インストールするディレクトリに移動。 ``` cd /web/public_html/hoge ```
3. WordPress最新版をダウンロード。  ``` wget http://ja.wordpress.org/latest-ja.tar.gz ```
4. 解凍。（/wordpress/に解凍される）  ``` tar -zxvf latest-ja.tar.gz ```
5. 配置したいディレクトリにファイルを移動する。 例） ``` mv ./wordpress/* ./ ```
6. 不要なディレクトリ、ファイルを削除。 例） ``` rm -r latest-ja.tar.gz wordpress ```

### 付録2. 開発用空テーマ　_s を使う

1. [underscores.me](https://underscores.me/) で、空テーマを取得する。
   1. sassを使う場合、Advanced Optionsをクリックし、sassify!にチェックを入れる。
2. __my-theme__ という名前のテーマを作成したい場合、 __my-theme__ と入力してGENERATEボタンをクリック（ダウンロード）する。
3. ダウンロードしたものを作業フォルダー（wp-sample）に配置する。
4. ymlファイルのwordpressサービスに追記、 __my-theme__ を __volumes__ で __wp-contente/themes__ にマウントする。

```yml
 volumes:
      - ./my-theme:/var/www/html/wp-content/themes/my-theme
```

### 付録3. タスクランナーの導入（別documentでまとめる予定）

- [Gulp公式：Quick Start](https://gulpjs.com/docs/en/getting-started/quick-start)
- [いまさら始めるGulpでWordPressテーマ開発](https://olein-design.com/blog/gulp-wp-starter)
- [絶対つまずかないGulp 4入門(2021年版)インストールとSassを使うまでの手順](https://ics.media/entry/3290/)
- [Gulp ＋ Browsersyncを使ったブラウザ自動リロードでコーディング効率化を目指す](https://designsupply-web.com/media/knowledgeside/3785/)
- [忘備録](https://sotoogre.hatenablog.jp/entry/2020/10/25/121040)

### 付録4. テーマユニットテストデータ日本語版のインポート

投稿、固定ページ、コメント、メニュー等のダミーデータをインポートする。[詳細](https://wpdocs.osdn.jp/%E3%83%86%E3%83%BC%E3%83%9E%E3%83%A6%E3%83%8B%E3%83%83%E3%83%88%E3%83%86%E3%82%B9%E3%83%88)

1. [テーマユニットテストデータ日本語版](https://github.com/jawordpressorg/theme-test-data-ja)からwordpress-theme-test-data-ja.xmlを取得。
2. 管理画面のツール→インポートの「WordPress」からインポートを実行する。

  - プラグイン Yoast Duplicate Post で対応する方法もある。

---


## エラーlog

docker-composeでWordPress開発環境を構築する時に遭遇したエラーの記録。

### 【Linux特有】volumeマウント時のファイルowner問題

#### 背景

- 新規ファイル作成や編集はパーミッションエラーのため不可。
- WSL2(Ubuntu-20.04) userで起きた。
- windows userでは編集可能。

#### 回避策

- windows user環境で開発する。

#### 解決策

- __権限を与えればよい__

```
chmod 707 /対象ディレクトリ
```

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
