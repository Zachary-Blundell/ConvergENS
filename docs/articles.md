---
layout: default
title: Articles
nav_order: 4
---

# Articles (Directus) — Guide de saisie pour les organisateur·ices

Cette page explique **quoi remplir**, **dans quel ordre**, et **à quoi servent** les champs d’un **Article** dans le CMS Directus.

<!-- prettier-ignore-start -->
- TOC
{:toc}
<!-- prettier-ignore-end -->

---

## ⚠️ Important (changement de modèle à venir)

- Le champ **Collective** va être **supprimé** dans une prochaine version.
- À terme, on utilisera **uniquement “Editors”** pour gérer les organisations liées à un article.

👉 **Dès maintenant**, considérez **Editors** comme le champ de référence.

---

## Règles d’accès et d’édition (à retenir)

### Editors = organisations qui peuvent modifier l’article

- **Editors doit contenir au moins 1 organisation.**
- **Toute organisation ajoutée à Editors pourra modifier l’article** (droits d’édition).

### L’organisation créatrice garde toujours l’accès

- L’organisation qui **crée** un article **aura toujours accès à l’article**, **même si elle est retirée** de la liste **Editors** par la suite.
- Donc : retirer une organisation des Editors **n’enlève pas** forcément l’accès si c’est l’organisation créatrice.

---

## Langues (Translations)

- **Le français est obligatoire.**
- **L’anglais est fortement recommandé.**
- L’interface **ouvre et privilégie le français par défaut** (UI default = FR), donc pensez à :
  - compléter **FR** en premier,
  - puis ajouter / compléter **EN** si possible.

---

## Vue d’ensemble : les champs que vous allez utiliser

### Champs principaux (à remplir)

- **Status** _(statut de publication)_
- **Published At** _(date/heure de publication)_
- **Tag** _(catégorie)_
- **Editors** _(organisations associées / co-édition + droits de modification)_
- **Cover** _(image de couverture)_
- **Translations** _(FR obligatoire, EN recommandé)_
- **Events** _(facultatif : événements liés)_

### Champ en cours de retrait

- **Collective** _(sera retiré dans une prochaine version — ignorez si possible)_

### Champs automatiques (vous n’y touchez pas)

- **ID**
- **User Created / Date Created**
- **User Updated / Date Updated**

---

## Workflow recommandé (ordre de remplissage)

1. **Editors** (au moins 1 organisation — la/les orga(s) qui doivent pouvoir modifier)
2. **Tag** (catégorie)
3. **Cover** (image)
4. **Translations**
   - FR (obligatoire)
   - EN (recommandé)
5. **Published At** (date/heure)
6. **Status** → passer à **Published** quand tout est prêt
7. _(optionnel)_ **Events** (lier l’article à un ou plusieurs événements)

> **Note sur “Collective” :** si le champ existe encore dans votre interface, remplissez-le si le système l’exige, mais il sera retiré prochainement.

## Astuce : enregistrer même si un champ obligatoire bloque

Si vous voulez **sauvegarder votre travail** mais qu’un **champ obligatoire** vous empêche d’enregistrer (par exemple une image, un tag, ou un éditeur), vous pouvez :

1. Mettre **une valeur provisoire** (n’importe laquelle) dans le champ bloquant
2. Vérifier que **Status = `draft`** (brouillon)
3. Sauvegarder, puis revenir plus tard pour remplacer la valeur provisoire par la bonne

> Important : laissez l’article en **draft** tant que les champs obligatoires ne sont pas correctement remplis.

---

## Détail champ par champ

### Editors (organisations éditrices)

**Où :** champ “Editors”  
**Obligatoire :** ✅ Oui (au moins 1)  
**Rôle :**

- Liste des organisations associées à l’article.
- **Contrôle l’accès en modification** : toute organisation ajoutée ici pourra **éditer** l’article.
- **Affichage sur le site :**
  - Sur la page **“Tous les articles”** (cartes / _article cards_), on affiche :
    - les **3 premières** organisations de la liste **Editors** et le **nom de la première organisation** ajoutée (comme organisation principale affichée sur la carte)
    - ![Lots of editors in ui](assets/images/Lots_of_editors.jpg)
    - ![Two editors in ui](assets/images/two_editors.jpg)
  - Sur la **page de l’article**, **toutes** les organisations de **Editors** seront affichées.

