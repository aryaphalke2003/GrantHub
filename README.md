# Instructions to run

This website is built using NodeJS v16.13.2 and npm v8.1.2. These specific versions should be installed.

To install dependencies:

```bash
npm install
```

To compile (for production):

```bash
npm run build:prod
```

To run server

```bash
npm start
```

Database developed using PostgreSQL 13.6

To create required database

```bash
createdb grants
pg_restore -d grants -O dump.pg
```

Ignore any errors in the second command

Update the required details in `server/src/.env`. Specifically, the following fields need to be specified

```
PGUSER=postgres
PGHOST=127.0.0.1
PGPASSWORD=
PGDATABASE=grants
PGPORT=5432
```

`PGUSER` is the postgres user to use to login
`PGHOST` is the URL of the database server (127.0.0.1 for local system)
`PGPASSWORD` is the password of the postgres user
`PGDATABASE` is the name of the database to connect to (`grants` if the previous commands were used)
`PGPORT` is the port that the postgres server is listening on (5432 for a default postgres installation)

To host, run this under a process manager like pm2

```bash
npm install -g pm2
pm2 start server/dist/main.js
pm2 save
exec "$(pm2 startup)"
```

Then set up nginx. After installing, in `/etc/nginx/sites-enabled/`, edit the file named `default`. Inside the `server` section, to serve the site under path `/subpath` add the following lines:

```nginx
location /subpath {
    root /var/www/html/subpath;
    include proxy_params;
    proxy_pass http://localhost:3000;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}

location /subpath/authorize {
    root /var/www/html/subpath;
    include proxy_params;
    proxy_pass http://localhost:3000/authorize;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}

location /subpath/api {
    root /var/www/html/subpath;
    include proxy_params;
    proxy_pass http://localhost:3000/api;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

Additionally, add the following symlink:

```bash
sudo ln -s /path/to/grants-app/client/dist/ /var/www/html/subpath
```

Where `/path/to/grants-app/` is the **absolute** path to the directory containing this file

The public IP must also be added to the Google OAuth redirect URI in the Google developer console.