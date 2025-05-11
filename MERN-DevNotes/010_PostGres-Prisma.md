# 🧠 Prisma + PostgreSQL Setup Guide (CodeVantage Project)

This guide covers the step-by-step process I followed to integrate **Prisma** ORM with a **PostgreSQL** database using **Docker** in my dream project — **CodeVantage** (a full-stack coding platform).

---

## 🛠️ Tech Stack Used

- **Node.js + Express** (Backend)
- **PostgreSQL** (Database)
- **Prisma** (Type-safe ORM)
- **Docker** (To run PostgreSQL container)

---

## 🔧 Setup Instructions

### 1. Initialize Prisma in your Node.js project

Install Prisma CLI and the client package:

```bash
npm install prisma --save-dev
npm install @prisma/client
```

### 2. Initialize Prisma configuration

```bash
npx prisma init
```

This creates a `prisma/` folder with `schema.prisma` and a `.env` file.

---

### 3. Run PostgreSQL using Docker

```bash
docker run --name codevantage -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -p 5432:5432 postgres
```

- This spins up a PostgreSQL container
- Exposes it on port `5432`
- Credentials: `myuser` / `mypassword`

Update your `.env`:

```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/postgres"
```

---

### 4. Define the Database Schema

Edit `prisma/schema.prisma` to model your DB. For example:

```prisma
enum UserRole {
  ADMIN
  USER
}

model User {
  id        String    @id @default(uuid())
  name      String?
  email     String    @unique
  image     String?
  role      UserRole  @default(USER)
  password  String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

---

### 5. Generate Prisma Client

```bash
npx prisma generate
```

---

### 6. Setup Prisma Client in Your App

Create a `libs/` folder inside `src/`, then add `db.js`:

```js
// src/libs/db.js
import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

---

### 7. Run Migrations & Push to DB

```bash
npx prisma migrate dev
npx prisma db push
```

- `migrate dev`: Creates migration files and applies them
- `db push`: Directly pushes schema changes (handy for dev)

---

## 📝 Notes

- You can check and introspect your DB via `npx prisma studio`
- Always re-run `generate` after modifying your schema
- Use `db` instance for querying in your route handlers