**Règles :**

- Il doit y avoir **au moins une organisation** dans Editors.
- Ajouter une organisation = lui donner l’accès en édition.
- L’organisation qui a créé l’article conserve l’accès même si elle est retirée des Editors.

**Conseils :**

- Mettez votre organisation en **première** dans Editors si vous voulez qu’elle apparaisse comme principale sur la carte.
- Gardez la liste **Editors** propre et dans le bon ordre (surtout les 3 premières).
- Ajoutez les co-organisateurs / partenaires qui doivent pouvoir contribuer au texte.

---

# Needs review zz

## Tag (catégorie)

**Où :** champ “Tag” (liste déroulante)  
**Obligatoire :** ✅ Oui  
**Comment choisir :**

- Sélectionnez une catégorie parmi celles proposées.
- Vous ne pouvez pas créer un tag depuis l’article (création désactivée).

---

## Cover (image de couverture)

**Où :** champ “Cover”  
**Obligatoire :** ✅ Oui  
**Rôle :**

- Image affichée sur la carte article et/ou en en-tête de page.

**Bonnes pratiques :**

- Image lisible (mobile-friendly), plutôt en **paysage**.
- Éviter le texte trop petit incrusté dans l’image.

---

## Translations (FR obligatoire, EN recommandé)

**Où :** champ “Translations”  
**Obligatoire :** ✅ Oui (FR)  
**Rôle :**

- Contenu multilingue (au minimum **Title** + **Body**).

**Règles :**

- **FR est nécessaire** (c’est la base).
- **EN est fortement recommandé** (si vous avez le temps, faites-le).
- L’UI **par défaut** est en français : assurez-vous de bien remplir l’onglet FR.

**Conseils :**

- **Title** : clair + informatif.
- **Body** : texte aéré (paragraphes, intertitres, listes, liens).

---

## Published At (date/heure de publication)

**Où :** champ “Published At”  
**Rôle :**

- Définit la date affichée et/ou l’ordre de tri des articles.

**Conseils :**

- Publication immédiate : mettez la date/heure actuelle.
- Publication planifiée : date future (selon le comportement du site).

---

## Status (statut)

**Où :** champ “Status”  
**Options :**

- **draft** : brouillon (non visible publiquement)
- **published** : publié (visible sur le site)
- **archived** : retiré du site, conservé en interne

**Bon usage :**

- Restez en **draft** tant que FR (et idéalement EN) n’est pas prêt + cover + tag.
- Passez en **published** seulement après relecture.

---

## Events (événements liés) — optionnel

**Où :** champ “Events” (liste M2M)  
**Obligatoire :** ❌ Non  
**Rôle :**

- Relier l’article à un ou plusieurs événements (annonce, compte-rendu, etc.).

---

## Champ “Collective” (en cours de suppression)

**Statut :** ⚠️ sera retiré dans une future version  
**Consigne :**

- Si vous le voyez encore, remplissez-le uniquement si le CMS vous l’impose.
- Sinon : **ignorez-le** et utilisez **Editors**.

---

## Checklist avant publication ✅

Avant de passer **Status → Published**, vérifiez :

- [ ] **Editors** contient au moins 1 organisation (et les bonnes)
- [ ] **Tag** est choisi
- [ ] **Cover** est ajoutée et correcte
- [ ] **FR** (Translations) : titre + contenu complets
- [ ] **EN** (Translations) : ajouté si possible (fortement recommandé)
- [ ] **Published At** est cohérent
- [ ] _(optionnel)_ **Events** liés si pertinent

---

## Dépannage rapide

### “Une organisation doit pouvoir modifier l’article”

➡️ Ajoutez-la dans **Editors**.

### “Je veux retirer l’accès en modification à une organisation”

➡️ Retirez-la de **Editors** (sauf si c’est l’organisation créatrice : elle gardera l’accès).

### “Mon article n’apparaît pas sur le site”

- Vérifiez **Status = published**
- Vérifiez **Published At** (pas une date future si le site filtre)
- Vérifiez que **Cover + Tag + FR** sont bien remplis

---

```

```
