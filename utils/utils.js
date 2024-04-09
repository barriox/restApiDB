import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export const readJSON = (path) => require(path);

/*
import fs from "node:fs";
export const readJSON = (path) => JSON.parse(fs.readFileSync(path));
*/
