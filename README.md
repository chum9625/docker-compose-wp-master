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

- htmlディレクトリ以下にWordPressファイル群がマウント
- wp-contentディレクトリはテーマ開発用にマウント

## 復元操作でsqlファイルインポート時はコメントアウトを外す

```yml
    volumes:
      - ./phpmyadmin-misc.ini:/usr/local/etc/php/conf.d/phpmyadmin-misc.ini
```

- phpmyadminディレクトリに、作成したphpmyadmin-misc.ini ファイルをマウント

## docker-compose.ymlの補足

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

## コマンド（docker-complse.ymlと同階層で実行）

- 起動　```docker-compose up -d```
- コンテナとデフォルトネットワーク削除　```docker-compose down```
- コンテナとデフォルトネットワークかつデータ削除　```docker-compose down --volumes```

## 復元時に遭遇するエラー

- 【phpMyAdmin】sqlファイルのインポートエラー「Incorrect format parameter」

### 原因

- インポートするsqlファイルのサイズ上限超過。（デフォルトは2048KB）

### 対処

- カスタム設定した phpmyadmin-misc.ini ファイルを作成し、volumesでマウント。
- コンテナ再起動で設定反映。

## 復元時に使用するdomain置換ツール

### [Database Search and Replace Script in PHP](https://github.com/interconnectit/Search-Replace-DB)

- GitHubからcodeを落とせばユーザー情報提供不要

## volumeマウント時のファイルowner問題

### 背景

- ファイルを作成するとパーミッションエラーが起き編集できない。
- Linux(Ubuntu-20.04)環境で起きる。
- Windowsでは問題なく編集可能。

### 回避策

Windowsで開発する。

#### SetUp Tips

- docker-desktop > settings > Resources > WSL INTEGRATION > Ubuntu-20.04 をONにする。
- VScode > ターミナル > Ubuntu-20.04(WSL) を選択する。

### 解決策

検証中

## Linux Tips

### ユーザーのユーザーIDやグループIDを調べるには

- ユーザーのユーザーID（uid）やグループID（gid）を調べるには、idコマンドを使用する。
- 以下の例では、ユーザーIDが500、グループIDが501、所属グループが501となっている。ユーザー名と同じ名前のグループ名である。

```bash
whoami
hoge

id hoge
uid=500（hoge） gid=501（hoge） 所属グループ=501（hoge）
```

### dockerで立ち上げたコンテナにログインするには

```bash
docker exec -it [コンテナ名] /bin/bash
```

### ログインしたいコンテナ名やIDを確認するには

```bash
docker ps
```
