// Lets Node (24+, which strips TypeScript types itself) load the portal's e2e helpers, whose
// relative imports leave out the ".ts" extension. Used as: node --import ./register.mjs take.ts
import { register } from "node:module";

register(
  "data:text/javascript," +
    encodeURIComponent(`
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    if (specifier.startsWith(".") && !/\\.[cm]?[jt]s$/.test(specifier)) return next(specifier + ".ts", context);
    throw error;
  }
}`),
);
