import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ImportMap } from "@jspm/import-map";
import { parseArgs } from "./parseArgs";
import { argv } from "node:process";

/**
 * ******************************************************
 * CONFIG 🗺️
 * ------------------------------------------------------
 * @description utility variable assignment
 * @summary utility variables which are assigned 1x.
 * Assigning them here simplifies testability and later configuration if CLI functionality is added.
 *
 * ******************************************************
 */
const wd = process.cwd();
export const cacheMap = new Map();

// cli
export const { importmapPath, cachePath, rootDir, debugNodeImportmapLoader } = parseArgs({
  args: argv.slice(2),
  options: {
    debugNodeImportmapLoader: { alias: "d", type: "boolean", default: false },
    importmapPath: { alias: "i", type: "string", default: "importmap.json" },
    cachePath: { alias: "c", type: "string", default: ".jspm-cache" },
    rootDir: { alias: "r", type: "string", default: wd },
  },
});

// execution structure
export const root = fileURLToPath(`file://${rootDir}`);
export const nodeImportMapPath = join(root, importmapPath);
export const cache = join(root, cachePath);

const map = existsSync(nodeImportMapPath) ?
  JSON.parse(readFileSync(nodeImportMapPath, { encoding: "utf8" })) :
  {};

export const importmap = new ImportMap({ rootUrl: import.meta.url, map });
export const isDebuggingEnabled = Boolean(debugNodeImportmapLoader);
