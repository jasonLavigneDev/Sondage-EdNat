# L'application **Sondage** environnement DEV :

- [Installation](#installation)
  - [Application : Laboite](#application-laboite)
  - [Application : Sondage](#application-sondage)
  - [Paramètres](#paramètres)
- [Lancer le projet](#lancer-le-projet)
  - [Dans un terminal **Laboite**](#dans-un-terminal-laboite)
  - [Lancer un autre terminal **Sondage**](#lancer-un-autre-terminal-sondage)
  - [Ajouter des groupes à votre utilisateur](#ajouter-des-groupes-à-votre-utilisateur)
    - [Via l'interface utilisateur **localhost:3000**](#via-linterface-utilisateur-localhost3000)
***
## Installation

### Application : Laboite

Procédure d'installation :

```
git clone https://gitlab.mim-libre.fr/alphabet/laboite.git
cd laboite
cp config/settings.development.json.sample config/settings.development.json
cd app
meteor npm install
```

### Application : Sondage

Procédure d'installation :

```
git clone https://gitlab.mim-libre.fr/alphabet/sondage.git
cd sondage
cp config/settings.development.json.sample config/settings.development.json
meteor npm install
```

### Paramètres

Pour le fonctionnement de **Sondage** en local, il faut configurer une instance locale de **LaBoite** avec authentification sur un serveur Keycloak. Ajouter au moins une clé d'API dans la variable `private:apiKeys`.
Se reporter au [document relatif à la configuration](config/LISEZ-MOI.md).

## Lancer le projet

### Dans un terminal **Laboite**

```
cd laboite/app
meteor npm start
```

Il est possible de vérifier le fonctionnement de la boite en tapant la ligne suivante à partir d'un navigateur :

```
http://localhost:3000
```

### Lancer un autre terminal **Sondage**

```
cd sondage
meteor npm start
```

À partir du navigateur, tapez ceci :

```
http://localhost:3010
```

### Ajouter des groupes à votre utilisateur

#### Via l'interface utilisateur **localhost:3000**

À partir de l'application `LaBoite` que vous accédez à partir du navigateur

```
http://localhost:3000
```

Aller dans le fichier de config de Laboite `./config/settings.development.json`

Modifier l'attribut : "whiteDomains" en fonction de votre mail user

Exemple :

Pour un mailUser = 'toto@gmail.com', il faudra ajouter "^gmail.com"

Ce qui donnerait :

    "whiteDomains": [
      "^ac-[a-z-]\\.fr",
      "^[a-z-]\\.gouv.fr",
      "^gmail.com"
    ]

Relancer la boite

Naviguez sur `http://localhost:3000` (créez votre utilisateur dans keycloak en suivant le lien proposé sur la page d'authentification).

En allant dans l'onglet "Groupes", vous pouvez "Rejoindre le groupe" automatiquement pour tous les groupes en bleu

Rafraîchir la page **Sondage** du navigateur

```
http://localhost:3010
```
