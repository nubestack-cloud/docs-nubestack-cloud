// Keep familiar npm commands while Python and MkDocs own the documentation build.
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const local = join(root, ".venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python");
const python = process.env.PYTHON ?? (existsSync(local) ? local : "python3");
const result = spawnSync(python, ["-m", "mkdocs", ...process.argv.slice(2)], { cwd: root, stdio: "inherit" });
if (result.error) console.error(`Could not run MkDocs: ${result.error.message}. See README.md for Python setup.`);
process.exit(result.status ?? 1);
