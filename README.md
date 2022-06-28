# API - Clone do Facebook - Rede social. 

Esta é uma API de um "Clone" do Facebook. Aqui voce terá Usuários, com envios de email e confirmação de cadastro. Terá Posts, comentários, Reações. Também terá sistema de seguidores e seguidos.


## Instalação

Primeiramente, rode um container com MySQL e com nossa base de dados. .

```bash
  cd facebook-api
  docker-compose up -d
```

Depois, Instale facebook-api com npm

```bash
    npm install
```

Rode as Migrations:


```bash
    node ace migration:run
```

E agora rode o servidor de desenvolvimento:

```bash
    npm run dev
```
