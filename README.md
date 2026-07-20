# 🌱 ÉcoTransport

Plateforme communautaire de **mobilité durable** développée avec **Nuxt 4** et **Nuxt UI**.
Projet pédagogique ESGI.

Le site regroupe cinq services :

| Service | Description |
| --- | --- |
| 💬 **Forum** | Discussions par catégories, création de sujets et réponses |
| 🚗 **Covoiturage** | Publication de trajets en véhicule éco + **système de réservation** de places |
| 🎫 **Revente de billets** | Petites annonces de billets **train / avion** avec achat |
| 🏪 **Marché de véhicules éco** | Vente/achat de vélos, VAE, scooters, voitures électriques… et **attelages** (charrettes tirées par bœufs, ânes ou chevaux) |
| 🔧 **Bricolage** | Tutoriels de réparation/entretien avec commentaires |

Le tout avec **authentification** (inscription / connexion) et **base de données PostgreSQL**.

---

## 🚀 Démarrage rapide (Docker)

Une seule commande suffit — Docker construit l'application, lance PostgreSQL,
applique le schéma et insère des données de démonstration automatiquement :

```bash
docker compose up
```

Puis ouvrez **http://localhost:3000** 🎉

> Premier lancement : la construction de l'image prend quelques minutes.
> Pour reconstruire après une modification : `docker compose up --build`.

Pour tout arrêter :

```bash
docker compose down
```

Pour repartir d'une base vierge (supprime les données) :

```bash
docker compose down -v
```

### 👤 Comptes de démonstration

Des comptes sont créés automatiquement (mot de passe identique pour tous) :

| Email | Mot de passe |
| --- | --- |
| `alice@eco.fr` | `password123` |
| `bob@eco.fr` | `password123` |
| `chloe@eco.fr` | `password123` |
| `driss@eco.fr` | `password123` |

Vous pouvez aussi créer votre propre compte via **S'inscrire**.

---

## 🧱 Stack technique

- **[Nuxt 4](https://nuxt.com)** — framework Vue full-stack (SSR + API Nitro)
- **[Nuxt UI](https://ui.nuxt.com)** — bibliothèque de composants (Tailwind CSS v4)
- **[nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)** — sessions & hachage de mot de passe
- **[Drizzle ORM](https://orm.drizzle.team)** + **PostgreSQL** — persistance des données
- **[Zod](https://zod.dev)** — validation des entrées API
- **Docker / Docker Compose** — conteneurisation complète

---

## 🗂️ Structure du projet

```
.
├── app/                    # Front-end (Nuxt 4)
│   ├── components/         # AppHeader, AppFooter, SectionHeader
│   ├── composables/        # useAuth, useFormat
│   ├── middleware/         # auth.ts (protection des pages)
│   ├── pages/              # Routes : forum, covoiturage, billets, vehicules, bricolage…
│   └── utils/              # Catégories de véhicules
├── server/                 # Back-end (Nitro)
│   ├── api/                # Endpoints REST (auth, forum, carpool, tickets, vehicles, diy)
│   ├── database/           # Schéma Drizzle
│   ├── plugins/seed.ts     # Données de démonstration au démarrage
│   └── utils/              # Connexion DB + helpers auth
├── Dockerfile
├── docker-compose.yml
└── drizzle.config.ts
```

---

## 💻 Développement local (sans Docker pour l'app)

Prérequis : Node 22+.

1. Lancez uniquement la base de données :

   ```bash
   docker compose up db -d
   ```

2. Copiez la configuration d'environnement :

   ```bash
   cp .env.example .env
   ```

3. Installez les dépendances et appliquez le schéma :

   ```bash
   npm install
   npm run db:push
   ```

4. Démarrez le serveur de développement :

   ```bash
   npm run dev
   ```

   → http://localhost:3000 (les données de démo sont insérées au premier démarrage).

### Scripts utiles

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run db:push` | Applique le schéma Drizzle à la base |
| `npm run db:studio` | Interface web Drizzle Studio |

---

## 🔐 Sécurité & configuration

Les variables sensibles sont définies dans `docker-compose.yml` (et `.env` en local) :

- `DATABASE_URL` — chaîne de connexion PostgreSQL
- `NUXT_SESSION_PASSWORD` — secret (32 caractères min.) chiffrant les cookies de session

> ⚠️ En production, remplacez impérativement `NUXT_SESSION_PASSWORD` et le mot de passe PostgreSQL.
