Here's your **updated `README.md`** for the `carsense` project with Docker instructions and cleaned-up content.

---

````md
# 🚗 CarSense

This is a fullstack [Next.js](https://nextjs.org) app built using the **App Router**, **Server Actions**, **Clerk** for authentication, and **Supabase PostgreSQL** as the database.

Now with full **Docker support** 🐳 for production and local environments!

---

## 🚀 Getting Started (Local Development)

Install dependencies:

```bash
npm install
````

Run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Run with Docker (Production Build)

1. **Build the Docker image**:

```bash
docker build -t carsense \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key .
```

2. **Run the container**:

```bash
docker run -p 3000:3000 --env-file .env.local carsense
```

Then visit: [http://localhost:3000](http://localhost:3000)

---

## 🛠 Development Notes

* Edit the homepage at: `app/page.js`
* Dynamic routes like `/admin` use `export const dynamic = 'force-dynamic'` to support runtime headers
* Prisma client is auto-generated during Docker build (`prisma generate`)
* Clerk's public key is injected at **build time**, not runtime

---

## 📚 Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [Supabase Docs](https://supabase.com/docs)
* [Clerk Docs](https://clerk.dev/docs)
* [Prisma Docs](https://www.prisma.io/docs)

---

## ☁️ Deployment

This app can be deployed using:

* [Vercel](https://vercel.com/new)
* [Render](https://render.com)
* [Docker container hosting](https://docs.docker.com/get-started/)

Make sure to provide necessary environment variables such as:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=


NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/


NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

DATABASE_URL=

# Direct connection to the database. Used for migrations
DIRECT_URL=

ARCJET_KEY=

NODE_ENV=
GEMINI_API_KEY=
```

---

## 🧑‍💻 Author

Built with ❤️ for modern fullstack apps using Next.js, Clerk, Arcjet and Supabase.

```
