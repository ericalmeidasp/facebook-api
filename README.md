# facebook-api - Backend
$ Api do Clone do Facebook com funçóes de -> 
$ registros (com envio de email e confirmação)
$ usuarios (com avatares)
$ postagens (com midias)
$ comentários
$ reações nos posts


# backend

## Build Setup

Install [Docker Compose](https://docs.docker.com/compose/install/).

```bash
# Create container with MySQL
$ docker-compose up -d

# install dependencies
$ npm install

# Create database structure
$ node ace migration:run

# server with changes watcher
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start
