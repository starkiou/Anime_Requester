#  Anime Requester

Un outil de recherche d'anime développé en HTML5, CSS et JavaScript vanilla. Trouvez vos animes préférés facilement !

## ✨ Fonctionnalités

- 🔍 Recherche d'animes par nom, identifiant, classement ou genre
- 🎯 Interface simple et intuitive
- 📱 Design responsive pour tous les appareils
- 🖼️ Arrière-plan personnalisé
- 🎨 Thème moderne avec police Outfit
- 🔑 Intégration API RapidAPI pour des données à jour

## 🔑 Obtenir une clé API RapidAPI (obligatoire)

Cette application utilise l'API **Anime DB** via RapidAPI pour récupérer les informations sur les anime.  
Vous devez obtenir votre propre clé API gratuite pour que l'application fonctionne.

### Étapes pour obtenir une clé API

1. Créez un compte sur RapidAPI :  
   https://rapidapi.com/auth/sign-up

2. Connectez-vous à votre compte RapidAPI.

3. Recherchez l'API **Anime DB** :
   - Cliquez sur la barre de recherche (en haut de la page)
   - Tapez : `Anime DB`
   - Sélectionnez l'API correspondante

4. Abonnez-vous à l'API :
   - Cliquez sur le bouton **Subscribe**
   - Choisissez le plan gratuit (Basic)

5. Récupérez votre clé API :
   - Allez dans la section **Endpoints**
   - Votre clé API se trouve dans le champ : **X-RapidAPI-Key**


---

### ▶️ Utilisation dans l'application

Lorsque vous ouvrez l'application :

1. Saisissez votre clé API dans le champ prévu à cet effet
2. La clé sera stockée temporairement dans le `sessionStorage` de votre navigateur
3. Vous pourrez ensuite effectuer des recherches d'anime

---

### ⚠️ Important

- Votre clé API est personnelle — ne la partagez pas publiquement
- La clé est stockée uniquement dans votre navigateur (sessionStorage)
- Vous devrez la ressaisir si vous fermez le navigateur

---

### ✅ Vérification

Une fois la clé saisie, vous pourrez rechercher un anime par :

- Nom
- Identifiant
- Classement
- Genre (version avancée)

Les résultats s'afficheront sous forme de cartes contenant :
- Titre
- Image
- Synopsis
- Genres
- Classement
- Nombre d'épisodes

## 🎮 Comment Utiliser

1. Ouvrez `index.html` dans votre navigateur
2. Saisissez votre clé API RapidAPI dans le champ dédié
3. Entrez le nom de l'anime dans la barre de recherche
4. Cliquez sur **"Rechercher"** pour lancer la recherche
5. Découvrez les résultats sous forme de cartes !

## 📂 Structure du Projet

```
Anime_Requester/
├── index.html          # Page HTML principale
├── assets/
│   ├── back.jpg        # Image d'arrière-plan
│   ├── backMobile.png  # Image d'arrière-plan sur mobile
│   ├── moon.png        # Icône lune (non utilisée)
│   ├── sun.png         # Icône soleil (non utilisée)
│   └── tabLogo.png     # Icône de l'onglet
├── src/
│   ├── css/
│   │   └── styles.css      # Styles CSS
│   └── javascript/
│       └── script.js     # Logique de l'application
└── README.md          # Ce fichier
```

## 🚀 Installation

Aucune installation requise ! Il suffit de :

1. Cloner le repository ou télécharger les fichiers
2. Ouvrir `index.html` dans un navigateur web
3. C'est prêt à utiliser ! 🎉

## 🛠️ Technologie

- **HTML5** : Structure de la page
- **CSS3** : Design moderne et responsive
- **JavaScript Vanilla** : Logique de l'application sans dépendances

## 👥 Auteurs

- Mohamed
- Milo
- Lylian

## 🙋 Mon rôle

Projet réalisé à trois en BUT Informatique ; ce dépôt est mon fork personnel. Je me suis occupé de la partie API :

- construction des URL de requête selon le filtre choisi
- recherche par identifiant, par classement et par nom
- filtrage des résultats par genre
- saisie de la clé API par l'utilisateur et stockage en `sessionStorage`

**Amusez-vous bien !**
