---
layout: default
title: Tags
description: Mots-clés pour classer les contenus, avec une info au survol.
nav_order: 120
---

# Tags

Les tags servent à **catégoriser les contenus** (articles, événements, etc.) et à aider les visiteurs à **repérer rapidement le type de contenu**.  
Chaque tag a un **nom court** (visible sur la pastille) et peut avoir une **info au survol** (tooltip) pour préciser ce que ça couvre.

<!-- prettier-ignore-start -->
- TOC
{:toc}
<!-- prettier-ignore-end -->

## Où trouver les tags ?

Dans l’éditeur du site : **Contenu → Tags**.

Vous verrez une **liste de tags**. En ouvrant un tag, vous pouvez modifier ses **traductions (FR/EN)** et son **texte au survol**.

---

# À remplir en priorité

> Objectif : en remplissant juste cette partie, vous pouvez déjà enregistrer et revenir plus tard.

## Nom du tag ✅

- **Nom dans l'éditeur du site** : `name` *(dans les traductions)*
- **À quoi ça sert** : le libellé affiché sur la pastille (le tag visible)
- **Comment le remplir** :
  - court, clair, **sans parenthèses**
  - idéalement **1 à 3 mots**
  - éviter les formulations trop longues
- **Exemple** : `Appel à participation`
- **Conseil** : si vous avez besoin de préciser, utilisez le champ **tooltip** plutôt que d’allonger le nom.

---

# Traductions ✅

- **FR obligatoire**, **EN recommandé**
- Remplir **FR d’abord**, puis **EN**
- Les tags sont souvent visibles partout : mieux vaut des traductions **stables** et **cohérentes**.

## Nom (texte court)
- **Nom dans l'éditeur du site** : `name`
- **Où ça s’affiche** : pastilles de tags (cartes, pages, filtres)
- **Longueur** : court (idéalement < 30 caractères)
- **Exemple (FR)** : `Spectacle`
- **Exemple (EN)** : `Performance`

## Info au survol (tooltip)
- **Nom dans l'éditeur du site** : `tooltip`
- **Où ça s’affiche** : au survol de la pastille (hover)
- **Longueur** : 5 à 12 mots (une courte précision)
- **Comment le remplir** :
  - liste d’exemples, ou périmètre du tag
  - pas besoin de phrase complète
- **Exemple (FR)** : `théâtre, performance, concert, stand-up, etc.`
- **Exemple (EN)** : `theatre, performance, concert, stand-up, etc.`
- **Conseil** : si le tag est déjà explicite, vous pouvez laisser `tooltip` vide.

> Astuce : supprimez les phrases ajoutées par DeepL/IA du type “Voici la traduction…”.

---

# Options (facultatif)

## Tooltip vide
- si le tag est auto-explicatif (ex : `Projection`, `Réunion`, `Formation`), vous pouvez laisser `tooltip` vide
- la pastille restera affichée normalement, sans info au survol

## Suppression de tags (important) ⚠️
Supprimer un tag peut rendre certains contenus **plus difficiles à retrouver**, car ils n’apparaîtront plus dans les pages/filtres par tag.

**Avant de supprimer un tag :**
- identifier quels **articles/événements** utilisent ce tag
- choisir un **tag de remplacement** (ou plusieurs)
- **informer les éditeurs/utilisateurs** que ce(s) tag(s) vont être retirés

**Après suppression :**
- les utilisateurs doivent **mettre à jour tous les contenus** qui utilisaient ce tag (en ajoutant un nouveau tag)  
  ➜ sinon ces contenus ne seront plus trouvables via la navigation “par tag”.

**Bonne pratique :**
- au lieu de supprimer, préférez **renommer** le tag ou le **déprécier** (ex : “(ancien) …”) le temps de migrer les contenus, puis supprimer une fois la migration terminée.

---

# Procédure pas à pas

1. Aller dans **Contenu → Tags**
2. Cliquer sur **Créer** (ou ouvrir un tag existant)
3. Remplir d’abord :
   - ✅ `name` (FR)
   - ✅ `name` (EN recommandé)
   - `tooltip` (FR si utile)
   - `tooltip` (EN si vous avez la traduction)
4. Sauvegarder
5. Publier / rendre visible si votre workflow le demande (selon la configuration du site)

---

# Dépannage rapide

