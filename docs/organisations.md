---
layout: default
title: Organisation (Collective)
description: Créer et gérer une organisation dans Directus : identité, contacts, type, organisateurs, réseaux sociaux et publication.
nav_order: 3
---

Une **Organisation** (collection `collectives`) représente un groupe/collectif associé à ConvergENS.  
Elle sert à afficher une identité publique (nom, logo, couleur, description), des informations de contact, et à relier des personnes (organizers) ainsi que des éléments associés (articles, réseaux sociaux).

> **Pourquoi “collective” ?**  
> La collection s’appelle `collectives` parce que c’est le nom que j’ai choisi au tout début du projet.  
> Aujourd’hui, même si on parle plutôt “d’organisation” dans l’interface, je garde ce nom en base pour éviter une migration/renommage inutile (et les risques qui vont avec).

## Où trouver les organisations ?

Dans Directus : **Contenu → collectives**.

Selon votre rôle, vous verrez soit toutes les organisations, soit uniquement celles auxquelles vous avez accès.

---

## Champs principaux

### Statut

- **status** _(obligatoire)_ : `published` / `draft` / `archived`

Bon réflexe :

- laissez en **draft** tant que l’organisation n’est pas prête
- passez en **published** quand elle doit apparaître sur le site
- utilisez **archived** pour retirer une organisation sans la supprimer

---

## Identité de l’organisation

### Nom

- **name** _(obligatoire)_ : nom affiché publiquement

### Slug (lien)

- **slug** _(obligatoire)_ : identifiant lisible utilisé dans les URLs  
  Il est généré à partir de `name` (extension type “slug”).

> Conseil : évitez de modifier le `slug` après publication (cela peut casser des liens).

### Logo

- **logo** _(obligatoire)_ : image (fichier)  
  Le fichier est enregistré dans le dossier configuré pour les logos.

> Conseil : privilégiez une image carrée, lisible en petit format.

### Couleur

- **color** _(obligatoire)_ : couleur associée à l’organisation  
  Elle peut être utilisée pour l’identité visuelle sur le site (badges, accents, etc.).

### Type d’organisation

- **type** _(obligatoire)_ : relation vers `collective_type`  
  Dans Directus, vous choisissez un type existant (création désactivée).

---

## Traductions (contenu multilingue)

- **translations** _(obligatoire)_ : contenu traduit de l’organisation  
  Interface “Translations”, avec français par défaut (`fr-FR`).

Vous y trouverez les champs textuels traduits (ex : nom public, description, etc. — selon le modèle configuré).

> Astuce : si vous ne renseignez pas une langue, le site peut afficher un fallback selon sa logique (souvent FR).

---

## Coordonnées (optionnel)

Ces champs sont facultatifs mais recommandés pour permettre le contact :

- **email**
- **phone**
- **website**

---

## Relations (liens avec d’autres contenus)

### Organizers (personnes liées à l’organisation)

- **organizers** _(obligatoire)_ : relation **M2M**  
  Permet d’associer des utilisateurs/organisateurs à l’organisation.

Selon la configuration des droits, cette relation peut aussi contrôler :

- qui peut voir/modifier l’organisation
- quelles organisations un utilisateur peut sélectionner ailleurs (ex : événements)

### Réseaux sociaux

- **socials** _(optionnel)_ : relation **M2M**  
  Chaque entrée est généralement un couple “type” + “URL”.

Dans la liste, l’affichage suit le template :  
`TYPE URL : https://...`

> Conseil : ajoutez uniquement des liens officiels et vérifiez qu’ils sont publics.

### Articles

- **articles** : relation **O2M** (masquée dans l’interface)  
  Ce champ est **hidden** dans Directus : vous ne l’éditez pas ici.

En pratique, les articles liés à une organisation sont généralement gérés depuis la collection `articles` (ex : via une relation “editors” ou équivalent).

---

## Champs techniques (automatiques)

Ces champs sont gérés par Directus et sont **cachés** :

- **id** : identifiant interne
- **user_created**, **date_created**
- **user_updated**, **date_updated**

---

## Procédure recommandée (création / mise à jour)

1. **Contenu → collectives → Créer**
2. Renseigner :
   - `name`
   - `slug` (généré, à vérifier)
   - `logo`
   - `color`
   - `type`
3. Compléter :
   - `translations` (au moins FR)
   - `email` / `website` (si disponible)
   - `socials` (si applicable)
   - `organizers` (ajouter les personnes concernées)
4. Mettre `status` en :
   - `draft` tant que ce n’est pas prêt
   - puis `published` une fois validé

---

## Dépannage rapide

### “Je ne vois pas mon organisation”

- Vérifiez que vous êtes dans **Contenu → collectives**
- Vérifiez qu’un **filtre** n’est pas actif
- Selon votre rôle, il est possible que vous ne puissiez voir **que** certaines organisations (permissions/policies)

### “Je ne peux pas sélectionner une personne dans organizers”

- Cela dépend des droits sur les utilisateurs / sur la table de jonction M2M
- Contactez un admin si l’utilisateur n’apparaît pas dans la liste

### “Le logo est flou / mal cadré”

- Essayez une image plus grande, idéalement carrée
- Évitez les logos trop détaillés (ils deviennent illisibles en petit)

### “Le lien du site ne marche pas”

- Vérifiez que `website` commence bien par `https://`

# Organisations: How to update your organisations
