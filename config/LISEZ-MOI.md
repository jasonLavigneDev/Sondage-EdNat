# Configuration

Copier `settings-development.json.sample` dans `settings-development.json` et mettre à jour les valeurs correspondant à votre configuration.

## public:

| Key                                      | Type     | Default value                        | Description                                                                                                          |
| :--------------------------------------- | -------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| appName                                  | string   | "Sondage"                            | Nom de l'application                                                                                                 |
| appDescription                           | string   | ""                                   | Description de l'application qui sera affiché sous le titre                                                          |
| enableKeycloak                           | boolean  | false                                | Si true, keycloak est activé                                                                                         |
| keycloakUrl                              | string   | ""                                   | Keycloak URL                                                                                                         |
| keycloakRealm                            | string   | ""                                   | Keycloak Realm                                                                                                       |
| laboiteBlogURL                           | string   | ""                                   | Laboite Blog URL                                                                                                     |
| enableBBB                                | boolean  | true                                 | Si true, Big Blue Button est activé                                                                                  |
| BBBUrl                                   | string   | ""                                   | Big Blue Button URL                                                                                                  |
| minioSSL                                 | boolean  | false                                | Si true, minio est en SSL                                                                                            |
| minioPort                                | number   | null                                 | Minio port                                                                                                           |
| minioEndPoint                            | string   | ""                                   | Minio End Point                                                                                                      |
| minioBucket                              | string   | ""                                   | Minio Bucket                                                                                                         |
| imageFilesTypes                          | [string] | ["svg", "png", "jpg", "gif", "jpeg"] | Extensions de fichiers autorisées pour les images                                                                    |
| audioFilesTypes                          | [string] | ["wav", "mp3", "ogg"]                | Extensions de fichiers autorisées pour les sons                                                                      |
| videoFilesTypes                          | [string] | ["mp4", "webm", "avi", "wmv"]        | Extensions de fichiers autorisées pour les videos                                                                    |
| textFilesTypes                           | [string] | ["pdf", "odt", "txt", "docx"]        | Extensions de fichiers autorisées pour les documents                                                                 |
| otherFilesTypes                          | [string] | ["csv"]                              | Extensions de fichiers autorisées pour les autres fichiers                                                           |
| minioFileSize                            | number   | 500000                               | Taille de fichier maximale lors du téléchargement d’images de services dans l’espace d’administration                |
| minioStorageFilesSize                    | number   | 3000000                              | Taille de fichier maximale lors du téléchargement d’images de services dans l’espace utilisateur                     |
| maxMinioDiskPerUser                      | number   | 1000000                              | Capacité maximale du disque par utilisateur                                                                          |
| NotificationsExpireDays                  | object   | {}                                   | Nombre de jours pour conserver les notications par type (null ou 0 pour infini)                                      |
| NotificationsExpireDays.setRole          | number   | null                                 | Nombre de jours pour conserver les notications setRole (null ou 0 pour infini)                                       |
| NotificationsExpireDays.unsetRole        | number   | null                                 | Nombre de jours pour conserver les notications unsetRole (null ou 0 pour infini)                                     |
| NotificationsExpireDays.request          | number   | null                                 | Nombre de jours pour conserver les notications de requête (null ou 0 pour infini)                                    |
| NotificationsExpireDays.group            | number   | null                                 | Nombre de jours pour conserver les notications de groupe (null ou 0 pour infini)                                     |
| NotificationsExpireDays.default          | number   | null                                 | Nombre de jours pour ne pas conserver de notications de type (null ou 0 pour infini)                                 |
| groupPlugins                             | object   | {}                                   | Plugins externes pour les groupes                                                                                    |
| PLUGINNAME                               | object   | {}                                   | Paramètres généraux du plugin de groupe, voir ci-dessous "nextcloud" et "rocketChat" pour des paramètres spécifiques |
| groupPlugins.PLUGINNAME.enable           | boolean  | false                                | Si true, le plugin de groupe est activé                                                                              |
| groupPlugins.PLUGINNAME.URL              | string   | ""                                   | Plugin groupe URL                                                                                                    |
| groupPlugins.PLUGINNAME.groupURL         | string   | ""                                   | [URL]/group/[GROUPSLUG]" "[URL]/apps/files/?dir=/[GROUPNAME]                                                         |
| groupPlugins.PLUGINNAME.enableChangeName | boolean  | true                                 | Si true, changer le nom du groupe pour ce plugin de groupe est possible                                              |

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

| Key                   | Type     | Default value                              | Description                                                         |
| --------------------- | -------- | ------------------------------------------ | ------------------------------------------------------------------- |
| loginExpirationInDays | number   | 90                                         | Nombre de jours d’expiration du jeton de la session                 |
| fillWithFakeData      | boolean  | false                                      | Si true, les fausses données sont générées au début                 |
| minioAccess           | string   | ""                                         | Minio user                                                          |
| minioSecret           | string   | ""                                         | Minio password                                                      |
| apiKeys               | [string] | [""]                                       | Clés d’accès API pour les services externes                         |
| BBBSecret             | string   | ""                                         | Big Blue Button Secret                                              |
| whiteDomains          | [string] | ["^ac-[a-z-]_\\.fr", "^[a-z-]_\\.gouv.fr"] | Emails dans le white domain pour l’activation de compte utilisateur |
