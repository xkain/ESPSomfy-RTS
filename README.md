# Version traduite en français du projet de  [rstrouse](https://github.com/rstrouse/ESPSomfy-RTS) 


# ESPSomfy-RTS <image src="https://user-images.githubusercontent.com/47839015/218898940-3541b360-5c49-4e38-a918-392cd0408b76.png" align="right" style="width:177px;display:inline-block;float:right"></image>

Un contrôleur pour stores et volets Somfy RTS, capable de gérer jusqu’à 32 stores individuels et 16 groupes via les protocoles RTx 433 MHz. Si vous utilisez des moteurs IO Home Control, ce projet n’est pas pour vous, mais vous pouvez utiliser le protocole IO Remote pour connecter le dispositif ESPSomfy RTS à une télécommande disectée. Consultez le [Wiki](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Controlling-Motors-with-GPIO) pour les options et vérifiez si la solution est compatible avec votre matériel.

La plupart des protocoles 433 MHz sont supportés, y compris RTS, RTW, RTV/L et les transceivers radio 433,92 MHz. Vous pouvez même combiner ces protocoles sur le même dispositif tant que la fréquence de base est réglée dans la même plage. Par exemple, vous ne pouvez pas avoir des moteurs 433,92 MHz et 433,42 MHz sur le même appareil.

Si vous avez des moteurs nus, vous pouvez les contrôler via un module relais connecté avec une configuration simple. Donc, si vous possédez plusieurs moteurs sans module radio, cette solution les couvre également. Une fois configuré, vous pourrez utiliser n’importe quelle télécommande supportant les protocoles RTS, RTW ou RTV sur la bande 433 MHz.

## Pourquoi ce projet existe-t-il ?
La majeure partie de ma maison est automatisée, et l’un des aspects les plus gênants était que trois stores de patio très coûteux n’avaient toujours aucune automatisation. Comme ils étaient sur le patio, je devais courir pour chercher la télécommande Telis torpedo chaque fois que je voulais manipuler les stores extérieurs. Mon patio est assez grand et les stores font très bien leur travail pour bloquer le soleil brûlant de fin d’après-midi. Ces petites télécommandes sont sournoises : elles se cachent en pleine vue et bougent souvent hors de portée quand on se détend, vous obligeant à vous lever. Imaginez simplement donner des ordres et qu’ils s’exécutent automatiquement.

J’ai donc cherché des bibliothèques capables d’automatiser mes stores et de m’épargner de maudire le torpedo. Je ne voulais pas seulement les déplacer, je voulais interagir avec eux et gérer leur position. Et comme cette télécommande Telis torpedo m’accompagne depuis longtemps, je voulais aussi pouvoir continuer à l’utiliser.

Mes recherches m’ont conduit à plusieurs projets prometteurs. La plupart pouvaient envoyer des commandes via un CC1101 attaché à un ESP32, mais je voulais aussi pouvoir capter les informations de toutes télécommandes externes. Ne trouvant pas exactement ce que je voulais, ce dépôt est né. ESPSomfy RTS peut non seulement contrôler les stores, mais aussi gérer la position actuelle même lorsqu’une télécommande classique est utilisée.

Ce logiciel utilise quelques composants matériels faciles à trouver, incluant un module ESP32 et un transceiver CC1101. Le CC1101 est connecté à l’ESP32 via SPI et contrôlé avec la bibliothèque SmartRC-CC1101-Driver. Début 2023, le coût total pour moi des composants finaux était d’environ 12 $ US.

# Mises à jour du dispositif ESPSomfy RTS

Si vous cherchez à installer le dernier logiciel sur votre appareil, le wiki fournit les instructions ici : [Updating ESPSomfy RTS](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Updating-ESPSomfy-RTS)

# Fonctionnalités

