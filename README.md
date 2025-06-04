# KoktEllerGeitet (Eksamen Juni 2025)

En full-stack webapplikasjon for å ha oversikt over oppskrifter. Inkluderer hjemmelaget autentisering med sikker lagring av passord ved bruk av hashing og salting, og autorisering for å skille mellom admin-brukere og vanlige brukere.

## Dokumentasjon

- Backend: [/src](./src)
  - Logikk for oppskrifter: [/src/lib/recipes.ts](./src/lib/recipes.ts)
  - API-routes for frontend-kommunikasjon: [/src/routes](./src/routes)
- Frontend: [/web](./web)
  - Oversikt over oppskrifter: [/web/src/pages/Recipes/Recipes.tsx](./web/src/pages/Recipes/Recipes.tsx)
  - Visning av oppskrift: [/web/src/pages/RecipeView/RecipeView.tsx](./web/src/pages/RecipeView/RecipeView.tsx)
  - Redigering av oppskrift: [/web/src/pages/EditRecipe/EditRecipe.tsx](./web/src/pages/EditRecipe/EditRecipe.tsx)
  - Oppretting av oppskrift: [/web/src/pages/NewRecipe/NewRecipe.tsx](./web/src/pages/NewRecipe/NewRecipe.tsx)
  - Visning og redigering av profil: [/web/src/pages/Me/Me.tsx](./web/src/pages/Me/Me.tsx)
  - Innlogging: [/web/src/pages/Login/Login.tsx](./web/src/pages/Login/Login.tsx)
  - Registrering: [/web/src/pages/Register/Register.tsx](./web/src/pages/Register/Register.tsx)

## Kjøring (produksjon)

Her trenger du Docker installert.

```bash
# Klon repositoriet
$ git clone https://github.com/BluDood/KoktEllerGeitet
# Bygg og kjør Docker-filen
$ docker compose up --build -d
```

## Utvikling

Du trenger Node installert, nåverende LTS er 22.16

```bash
# Klon repositoriet
$ git clone https://github.com/BluDood/KoktEllerGeitet
# Installer node_modules, og start serveren i utviklings-modus
$ npm i
$ npm run dev
# Åpne en ny terminal
# Installer node_modules, og start nettsiden i utviklings-modus
$ cd web
$ npm i
$ npm run dev
```

## Kilder

- Deler av koden er basert på tidligere arbeid av meg, som inkluderer:
  - https://github.com/BluDood/LekseHjelp
  - https://github.com/BluDood/Bolgelengde
