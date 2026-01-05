---
layout: default
title: Événements
description: Créer et gérer des événements dans Directus (dates, organisation porteuse, co-organisateurs, lieu, traductions et liens vers des articles.)
nav_order: 5
---

La collection `events` sert à gérer les **événements** affichés sur ConvergENS : titre/description (traductions), dates, lieu, organisation porteuse et co-organisateurs, ainsi que les liens vers des articles associés.

<!-- prettier-ignore-start -->
- TOC
{:toc}
<!-- prettier-ignore-end -->

## Où trouver les événements ?

Dans Directus : **Contenu → events**.

> Astuce : pour une vue plus confortable, utilisez le **layout Calendar** (calendrier) si disponible.

---

## Champs principaux

### Statut

- **status** : `published` / `draft` / `archived`

Recommandation :
- **draft** tant que l’événement n’est pas finalisé
- **published** quand il doit apparaître sur le site
- **archived** pour le retirer sans le supprimer

---

## Organisation et co-organisation

### Organisation porteuse (obligatoire)

- **collective** *(obligatoire, M2O → `collectives`)*  
  C’est l’organisation “principale” de l’événement.

### Co-organisateurs (obligatoire)

- **organisers** *(obligatoire, M2M)*  
  Permet d’associer une ou plusieurs organisations co-organisatrices.

> En pratique : utilisez `collective` pour l’organisation principale, et `organisers` pour les co-organisations.

---

## Dates et horaires

### Début / fin (obligatoires)

- **start_at** *(obligatoire)* : date/heure de début
- **end_at** *(obligatoire)* : date/heure de fin

### Journée entière

- **all_day** *(optionnel)* : cochez si l’événement dure toute la journée

> Conseil : même si `all_day` est activé, gardez des dates cohérentes (début/fin le même jour ou sur la période attendue).

---

## Lieu (optionnel)

- **location** : nom court du lieu (ex : “ENS, Salle des Actes”)
- **location_address** : adresse plus détaillée (ex : rue, code postal, ville)

---

## Traductions (obligatoire)

- **translations** *(obligatoire)* : contenu multilingue de l’événement  
  Par défaut, le français (`fr-FR`) est la langue principale dans l’interface.

Vous y trouverez typiquement le **titre** et le **contenu** (selon ce qui a été configuré dans le modèle).

---

## Articles associés (optionnel)

- **articles** *(optionnel, M2M)* : permet de relier un ou plusieurs articles à l’événement  
  Utile pour :
  - ajouter un lien “En savoir plus” vers un article
  - centraliser les contenus éditoriaux liés à l’événement (annonce, compte-rendu…)

---

## Champs techniques (automatiques)

Ces champs sont gérés par Directus (création / mise à jour) :

- **user_created** : créateur de l’item (visible)
- **date_created** *(caché)* : date de création
- **user_updated** *(caché)* : dernier éditeur
- **date_updated** *(caché)* : date de dernière mise à jour

---

## Procédure recommandée (création)

1. **Contenu → events → Créer**
2. Renseigner :
   - `collective` (organisation porteuse)
   - `organisers` (au moins l’org principale + co-organisateurs si besoin)
   - `start_at` / `end_at`
   - `all_day` si nécessaire
   - `location` / `location_address` si pertinent
   - `translations` (au moins FR)
3. Lier éventuellement :
   - `articles` (annonce, infos pratiques, compte-rendu…)
4. Laisser en `draft`, puis passer en `published` une fois validé

---

## Dépannage rapide

### “Je ne vois pas mon événement sur le site”
- Vérifiez `status = published`
- Vérifiez que les champs obligatoires sont bien renseignés (`collective`, `organisers`, `start_at`, `end_at`, `translations`)
- Vérifiez que vous regardez la bonne période (calendrier / filtres)

### “Je ne peux pas sélectionner une organisation dans organisers”
- Selon votre rôle, les permissions peuvent limiter la liste d’organisations visibles/sélectionnables
- Contactez un admin si une org manque dans la liste

### “Mon événement n’apparaît pas au bon endroit dans le calendrier”
- Vérifiez `start_at` / `end_at` (timezone, jour/heure, inversion début/fin)
- Si `all_day` est activé, vérifiez que les dates correspondent à une journée complète
