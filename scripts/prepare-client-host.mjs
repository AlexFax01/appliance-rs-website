import { cp, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const source = resolve(projectRoot, "hosting/php");
const destination = resolve(projectRoot, "out/api");

await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
process.stdout.write("Client-host package prepared in out/ (static site + api/contact.php).\n");