Une fois opérationnel, vous pourrez interagir avec vos stores via l’interface web intégrée, l’interface socket et MQTT. Il existe également une [Home Assistant integration](https://github.com/rstrouse/ESPSomfy-RTS-HA) installable via HACS, permettant de contrôler vos stores à distance et de créer des automatisations.

![image](https://user-images.githubusercontent.com/47839015/224559426-c81422c0-cdfe-45f9-a9c2-0c727619cdf9.png)

![image](https://github.com/rstrouse/ESPSomfy-RTS/assets/47839015/2a605e54-4487-49ba-9a7a-07e153db1c02)

* Identifier chaque dispositif par type de moteur (Store, Volet, Rideau, Persienne, ou Tente)
* Contrôler les mouvements avec les boutons haut, bas et my
* Définir et supprimer la position favorite “my”
* Positionnement interactif
* Incliner les stores
* Définir l’inclinaison du store par pourcentage
* Contrôler les capteurs de soleil/vent pour les stores extérieurs


## Déplacer un store

Vous pouvez monter complètement le store avec le bouton haut. Pour l’arrêter pendant le mouvement, appuyez sur le bouton my. Pour le descendre complètement, appuyez sur le bouton bas. À tout moment, le bouton my permet d’arrêter le store.

Pour déplacer le store vers une position favorite, appuyez sur le bouton my lorsque le store est à l’arrêt : il ira à la position favorite. Ces positions sont affichées sous le nom du store.

Pour déplacer un store vers un pourcentage de fermeture précis, cliquez sur l’icône du store. Une interface s’ouvre pour sélectionner la position via un curseur. Relâchez le curseur et le store se déplacera pour atteindre la position souhaitée. La position peut être modifiée même pendant le mouvement.

![image](https://user-images.githubusercontent.com/47839015/224559596-aa98d015-ee74-41f1-a852-3018f861e354.png)


## Définir une position favorite

Pour définir votre position favorite "my", vous pouvez utiliser l’interface ESPSomfy RTS ou votre télécommande Somfy. ESPSomfy RTS détecte l’appui long du bouton my et enregistre la position favorite. Si vous aviez une position favorite avant l’installation, réinitialisez-la via ESPSomfy RTS. Somfy utilise la même commande pour définir et supprimer ses favoris.

Pour définir ou supprimer une position favorite, appuyez longuement sur le bouton my. Après quelques secondes, un écran s’affiche. ESPSomfy RTS permet de définir une position favorite via un curseur (ex. 37 %) puis en appuyant sur `SET MY POSITION` Le store se déplacera et effectuera un petit mouvement pour confirmer l’enregistrement.

![image](https://user-images.githubusercontent.com/47839015/224559730-859d3f9c-177c-46c3-9fb4-1a7df2cac505.png)

Pour supprimer une position favorite, effectuez un appui long sur le bouton my pour ouvrir l’interface des favoris, déplacez le curseur sur la position actuelle et appuyez sur `CLEAR MY POSITION`.  Le store effectuera un petit mouvement pour confirmer la suppression.

![image](https://user-images.githubusercontent.com/47839015/224559837-ad28b843-49ab-468c-8b8c-1ad470775750.png)

## Démarrage
Pour commencer, vous devez créer un dispositif radio. Le wiki fournit toutes les instructions : Guide matériel simple. Des connexions Dupont entre le module radio et l’ESP32 suffisent. Des instructions pour fabriquer un boîtier discret sont également incluses.
Ensuite, installez le firmware initial sur l’ESP32. Le guide d’installation est ici : [Simple Hardware Guide](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Simple-ESPSomfy-RTS-device)

Ensuite, vous devez installer le firmware initial sur l’ESP32. Une fois le firmware compilé et installé pour votre ESP32, le processus d’installation consiste simplement à téléverser le fichier embarqué sur votre ESP32. Vous trouverez le guide d’installation du firmware dans le wiki :[Firmware Guide](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Installing-the-Firmware)

Une fois votre matériel prêt, il ne vous reste plus qu’à connecter l’ESP32 à votre réseau et commencer l’appairage de vos stores. Le guide logiciel du wiki vous accompagnera pour appairer vos stores, lier les télécommandes et configurer vos stores. Le wiki contient également un guide logiciel complet pour la configuration. La bonne nouvelle est que ce processus est assez simple à suivre et vous permet de tout mettre en service rapidement.

[Configuring ESPSomfy-RTS](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Configuring-the-Software)


## Intégrations
Bien que l’interface fournie avec ESPSomfy RTS soit déjà une grande amélioration, l’objectif de ce projet est de rendre les stores contrôlables depuis n’importe quel endroit. Pour cela, j’ai créé plusieurs interfaces que vous pouvez utiliser pour ajouter vos propres automatisations. Ces options s’adressent aux utilisateurs avancés, utilisant par exemple Node-Red ou leur propre interface web.

Vous trouverez la documentation des interfaces dans le wiki [Integrations](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Integrations) Beaucoup de ressources pour ceux qui utilisent Node-Red ou des interfaces personnalisées.
  
## Sources du projet
J’ai étudié de nombreux sujets, mais la source principale de ce projet provient de https://pushstack.wordpress.com/somfy-rts-protocol/.  Le travail réalisé sur le timing du protocole par pushstack a rendu ce projet réalisable sans passer beaucoup de temps à mesurer les impulsions. 
  
La configuration du transceiver se fait avec la bibliothèque ELECHOUSE_CC1101, que vous devrez inclure dans votre projet si vous souhaitez compiler le code. Celle utilisée pour compiler ce module se trouve ici : https://github.com/LSatan/SmartRC-CC1101-Driver-Lib


## Traduction et modifications

Dans ma version, le fuseau horaire est d'office Europ/Paris, quelques modifications visuelles très légères ont été faites et la configuration des GPIO ont été changé par defaut pour correspondre à ceux que j'utilise:
* TX = 21 
* RX = 22
* 
Pour les fréquences, j'ai mis celles qui correspondent au bon fonctionnement de mes volets. Étant donné que vous n'avez très certainement pas les mêmes volets que moi, il vous faudra de toutes les façons trouver vos propres fréquences.
 
<img width="900" height="557" alt="Image" src="https://github.com/user-attachments/assets/0490384a-d166-4fd3-9324-6d8bbd30b140" />

  
## Boîtiers
Je propose des boîtiers  tout fait sur [Leboncoin](https://www.leboncoin.fr/profile/77a39e2a-ddb5-44c8-828a-954652c46ee7)

![Image](https://github.com/user-attachments/assets/e3bf97de-12a7-4c9a-8ed4-6d3a819818c0)
![Image](https://github.com/user-attachments/assets/90c1fde9-2c4d-47c5-ab9a-a5f065e9f149)


   






