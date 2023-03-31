# Changelog

## [1.6.0](https://gitlab.mim-libre.fr/alphabet/sondage/compare/release/1.5.0...release/1.6.0) (2023-01-30)


### Features

* **groups:** display structure groups correctly ([4cdce24](https://gitlab.mim-libre.fr/alphabet/sondage/commit/4cdce244b93153121bd69cd0c19611c2070e6e3f))
* **meetings:** add meeting answer cancel and edit page ([62ba40b](https://gitlab.mim-libre.fr/alphabet/sondage/commit/62ba40b5926b72470d3ceb4a20c69744c5561c2c))
* **meetings:** allow poll owner to edit meeting slot for an answer ([cab6c99](https://gitlab.mim-libre.fr/alphabet/sondage/commit/cab6c99af32ccb1b62b61e6cc2d1b13e092bf84a))
* **meetings:** check user input on meeting answer edit ([20281e8](https://gitlab.mim-libre.fr/alphabet/sondage/commit/20281e828bccb41398e3baa5de5c52ee7020c489))
* **meteor:** update meteor to 2.8.1 ([f1b5cca](https://gitlab.mim-libre.fr/alphabet/sondage/commit/f1b5ccae41c392cfbfe39036ea25e4d57bd86d04))
* **packages:** update meteor to 2.8.0 and others packages ([3771692](https://gitlab.mim-libre.fr/alphabet/sondage/commit/3771692c4576357b1f6686c262e457c39dea99f3))
* **poll creation:** don't allow duplicate time slots ([dd841b1](https://gitlab.mim-libre.fr/alphabet/sondage/commit/dd841b143a48158edf3d98a871397c1556d02ff3))
* **poll:** add divider in poll answer ([df5de28](https://gitlab.mim-libre.fr/alphabet/sondage/commit/df5de28b808973390a06f4caeac8624e0680b21e))
* **polls:** add ten minutes step ([d6e1e50](https://gitlab.mim-libre.fr/alphabet/sondage/commit/d6e1e5017f0582fae0ca7bc957de4b35a3495597))


### Bug Fixes

* **edition:** don't add erroneous values at group selection ([d445769](https://gitlab.mim-libre.fr/alphabet/sondage/commit/d445769dbb96321c778f048fd8fac9b1755730c5))
* **navigation:** add condition on previous button in step 4 ([08907f0](https://gitlab.mim-libre.fr/alphabet/sondage/commit/08907f0f2926e4551e4dd6f7c6ab9dceeaeb7c0e))


### Tests

* **meeting:** add tests for poll_answers edit, cancel, get ([16b95c5](https://gitlab.mim-libre.fr/alphabet/sondage/commit/16b95c5f8f709a040b40fb9b55978e258f20ad3c))

## [1.5.0](https://gitlab.mim-libre.fr/alphabet/sondage/compare/release/1.4.0...release/1.5.0) (2022-11-22)


### Features

* **meeting:** add validation modal when answer to a meeting ([c7f9b00](https://gitlab.mim-libre.fr/alphabet/sondage/commit/c7f9b000663fa5f043fc727cb172b558b9589d8c))
* **meeting:** send email when user submit date ([ce0914d](https://gitlab.mim-libre.fr/alphabet/sondage/commit/ce0914d168027513ecc74e6ca6284bedba0709dd))
* **modal:** add edit button in validation modal ([f54e5fa](https://gitlab.mim-libre.fr/alphabet/sondage/commit/f54e5fa059e83775abe21bd8ebc5e392e23ef781))


### Bug Fixes

* **footer:** use settings subscription in store for footer ([95960bd](https://gitlab.mim-libre.fr/alphabet/sondage/commit/95960bdd4cbb40636759cfddb08b74e1457a288d))
* **label:** change label in meeting creation ([7a7c219](https://gitlab.mim-libre.fr/alphabet/sondage/commit/7a7c21921bb01719e3f0787276938f46597364ce))
* **methods:** delete meteor istest for send email method ([5984c11](https://gitlab.mim-libre.fr/alphabet/sondage/commit/5984c11019cb4015201fcb934aa84145512a67d3))
* **pollanswer:** disable redirect for no connected user ([5d2a2d9](https://gitlab.mim-libre.fr/alphabet/sondage/commit/5d2a2d9f7ba5e136f56529ed064793a907f50bd9))
* **pollAnswer:** store userId in poll answer ([07ad771](https://gitlab.mim-libre.fr/alphabet/sondage/commit/07ad7718fc948ca113aaa2d310e901281aacd6ba))
* **poll:** disabled redirect for no connected user ([8f4c436](https://gitlab.mim-libre.fr/alphabet/sondage/commit/8f4c436d39dc87537a242287df8f4f8b49a65037))
* **test:** add optional into fields and delete label ([cd9ccdc](https://gitlab.mim-libre.fr/alphabet/sondage/commit/cd9ccdcde4ec0b12269d6dac1fc357f83e713f09))
* **ui:** fix divider in selected date in meeting creation ([6f18ed0](https://gitlab.mim-libre.fr/alphabet/sondage/commit/6f18ed00a03307d80f6f72eb5a551596bdce9d55))
* **users:** fix published user fields ([657d1f3](https://gitlab.mim-libre.fr/alphabet/sondage/commit/657d1f330b8ee22c3b4522ec7006c89a131ef9a6))
* **users:** publish keycloak.name to client ([469c0bb](https://gitlab.mim-libre.fr/alphabet/sondage/commit/469c0bbcee8ecd34fbf5bb632b1b7a2559007374))


### Tests

* **app:** add all missing tests ([c25ff2d](https://gitlab.mim-libre.fr/alphabet/sondage/commit/c25ff2da08a5fcc30a6c505bb38d886507941dc9))
* **app:** add two missing tests ([7bd630c](https://gitlab.mim-libre.fr/alphabet/sondage/commit/7bd630c8688eebc9dc7ae72689a1594bbd54319f))

## [1.4.0](https://gitlab.mim-libre.fr/alphabet/sondage/compare/release/1.3.0...release/1.4.0) (2022-09-19)


### Features

* **autologin:** allow to log in and proceed on poll creation ([28c70f0](https://gitlab.mim-libre.fr/alphabet/sondage/commit/28c70f04b396a9792090ef46471971360cf14073))
* **event:** add organize of event in mail template ([8ad8f8a](https://gitlab.mim-libre.fr/alphabet/sondage/commit/8ad8f8a434cf3825d5ac2caae7eaee967718f9f5))
* **mail:** add firstname and lastname in mails template ([0725978](https://gitlab.mim-libre.fr/alphabet/sondage/commit/07259781a426e0e698ae9429ba1d6b9c4acc0a74))
* **poll:** pre-complete info from laboite ([dea291b](https://gitlab.mim-libre.fr/alphabet/sondage/commit/dea291b733bb8cbf6d3bad3e8bc31985b82eef86))


### Bug Fixes

* **creation:** don't add null group at creation, simplify code ([7bafbe3](https://gitlab.mim-libre.fr/alphabet/sondage/commit/7bafbe35bf14cd137262acfc46083100b54c2b19))
* **smtp:** change call to smtp settings ([4baa26b](https://gitlab.mim-libre.fr/alphabet/sondage/commit/4baa26bf8c333926ef0c9b78d22da34ed0165e6b))
* **ui:** fix css import at first load and correct favicon ([b2ff775](https://gitlab.mim-libre.fr/alphabet/sondage/commit/b2ff775930d5fd9e24c944f3266f4928e91e21a8))


### Build System

* **meteor:** update meteor 2.7.3 and node version 14.19.3 ([9003ae7](https://gitlab.mim-libre.fr/alphabet/sondage/commit/9003ae7e15b5dbb42eb38e003f17b05f971bf476))
* **npm:** change npm command run start-dev to start and port to 3010 ([7634593](https://gitlab.mim-libre.fr/alphabet/sondage/commit/763459370734bba009b6eb7145c646d2f111e8d6))


### Documentation

* **licence:** add licence in source code and package ([5959f25](https://gitlab.mim-libre.fr/alphabet/sondage/commit/5959f25f2a8a3c6452912de483924ab69bb5ba97))
* **readme:** update and translate doc files ([0c466e3](https://gitlab.mim-libre.fr/alphabet/sondage/commit/0c466e3181d2318c22d1bffdd902fe4e0f09a36d))
* **settings:** add readme and update settings sample ([07be2f5](https://gitlab.mim-libre.fr/alphabet/sondage/commit/07be2f527839ca24e8e1da179b355514cbc156dc))


### Continuous Integration

* **build-docker:** run for `testing` prerelease ([1f694ef](https://gitlab.mim-libre.fr/alphabet/sondage/commit/1f694ef795aeff0c336ad67d3225c1f25e1b2deb))
* **commitlint:** use new standard job `.git:commitlint` ([03f7c53](https://gitlab.mim-libre.fr/alphabet/sondage/commit/03f7c53c6069f4a9bafd87c1399075c224c9df81))
* **merge-to-dev:** use new standard jobs `.git:merge-to` ([c90b1a4](https://gitlab.mim-libre.fr/alphabet/sondage/commit/c90b1a4e6f808cf8f7dc78d8988651e55c88e9b5))
* **meteor:** test before generating a new release ([28b3b5a](https://gitlab.mim-libre.fr/alphabet/sondage/commit/28b3b5a92021483755fbf2283680fc8ce4418911))
* **semantic-release:** create `testing` prerelease ([996de70](https://gitlab.mim-libre.fr/alphabet/sondage/commit/996de703b1c91c351638aca8e86ee6b1ab6e68a8))
* **tag docker:** tag `testing` prerelease image ([1f43f0a](https://gitlab.mim-libre.fr/alphabet/sondage/commit/1f43f0af09f15c4448ddc70e38d6352e3a1ceab8))

# [1.3.0](https://gitlab.mim-libre.fr/alphabet/sondage/compare/release/1.2.0...release/1.3.0) (2022-07-06)


### Bug Fixes

* **config:** display warning if api key is not set ([8c338d8](https://gitlab.mim-libre.fr/alphabet/sondage/commit/8c338d814abe34e96ef2cb450788f2fee9081d95))
* **description:** limit description max length ([cd55beb](https://gitlab.mim-libre.fr/alphabet/sondage/commit/cd55beb675658cc533d2c67c5e4a0d008000065a))
* **email:** change validation for email field ([83a3aac](https://gitlab.mim-libre.fr/alphabet/sondage/commit/83a3aac89216f649c83d5e76715ef1f769d406dd))
* **form:** fix slow email input in public pool ([fd170cf](https://gitlab.mim-libre.fr/alphabet/sondage/commit/fd170cf96b3bd3a36650f7fd2aa56ca0e65a02f3))
* **lint:** ignore new js font file ([5c1d845](https://gitlab.mim-libre.fr/alphabet/sondage/commit/5c1d8452df67a1bfc7a851f9b0310f8fbae99a10))
* **login:** deny user creation, redirect to laboite ([c7e64fc](https://gitlab.mim-libre.fr/alphabet/sondage/commit/c7e64fc197ccf800cc7760afc47dfab5a91aa9f0))
* **meeting:** display list mode by default ([c8c01a6](https://gitlab.mim-libre.fr/alphabet/sondage/commit/c8c01a66e3ffb353a3121cc562a5efda1a4bf95f))
* **meeting:** hide other users name if not owner ([8f38fd7](https://gitlab.mim-libre.fr/alphabet/sondage/commit/8f38fd721d5c1b5552180c0b4ee6e63fb80af9f2))
* **poll:** add name on poll answer instead of email ([824b577](https://gitlab.mim-libre.fr/alphabet/sondage/commit/824b5778c4e54aafba2bf43577de1bd42b4d7797))
* **poll:** rework regex to allow long email for pool answer ([4430ba6](https://gitlab.mim-libre.fr/alphabet/sondage/commit/4430ba6a9a32e0e770d53b0efbd8a83b9614650f))
* **poll:** show others users name in poll display ([9b3904d](https://gitlab.mim-libre.fr/alphabet/sondage/commit/9b3904dbef9bce247346ec9231ecdb8c1d9b9b91))
* set default timezone to europe/paris ([bd59d85](https://gitlab.mim-libre.fr/alphabet/sondage/commit/bd59d85d2e741c3af1980161a7876dd53db227f5))
* **title:** fix title max length ([39dbae3](https://gitlab.mim-libre.fr/alphabet/sondage/commit/39dbae39f4984d8e250606b81434c142d6bd574e))
* **ui:** bad title in create/edit first step ([7da5a78](https://gitlab.mim-libre.fr/alphabet/sondage/commit/7da5a78bbbfe37525b36897e8b1c880573d73bbd))
* **ui:** change container size for logout menu ([3dd7a8d](https://gitlab.mim-libre.fr/alphabet/sondage/commit/3dd7a8dc6b084a0074730d126f2cfe8779924656))
* **ui:** change logo alt attribut ([6a53108](https://gitlab.mim-libre.fr/alphabet/sondage/commit/6a531088db8a8df279434249ec4a2e1629740fd0))
* **ui:** change logo's path ([b36e303](https://gitlab.mim-libre.fr/alphabet/sondage/commit/b36e303180cbef2284c30c0bf899e9fbd1d15fd2))
* **ui:** fix avatar size in navbar for firefox ([b2bad2f](https://gitlab.mim-libre.fr/alphabet/sondage/commit/b2bad2f19e3712c4a769131d3f639f2fa0b6a15e))
* **ui:** fix language picker ([6694ed7](https://gitlab.mim-libre.fr/alphabet/sondage/commit/6694ed7fee1c815d8c5c25b07824b02ff8fef0ab))
* **ui:** hide scroll bar when is not requiered ([ef95666](https://gitlab.mim-libre.fr/alphabet/sondage/commit/ef956667234a84330469f2395a9e4b6ba39eb17f))
* **ui:** update french translation ([6ce9dcc](https://gitlab.mim-libre.fr/alphabet/sondage/commit/6ce9dcc023ddf0cbd38c498008fc8cc7f921decb))
* **ui:** update libraries ([77151bc](https://gitlab.mim-libre.fr/alphabet/sondage/commit/77151bc38f0056420d64ef85ed6ed04110d8334e))
* **ui:** use fontansome icon with local import ([d3b4460](https://gitlab.mim-libre.fr/alphabet/sondage/commit/d3b446095df24de4e37fb9b091094c65a697999c))


### Build System

* **meteor:** update meteor 2.7.2 ([a5ce429](https://gitlab.mim-libre.fr/alphabet/sondage/commit/a5ce42952c445ab97cded25bb3909d8ab9d7178a))


### Code Refactoring

* **menu:** new user menu style ([fe0b62e](https://gitlab.mim-libre.fr/alphabet/sondage/commit/fe0b62e6113f981ce56bb67bd85eb9f6c599fd84))
* **ui:** refactor maintenance page ([2d07b2a](https://gitlab.mim-libre.fr/alphabet/sondage/commit/2d07b2ac2216efdf82ff66dcb34a53aba04fcbb3))


### Features

* **maintenance:** lock application if laboite is in maintenance mode ([f2225b9](https://gitlab.mim-libre.fr/alphabet/sondage/commit/f2225b9cd6268840a99bd027aa4282f90242ce86))
* **meeting:** hide other users email, colorize slots ([5353fd3](https://gitlab.mim-libre.fr/alphabet/sondage/commit/5353fd3272b6fd0ddb1fa97a6bbc63e6955528b9))
* **menu:** fix size of logout button ([9ef8706](https://gitlab.mim-libre.fr/alphabet/sondage/commit/9ef87069c36358d382985ef595eb998b06eabf64))
* **poll:** add name field in poll and meeting answer ([80f07f0](https://gitlab.mim-libre.fr/alphabet/sondage/commit/80f07f01cd53fcbd28fb81116871bd16667ac198))
* **ui:** add text in metting and pools answer ([e959220](https://gitlab.mim-libre.fr/alphabet/sondage/commit/e959220b11777a39f5fcaf9012cf8bca568248d9))
* **ui:** fix user menu for firefox ([1469a24](https://gitlab.mim-libre.fr/alphabet/sondage/commit/1469a24281584b17e4627634caab5d178ca58d11))

# [1.2.0](https://gitlab.mim-libre.fr/alphabet/sondage/compare/release/1.1.0...release/1.2.0) (2022-05-05)


### Bug Fixes

* **audit:** update Dockerfile and CI ([b302cfc](https://gitlab.mim-libre.fr/alphabet/sondage/commit/b302cfc3f848dc4fff9078d7b5c5f2d44d1277c4))
* **audit:** update meteor and libraries ([8a2b70e](https://gitlab.mim-libre.fr/alphabet/sondage/commit/8a2b70e5c0dea2b8f330d7ddae18d802938cf830))
* **audit:** update to Meteor 2.7.1 ([81c15e5](https://gitlab.mim-libre.fr/alphabet/sondage/commit/81c15e53963cbe340cd2016e519004a9fb55d56d))
* **polls:** total number of polls/meetings is not detected correctly ([ce5afc0](https://gitlab.mim-libre.fr/alphabet/sondage/commit/ce5afc0202adb4041dba20e1224a267ade753bfa))


### Code Refactoring

* **ui:** change spinner logo in loader file ([559fb4b](https://gitlab.mim-libre.fr/alphabet/sondage/commit/559fb4b5c4b10cbba805337e562f2697e7f2d043))


### Features

* **ui:** change logo and fit nav bar with new logo ([cb0104a](https://gitlab.mim-libre.fr/alphabet/sondage/commit/cb0104a7b739bc9fae9967b100435832cc539094))

# [1.1.0](https://gitlab.mim-libre.fr/alphabet/sondage/compare/release/1.0.3...release/1.1.0) (2022-03-11)


### Features

* **autologin:** work in progress for autologin feature ([48062fd](https://gitlab.mim-libre.fr/alphabet/sondage/commit/48062fd084a279d77c81a3f73ab96c15d9771f4b))

## [1.0.3](https://gitlab.mim-libre.fr/alphabet/sondage/compare/release/1.0.2...release/1.0.3) (2022-01-19)


### Bug Fixes

* **backend:** fix poll date validation ([09b153c](https://gitlab.mim-libre.fr/alphabet/sondage/commit/09b153c4f5df6f6d22c792b062475699a6a2981e))
* **backend:** fix poll date validation ([686c52a](https://gitlab.mim-libre.fr/alphabet/sondage/commit/686c52a4ab48e7a8d1907805758911010352fb51))
* **backend:** reduce duplicate participants on poll date validation ([d506a8b](https://gitlab.mim-libre.fr/alphabet/sondage/commit/d506a8b4e9132033b15d3e6855b3cb8e1bc1cb20))
* **gitlab-ci:** some globally defined keywords are deprecated ([4131ec1](https://gitlab.mim-libre.fr/alphabet/sondage/commit/4131ec160fb06706e9640e788e3772730599f056))
* **libs:** switch back to official package for mexar:mdt ([7913abe](https://gitlab.mim-libre.fr/alphabet/sondage/commit/7913abe01486633c28591f60c589d8fac4117119))
* **lib:** update dependencies ([4abb19c](https://gitlab.mim-libre.fr/alphabet/sondage/commit/4abb19c57ef2a30185d071e33721b8d53ee06009))
* **poll event:** flatten array of participations when creating event ([e343415](https://gitlab.mim-libre.fr/alphabet/sondage/commit/e343415417f8ac212fe5f2de30a6f5d3ebd18b27))
* **semantic-release):** the stable branch is `master` ([1534231](https://gitlab.mim-libre.fr/alphabet/sondage/commit/1534231e0f9cd27f662f14053853eb159331f928))
* **ui:** fix all day polls validation and count dates ([b9c1d82](https://gitlab.mim-libre.fr/alphabet/sondage/commit/b9c1d824d7e297b37aa967167a65d250adfb9d4e))
* **ui:** fix dates count for rdv ([79d9912](https://gitlab.mim-libre.fr/alphabet/sondage/commit/79d9912f630bdce0214e46b1287698709fd7cef0))
* **ui:** various enhancements for poll/meeting ui ([a0d9fb3](https://gitlab.mim-libre.fr/alphabet/sondage/commit/a0d9fb36478ea3f1db4c27c1e1d25fa85944646f))
* **version:** update testing version ([3d29129](https://gitlab.mim-libre.fr/alphabet/sondage/commit/3d29129161037bcbb6fd2b89decdce15a544a141))
* **version:** update version number for testing ([cc64bc8](https://gitlab.mim-libre.fr/alphabet/sondage/commit/cc64bc8d1d9755185582d9a3ddeb367c9e05a495))
* **version:** update version number for testing ([1ac3146](https://gitlab.mim-libre.fr/alphabet/sondage/commit/1ac3146ae10ffcd78d7b8265181cdf891a9611c0))


### Continuous Integration

* **build:** create the docker image and push it to `${CI_REGISTRY}` ([092bcd5](https://gitlab.mim-libre.fr/alphabet/sondage/commit/092bcd5e1f86cdaebecda1a02acb7678835fb39d))
* **commitlint:** enforce commit message format ([1ecaef7](https://gitlab.mim-libre.fr/alphabet/sondage/commit/1ecaef70d90834b19873fabf31a832c275c9ef7d))
* **release:** avoid regression in `dev` branch ([1b90833](https://gitlab.mim-libre.fr/alphabet/sondage/commit/1b9083346c1c1d8e87240f4e4a3b91adb1b2e808))
* **release:** create release automatically with `semantic-release` ([8d5af63](https://gitlab.mim-libre.fr/alphabet/sondage/commit/8d5af63790de78af7501775778caafe997ffd422))
* **release:** tag docker images based on release cycle ([d613b90](https://gitlab.mim-libre.fr/alphabet/sondage/commit/d613b90ce945ed45f8486b7e5bfab0b16e9e4119))
* **rules:** restrict execution to non stable branches by default ([779bd43](https://gitlab.mim-libre.fr/alphabet/sondage/commit/779bd439760952c759c16c389b95e9d697484a8a))
* **runners:** use OpenNebula runners with shared cache ([baccb68](https://gitlab.mim-libre.fr/alphabet/sondage/commit/baccb682dbb383275c09dfad896f5e18ced9cfe9))


### Styles

* **gitlab-ci:** better self explanatory job names ([f86b4ee](https://gitlab.mim-libre.fr/alphabet/sondage/commit/f86b4ee5a1cdec5103706e1087edd8a829165a53))