## “Je vois encore des parenthèses dans un tag”
- mettre le texte entre parenthèses dans `tooltip`
- garder `name` court (sans parenthèses)

## “Le tooltip ne s’affiche pas”
- vérifier que `tooltip` est rempli dans la bonne langue (FR/EN)
- vérifier que le tag est bien celui affiché sur la page
- si besoin : vider le cache / rafraîchir la page

## “J’ai supprimé un tag et des contenus ont disparu des filtres”
- c’est normal : le tag n’existe plus
- il faut **retrouver les contenus concernés** et leur attribuer un **nouveau tag**
- prévenir les éditeurs/utilisateurs si ce n’est pas déjà fait

## “Je n’arrive pas à enregistrer”
- vérifier que `name` (FR) est bien rempli
- vérifier que vous éditez bien la **traduction** (pas uniquement l’item racine)


<!-- --- -->
<!-- layout: default -->
<!-- title: Tags -->
<!-- description: Gérer les tags dans Directus (couleur, traductions et bonnes pratiques d’usage sur ConvergENS.) -->
<!-- nav_order: 7 -->
<!-- --- -->
<!---->
<!-- La collection `tags` sert à classer et regrouper le contenu (principalement les **articles**) par thématique.   -->
<!-- Un tag est généralement composé d’un **nom (traduit)** et d’une **couleur**. -->
<!---->
<!-- <!-- prettier-ignore-start --> -->
<!-- - TOC -->
<!-- {:toc} -->
<!-- <!-- prettier-ignore-end --> -->
<!---->
<!-- ## Où trouver les tags ? -->
<!---->
<!-- Dans Directus : **Contenu → tags**. -->
<!---->
<!-- --- -->
<!---->
<!-- ## Champs principaux -->
<!---->
<!-- ### Couleur (obligatoire) -->
<!---->
<!-- - **color** *(obligatoire)* : couleur associée au tag   -->
<!--   Cette couleur peut être utilisée sur le site pour afficher un badge, un repère visuel ou une catégorie. -->
<!---->
<!-- > Conseil : choisissez des couleurs suffisamment contrastées et cohérentes entre elles (évitez des couleurs trop proches si vous avez beaucoup de tags). -->
<!---->
<!-- ### Traductions (obligatoire) -->
<!---->
<!-- - **translations** *(obligatoire)* : nom du tag dans les différentes langues   -->
<!--   L’interface est configurée avec le français (`fr-FR`) par défaut. -->
<!---->
<!-- > Bon réflexe : renseignez au minimum le français. Si une autre langue est utilisée sur le site, ajoutez aussi la traduction correspondante. -->
<!---->
<!-- --- -->
<!---->
<!-- ## Champs techniques (automatiques) -->
<!---->
<!-- Ces champs sont gérés par Directus et sont cachés : -->
<!---->
<!-- - **id** -->
<!-- - **user_created**, **date_created** -->
<!-- - **user_updated**, **date_updated** -->
<!---->
<!-- --- -->
<!---->
<!-- ## Procédure recommandée (création) -->
<!---->
<!-- 1. **Contenu → tags → Créer** -->
<!-- 2. Renseigner : -->
<!--    - `color` -->
<!--    - `translations` (au moins FR, puis les autres langues si besoin) -->
<!-- 3. Enregistrer -->
<!---->
<!-- --- -->
<!---->
<!-- ## Bonnes pratiques (ConvergENS) -->
<!---->
<!-- - **Restez sobre** : mieux vaut quelques tags bien définis que trop de tags redondants. -->
<!-- - **Évitez les doublons** : avant de créer un tag, vérifiez s’il n’existe pas déjà (orthographe, singulier/pluriel). -->
<!-- - **Noms courts** : un tag doit être lisible comme un badge. -->
<!---->
<!-- --- -->
<!---->
<!-- ## Dépannage rapide -->
<!---->
<!-- ### “Je ne vois pas le nom du tag” -->
<!-- - Le nom est dans **translations** : ouvrez l’onglet de langue et vérifiez que le champ est rempli. -->
<!---->
<!-- ### “La couleur ne s’affiche pas comme prévu” -->
<!-- - Vérifiez que `color` est bien renseigné et enregistré. -->
<!-- - Si le site applique un thème, certaines couleurs peuvent être ajustées côté front. -->
