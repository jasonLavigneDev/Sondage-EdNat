# Changelog

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
