## Docker Compose + WordPress
- [Quickstart: Compose and WordPress](https://docs.docker.com/compose/wordpress/)

## docker-compose.ymlの設定例

### htmlフォルダにWordPressファイル群全てをマウントする

- 作業フォルダ内にWordPressファイル群がマウントされるサブフォルダ(html)を作成。
```
  wp-sample-project
  ├── docker-compose.yml
  └── html/
  ```

- docker-compose.ymlのwordpressサービス配下に定義。
  ```
  wordpress:
    volumes:
      - ./html:/var/www/html
  ```

### wp-contentフォルダだけをマウントする

  ```
  wordpress:
    volumes:
       - ./wp-content:/var/www/html/wp-content
  ```

### コンテナ名を付ける

  ```
  wordpress:
    container_name: my-wp-container
  ```

### サイトアクセスにサブフォルダを付ける

- 例）　localhost:8000/wp

  ```
  wordpress:
    volumes:
      - ./html:/var/www/html/wp
    working_dir: /var/www/html/wp
  ```

## コマンド : docker-complse.ymlと同階層で実行

- 起動　```docker-compose up -d```
- コンテナとデフォルトネットワーク削除　```docker-compose down```
- コンテナとデフォルトネットワークかつDB削除　```docker-compose down --volumes```
