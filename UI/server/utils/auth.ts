import { Lucia, TimeSpan } from "lucia";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { pool } from "./db";

import type { DatabaseUser } from "./db";

const adapter = new NodePostgresAdapter(pool, {
  user: "users",
  session: "session",
});

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(4, "w"),
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      username: attributes.username,
      googleid: attributes.googleid,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
  }
}
