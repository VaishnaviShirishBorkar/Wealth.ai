// import dotenv from "dotenv";
// dotenv.config();

// console.log("✅ ENV loaded");

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, ".env")
});

console.log("✅ ENV loaded from", path.resolve(__dirname, ".env"));
