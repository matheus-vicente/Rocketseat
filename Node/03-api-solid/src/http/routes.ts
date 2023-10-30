import { app } from "@/app";

import { register } from "./controllers/register";

export async function appRoutes(): Promise<void> {
  app.post("/users", register);
}
