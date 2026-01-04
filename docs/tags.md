---
layout: default
title: Tags
description: Gérer les tags dans Directus : couleur, traductions et bonnes pratiques d’usage sur ConvergENS.
nav_order: 8
---

La collection `tags` sert à classer et regrouper le contenu (principalement les **articles**) par thématique.  
Un tag est généralement composé d’un **nom (traduit)** et d’une **couleur**.

## Où trouver les tags ?

Dans Directus : **Contenu → tags**.

---

## Champs principaux

### Couleur (obligatoire)

- **color** _(obligatoire)_ : couleur associée au tag  
  Cette couleur peut être utilisée sur le site pour afficher un badge, un repère visuel ou une catégorie.

> Conseil : choisissez des couleurs suffisamment contrastées et cohérentes entre elles (évitez des couleurs trop proches si vous avez beaucoup de tags).

### Traductions (obligatoire)

- **translations** _(obligatoire)_ : nom du tag dans les différentes langues  
  L’interface est configurée avec le français (`fr-FR`) par défaut.

> Bon réflexe : renseignez au minimum le français. Si une autre langue est utilisée sur le site, ajoutez aussi la traduction correspondante.

---

## Champs techniques (automatiques)

Ces champs sont gérés par Directus et sont cachés :

- **id**
- **user_created**, **date_created**
- **user_updated**, **date_updated**

---

## Procédure recommandée (création)

1. **Contenu → tags → Créer**
2. Renseigner :
   - `color`
   - `translations` (au moins FR, puis les autres langues si besoin)
3. Enregistrer

---

## Bonnes pratiques (ConvergENS)

- **Restez sobre** : mieux vaut quelques tags bien définis que trop de tags redondants.
- **Évitez les doublons** : avant de créer un tag, vérifiez s’il n’existe pas déjà (orthographe, singulier/pluriel).
- **Noms courts** : un tag doit être lisible comme un badge.

---

## Dépannage rapide

### “Je ne vois pas le nom du tag”

- Le nom est dans **translations** : ouvrez l’onglet de langue et vérifiez que le champ est rempli.

### “La couleur ne s’affiche pas comme prévu”

- Vérifiez que `color` est bien renseigné et enregistré.
- Si le site applique un thème, certaines couleurs peuvent être ajustées côté front.
