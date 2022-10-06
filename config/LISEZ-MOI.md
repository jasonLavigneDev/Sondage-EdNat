# Configuration

Copier `settings-development.json.sample` dans `settings-development.json` et mettre à jour les valeurs correspondant à votre configuration.

## public:

| Key                 | Type    | Default value           | Description                                                        |
| :------------------ | ------- | ----------------------- | ------------------------------------------------------------------ |
| appName             | string  | "Sondage"               | Nom de l'application                                               |
| appDescription      | string  | ""                      | Description de l'application qui sera affiché sous le titre        |
| enableKeycloak      | boolean | false                   | Si true, keycloak est activé                                       |
| keycloakUrl         | string  | ""                      | Keycloak URL                                                       |
| keycloakRealm       | string  | ""                      | Keycloak Realm                                                     |
| services            | object  | {}                      | Contient les url des services                                      |
| services.sondageUrl | string  | "http://localhost:3010" | L'url est nécessaire pour le remplissage des mails de confirmation |
| laboiteHost         | string  | "http://localhost:3000" | Url de l'application la Boite                                      |

## keycloak:

| Key           | Type     | Default value | Description             |
| ------------- | -------- | ------------- | ----------------------- |
| pubkey        | string   | ""            | Keycloak public key     |
| client        | string   | "sso"         | Keycloak client type    |
| adminEmails   | [string] | []            | Keycloak admin emails   |
| adminUser     | string   | ""            | Keycloak admin user     |
| adminPassword | string   | ""            | Keycloak admin password |

## nextcloud:

| Key               | Type   | Default value | Description        |
| ----------------- | ------ | ------------- | ------------------ |
| nextcloudUser     | string | ""            | Nextcloud user     |
| nextcloudPassword | string | ""            | Nextcloud password |
| nextcloudQuota    | number | "1073741824"  | Nextcloud quota    |

## rocketChat:

| Key                | Type   | Default value | Description         |
| ------------------ | ------ | ------------- | ------------------- |
| rocketChatUser     | string | ""            | RocketChat user     |
| rocketChatPassword | string | ""            | RocketChat password |

## smtp:

| Key       | Type   | Default value                         | Description                                 |
| --------- | ------ | ------------------------------------- | ------------------------------------------- |
| url       | string | "smtps://USERNAME:PASSWORD@HOST:PORT" | SMTP server URI                             |
| fromEmail | string | ""                                    | Valeur par défaut "from" du mail de contact |
| toEmail   | string | ""                                    | Valeur par défaut "to" du mail de contact   |

## private:

| Key     | Type     | Default value | Description                                |
| ------- | -------- | ------------- | ------------------------------------------ |
| apiKeys | [string] | [""]          | API access keys pour les services externes |
