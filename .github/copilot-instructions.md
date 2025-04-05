The Urlist

An application for sharing list of links with a URL.

Technologies used...

- Astro
- Preact
- Nanostores
- Tailwind CSS
- Postgres
- Drizzle ORM

Make sure all terminal commands work in Powershell.

Astro, Preact, Nanostores and Tailwind CSS are already installed.

Remember to always use Preact. Do not use React.

# 🏗 Vite / React / Tailwind / Nanostores / Astro Best Practices

This guide outlines **best practices** for building a **Vite / React / Tailwind / Nanostores / Astro** application. The goal is **readability and maintainability**, minimizing abstraction to keep the codebase clear.

---

## 📁 Project Structure

Keep a **flat and predictable** folder structure:

```
/src
  /components  # Reusable UI components (buttons, inputs, cards, etc.)
  /pages       # Page components (mapped to routes)
  /stores      # Nanostores for state management
  /hooks       # Custom React hooks (if needed)
  /utils       # Simple utility functions (date formatting, API requests, etc.)
  /assets      # Static assets (images, icons, etc.)
  /styles      # Tailwind config and global CSS files (if any)
  main.tsx     # Entry point
  app.tsx      # Root component
  routes.tsx   # Centralized route definitions
```

📌 **Rules:**

- **Flat is better than nested.**
- **No generic 'helpers' folder.**
- **Keep components close to where they are used.**

---

## ⚛ React Component Best Practices

### ✅ When to Create a New Component

1. **If the JSX exceeds ~30 lines.**
2. **If the UI is used more than once.**
3. **If it has a clear single responsibility.**

```tsx
// ❌ BAD: Bloated file
export function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Click Me
      </button>
      <table>...</table>
    </div>
  );
}

// ✅ GOOD: Extracted components
export function Dashboard() {
  return (
    <div className="p-4">
      <Title>Dashboard</Title>
      <Button>Click Me</Button>
      <DataTable />
    </div>
  );
}
```

📌 **Rules:**

- **Keep components small and focused.**
- **Avoid abstraction unless it provides real value.**

---

## 🚀 Astro Best Practices

### ✅ Keep Astro Components Focused

- Use **.astro** files for page structure and layout.
- Prefer using **React for interactive components**.
- Keep **Astro pages clean**—avoid unnecessary logic.

```astro
---
import { Button } from '../components/Button.tsx';
---

<Layout>
  <h1 class="text-2xl font-bold">Welcome</h1>
  <Button>Click Me</Button>
</Layout>
```

📌 **Rules:**

- **Use `.astro` files for static content.**
- **Use React only when interactivity is needed.**
- **Keep logic out of `.astro` files when possible.**

---

## 🎨 Tailwind Best Practices

### ✅ Use Utility Classes Over Custom CSS

```tsx
// ✅ Prefer Tailwind utility classes
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="p-4 rounded-lg shadow-md bg-white">{children}</div>;
}
```

📌 **Rules:**

- **Avoid unnecessary `class` extractions.**
- **Use Tailwind’s built-in utilities.**

---

## 🏪 Nanostores Best Practices

### ✅ Keep Stores Small & Independent

```tsx
// src/stores/auth.ts
import { atom } from "nanostores";

export const user = atom<User | null>(null);
export const isAuthenticated = computed(user, (u) => !!u);
```

📌 **Rules:**

- **Use `atom` for simple state.**
- **Use `computed` for derived state.**
- **Keep stores independent.**

---

## 🌿 Hooks Best Practices

### ✅ Only Create Hooks for Reusable Logic

```tsx
// src/hooks/useFetch.ts
import { useEffect, useState } from "react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData);
  }, [url]);

  return data;
}
```

📌 **Rules:**

- **No "just in case" hooks.**
- **Keep hooks simple and focused.**

---

## 🛠 Development Workflow Best Practices

### ✅ Consistent Coding Style

- Use **ESLint + Prettier** to enforce formatting.
- Keep **imports organized**:

```tsx
import { useState } from "react"; // React first
import { user } from "@/stores/auth"; // Stores second
import { Button } from "@/components/Button"; // Components last
```

---

## 🔥 Final Thoughts

1. **Avoid over-engineering.** Keep it simple.
2. **Prioritize readability over cleverness.**
3. **Only abstract when it provides real value.**
4. **Keep state management minimal.**
5. **Use Tailwind properly—don’t fight it.**
6. **Use `.astro` files effectively—static content in `.astro`, interactivity in React.**

---

Here is an example of how to work with Drizzle ORM and PostgreSQL in a Vite / React / Tailwind / Nanostores / Astro application.

### Connect Drizzle ORM to the database

Create a `index.ts` file in the `src/db` directory and initialize the connection:

node-postgres

node-postgres with config

your node-postgres driver

```
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(process.env.DATABASE_URL!);
```

```
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

// You can specify any property from the node-postgres connection options
const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: true
  }
});
```

```
import 'dotenv/config';
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle({ client: pool });
```

#### Step 4 - Create a table

Create a `schema.ts` file in the `src/db` directory and declare your table:

```
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
```

#### Step 5 - Setup Drizzle config file

**Drizzle config** - a configuration file that is used by [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

```
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

#### Step 6 - Applying changes to the database

You can directly apply changes to your database using the `drizzle-kit push` command. This is a convenient method for quickly testing new schema designs or modifications in a local development environment, allowing for rapid iterations without the need to manage migration files:

```
npx drizzle-kit push
```

Read more about the push command in [documentation](https://orm.drizzle.team/docs/drizzle-kit-push).

Tips

Alternatively, you can generate migrations using the `drizzle-kit generate` command and then apply them using the `drizzle-kit migrate` command:

Generate migrations:

```
npx drizzle-kit generate
```

Apply migrations:

```
npx drizzle-kit migrate
```

Read more about migration process in [documentation](https://orm.drizzle.team/docs/kit-overview).

#### Step 7 - Seed and Query the database

Let’s **update** the `src/index.ts` file with queries to create, read, update, and delete users

```
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: '[email protected]',
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!')

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!')

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!')
}

main();
```
