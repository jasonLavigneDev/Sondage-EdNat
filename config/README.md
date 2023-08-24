# Configuration

Copy `settings-development.json.sample` to `settings-development.json` and update values matching your configuration

## public:

| Key                 | Type   | Default value           | Description                                                   |
| :------------------ | ------ | ----------------------- | ------------------------------------------------------------- |
| appName             | string | "Sondage"               | Application Name                                              |
| appDescription      | string | ""                      | Application description, it will be displayed under the title |
| keycloakUrl         | string | ""                      | Keycloak URL                                                  |
| keycloakRealm       | string | ""                      | Keycloak Realm                                                |
| services            | object | {}                      | Contains services url                                         |
| services.sondageUrl | string | "http://localhost:3010" | The url is necessary for filling in the confirmation emails   |
| laboiteHost         | string | "http://localhost:3000" | La Boite app url                                              |

## keycloak:

| Key    | Type   | Default value | Description          |
| ------ | ------ | ------------- | -------------------- |
| pubkey | string | ""            | Keycloak public key  |
| client | string | "sso"         | Keycloak client type |

## smtp:

| Key       | Type   | Default value                         | Description                       |
| --------- | ------ | ------------------------------------- | --------------------------------- |
| url       | string | "smtps://USERNAME:PASSWORD@HOST:PORT" | SMTP server URI                   |
| fromEmail | string | ""                                    | Contact mail default "from" value |
| toEmail   | string | ""                                    | Contact mail default "to" value   |

## private:

| Key           | Type     | Default value | Description                           |
| ------------- | -------- | ------------- | ------------------------------------- |
| laboiteApiKey | [string] | ""            | API access keys for external services |
