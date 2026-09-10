import { cp } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = process.cwd();
await cp(resolve(projectRoot, "hosting/root.htaccess"), resolve(projectRoot, "out/.htaccess"));
process.stdout.write("Client-host package prepared in out/ (static site, SMS handoff, no server form endpoint).\n");
