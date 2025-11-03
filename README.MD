ZAPATO est une boutique en ligne (fictive) de sacs à main, implémentée sous forme de Progressive Web App (PWA). Le projet met l'accent sur la performance, le fonctionnement hors ligne et l'expérience utilisateur mobile.

🌟 Fonctionnalités Clés
PWA Installable : L'application peut être installée directement sur l'écran d'accueil des appareils Android, iOS et Desktop.

Mode Hors Ligne : Consultation des produits et navigation de base grâce au Service Worker.

Catalogue Dynamique : Les produits sont chargés de manière asynchrone depuis un fichier products.json.

Système de Panier : Gestion du panier utilisateur via le localStorage.

Commande Simplifiée : Génération d'un message de commande pré-rempli via l'API WhatsApp.

Design Responsive : Utilisation de Bootstrap 5 pour un affichage optimisé sur tous les appareils.

⚙️ Structure du Projet

index.html: Page principale de la boutique (inclut la navigation et les modals).
style.css: Styles personnalisés pour le thème ZAPATO.
script.js Logique: front-end (Panier, Modals, Gestion de l'installation PWA).
service-worker.js: Logique de mise en cache pour le mode hors ligne.
manifest.json: Métadonnées de l'application (nom, icônes, start_url).
products.json: Base de données des produits (nom, prix, image).
icons/: Contient les icônes PWA (192x192.png, 512x512.png, etc.).

Installation et Utilisation

git clone https://github.com/dorianetoui/ZAPATO.git
cd ZAPATO
python -m http.server 8000

Puis ouvrez votre navigateur à l’adresse suivante :

http://localhost:8000


Installation de la PWA
ZAPATO peut être installée sur votre appareil pour une expérience plein écran et hors ligne.

Méthode Recommandée (Bouton Manuel) :

Ouvrez l'application dans votre navigateur (Chrome, Edge ou Safari).

Après quelques secondes d'interaction (défilement, clics), un bouton "Télécharger l'App 📱" apparaîtra dans la barre de navigation.

Cliquez sur ce bouton pour déclencher l'invite d'installation native du système.

Méthode Native (Chrome/Android) :

Ouvrez le menu de votre navigateur (les trois points).

Recherchez et cliquez sur l'option "Installer l'application" (ou "Ajouter à l'écran d'accueil").