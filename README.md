# docker-compose-wordpress

docker-composeでWordpress開発環境を構築する手順書。

## Reference source

- [Quickstart: Compose and WordPress](https://docs.docker.com/compose/wordpress/)
- [コマンドラインリファレンス](https://docs.docker.jp/compose/reference/toc.html)
- [Docker Composeを使ってWordPressが動作するローカル環境を作る](https://codeaid.jp/blog/docker-wp/)

## ディレクトリ構成

```markdown
  my-wp-project
  ├── html/
  ├── phpmyadmin/ # volumesでマウント時に生成
  ├── wp-content/
  ├── docker-compose.yml
  └── phpmyadmin-misc.ini  # 復元時に必要
```

### 補足事項

- htmlディレクトリ以下にWordPressファイル群がマウントされる。
- wp-contentディレクトリはテーマ開発用にマウントする。
- phpmyadminは必要に応じてマウントする。
- phpmyadmin-misc.iniは復元時必要に応じてマウントする。

### 復元操作

- sqlファイルインポート時はymlのコメントアウトを外す

```yml
volumes:
  - ./phpmyadmin-misc.ini:/usr/local/etc/php/conf.d/phpmyadmin-misc.ini
```

- 上記操作でphpmyadminディレクトリに、作成したphpmyadmin-misc.ini ファイルがマウントされる。

## docker-compose.ymlの説明

- コンテナ名を付ける

```yml
  wordpress:
    container_name: my-wp-container
```

- volumesでデータ保持

```yml
  wordpress:
    volumes:
      - ./html:/var/www/html
      - ./wp-content:/var/www/html/wp-content
```

- サイトアクセスにサブフォルダを付ける　例）localhost:8000/wp

```yml
  wordpress:
    volumes:
      - ./html:/var/www/html/wp
    working_dir: /var/www/html/wp
```

## 手順

- コマンドはdocker-complse.ymlと同階層で実行する。
  - 起動　```docker-compose up -d```
  - コンテナとデフォルトネットワーク削除　```docker-compose down```
  - コンテナとデフォルトネットワークかつデータ削除　```docker-compose down --volumes```

## エラー について

### 【phpMyAdmin】sqlファイルのインポートエラー「Incorrect format parameter」

#### 原因

- インポートするsqlファイルのサイズの上限超過で起きる。（デフォルトは2048KB）

#### 対処

1. カスタム設定した phpmyadmin-misc.ini ファイルを作成（同梱のファイル）し、volumesでマウント。
2. コンテナ再起動で設定反映。

### 【Linux特有】volumeマウント時のファイルowner問題

#### 背景

- 新規ファイル作成や編集はパーミッションエラーのため不可。
- Linux(Ubuntu-20.04)環境で起きた。
- Windowsでは追加、編集可能。

#### 回避策

- Windowsユーザーディレクトリで開発する。

#### 解決策

検証中

## その他のツール

### 復元時に使用するdomain置換ツール

- [Database Search and Replace Script in PHP](https://github.com/interconnectit/Search-Replace-DB)
  - GitHubからcloneすればユーザー情報提供不要

## Notice（その他の気づき）

### Docker Desk Top SetUp Tips

- docker-desktop > settings > Resources > WSL INTEGRATION > Ubuntu-20.04 をONにする。
- VScode > ターミナル > Ubuntu-20.04(WSL) を選択する。

### Linux Tips

#### ユーザーのユーザーIDやグループIDを調べる

- ユーザーのユーザーID（uid）やグループID（gid）を調べるには、idコマンドを使用する。

```bash
whoami
hoge

id hoge
uid=500（hoge） gid=501（hoge） 所属グループ=501（hoge）
```

【解説】ユーザーIDが500、グループIDが501、所属グループが501。ユーザー名と同じ名前のグループ名である。

### Dockerコマンド Tips

#### dockerで立ち上げたコンテナにログインする

```bash
docker exec -it [コンテナ名] /bin/bash
```

#### ログインしたいコンテナ名やIDを確認する

```bash
docker ps
```
