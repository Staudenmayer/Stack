import log from "./log";
import { createClient } from "redis";

const cache = createClient();

cache.on("error", (err) => {
  log.critical(err);
  console.error(err);
});

cache.connect();

export { cache };
