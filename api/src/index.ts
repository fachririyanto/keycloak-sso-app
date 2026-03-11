import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { accountRouter } from "./router/account";

const app = new Elysia()
  .use(cors())
  .get("/health", () => ({ status: "healthy" }))
  .use(accountRouter)
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
