## Docker Compose + WordPress
- [Quickstart: Compose and WordPress](https://docs.docker.com/compose/wordpress/)

## ディレクトリ構成

```
  my-wp-project
  ├── html/
  ├── phpmyadmin/
  ├── wp-content/
  ├── docker-compose.yml
  └── phpmyadmin-misc.ini
  ```
- htmlディレクトリ以下にWordPressファイル群がマウント
- wp-contentディレクトリはテーマ開発のためマウント
- phpmyadminディレクトリに、作成したphpmyadmin-misc.ini ファイルをマウント

## docker-compose.ymlの補足

- コンテナ名を付ける
  ```
  wordpress:
    container_name: my-wp-container
  ```

- volumesでデータ保持
  ```
  wordpress:
    volumes:
      - ./html:/var/www/html
      - ./wp-content:/var/www/html/wp-content
  ```

- サイトアクセスにサブフォルダを付ける　例）localhost:8000/wp

  ```
  wordpress:
    volumes:
      - ./html:/var/www/html/wp
    working_dir: /var/www/html/wp
  ```

## コマンド（docker-complse.ymlと同階層で実行）

- 起動　```docker-compose up -d```
- コンテナとデフォルトネットワーク削除　```docker-compose down```
- コンテナとデフォルトネットワークかつデータ削除　```docker-compose down --volumes```

## 【phpMyAdmin】SQLファイルのインポートエラー「Incorrect format parameter」の対処法

### 原因
- インポートするsqlファイルのサイズ上限超過。（デフォルトは2048KB）

### 対処
- カスタム設定した phpmyadmin-misc.ini ファイルを作成し、volumesでマウント。
- コンテナ再起動で設定反映。
