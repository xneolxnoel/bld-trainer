// Lets `node --test` load the project's `.ts` sources, which use extensionless,
// bundler-style relative imports (e.g. `import { ... } from "./setups"`).
// Node's built-in type stripping handles the TypeScript syntax; it just won't
// guess the `.ts` extension, so we append it here. No build step or extra
// dependency required. Loaded via `node --import ./test/ts-loader.mjs`.
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !/\.[cm]?[jt]s$/.test(specifier)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        // Fall through to default resolution below.
      }
    }
    return nextResolve(specifier, context);
  },
});
