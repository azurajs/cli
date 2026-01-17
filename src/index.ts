import { Command } from "commander";
import prompts from "prompts";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import kleur from "kleur";
import { fileURLToPath } from "url";

const program = new Command();
program.name("azurajs").description("⚙️ CLI from azurajs - the best framework").version("1.1.0");

program
  .command("create <name>")
  .description("Create new project")
  .action(async (name) => {
    const response = await prompts([
      {
        type: "select",
        name: "language",
        message: "Choice the language",
        choices: [
          { title: "Typescript", value: "ts" },
          { title: "Javascript", value: "js" },
        ],
        initial: 0,
      },
      {
        type: "multiselect",
        name: "linters",
        message: "Choose linters (use space to select)",
        choices: [
          { title: "ESLint", value: "eslint" },
          { title: "Prettier", value: "prettier" },
          { title: "XO", value: "xo" },
          { title: "Standard", value: "standard" },
          { title: "Biome", value: "biome" },
        ],
        hint: "- Space to select. Return to submit",
      },
      {
        type: "select",
        name: "pkgManager",
        message: "Choose package manager",
        choices: [
          { title: "npm", value: "npm" },
          { title: "pnpm", value: "pnpm" },
          { title: "yarn", value: "yarn" },
          { title: "bun", value: "bun" },
        ],
        initial: 0,
      },
      {
        type: "confirm",
        name: "install",
        message: "Install dependencies?",
        initial: true,
      },
    ]);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const targetDir = path.resolve(process.cwd(), name);
    const candidatePaths = [
      path.join(__dirname, "templates", response.language),
      path.join(__dirname, "..", "templates", response.language),
      path.join(process.cwd(), "src", "templates", response.language),
      path.join(process.cwd(), "templates", response.language),
      path.join(process.cwd(), "src", "templates", response.language, "src"),
      path.join(process.cwd(), "templates", response.language, "src"),
    ];

    let templateDir: string | null = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        templateDir = p;
        break;
      }
    }

    fs.mkdirSync(targetDir, { recursive: true });

    function copyRecursive(src: string, dest: string) {
      const st = fs.statSync(src);
      if (st.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const child of fs.readdirSync(src)) {
          copyRecursive(path.join(src, child), path.join(dest, child));
        }
      } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
      }
    }

    if (templateDir) {
      const stat = fs.statSync(templateDir);
      const destBase =
        path.basename(templateDir).toLowerCase() === "src"
          ? path.join(targetDir, "src")
          : targetDir;
      if (stat.isDirectory()) {
        const entries = fs.readdirSync(templateDir);
        for (const entry of entries) {
          const srcPath = path.join(templateDir, entry);
          const destPath = path.join(destBase, entry);
          try {
            fs.cpSync(srcPath, destPath, { recursive: true, force: true });
          } catch {
            try {
              copyRecursive(srcPath, destPath);
            } catch {}
          }
        }
      }
    }

    const basePackage: any = {
      name,
      private: true,
      version: "1.0.0",
      scripts: {
        dev: response.language === "ts" ? "ts-node src/main.ts" : "node src/main.js",
      },
      dependencies: {
        azurajs: "latest",
      },
      devDependencies: {},
    };

    if (response.language === "ts") {
      basePackage.devDependencies.typescript = "^5.3.0";
      basePackage.devDependencies["ts-node"] = "^10.9.2";
    }

    const linterConfigs: Record<
      string,
      {
        devDeps: Record<string, string>;
        scripts: Record<string, string>;
        files?: Record<string, string>;
      }
    > = {
      eslint: {
        devDeps: {
          eslint: "^8.0.0",
          "@typescript-eslint/parser": "^5.0.0",
          "@typescript-eslint/eslint-plugin": "^5.0.0",
        },
        scripts: {
          lint: "eslint . --ext .js,.ts",
        },
        files: {
          ".eslintrc.json": JSON.stringify(
            response.language === "ts"
              ? {
                  root: true,
                  env: { node: true, es2021: true },
                  parser: "@typescript-eslint/parser",
                  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
                  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
                  rules: {},
                }
              : {
                  root: true,
                  env: { node: true, es2021: true },
                  extends: ["eslint:recommended"],
                  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
                  rules: {},
                },
            null,
            2,
          ),
        },
      },
      prettier: {
        devDeps: {
          prettier: "^2.0.0",
        },
        scripts: {
          format: "prettier --write .",
          "format:check": "prettier --check .",
        },
        files: {
          ".prettierrc": JSON.stringify({ semi: true, singleQuote: true }, null, 2),
        },
      },
      xo: {
        devDeps: {
          xo: "^0.50.0",
        },
        scripts: {
          lint: "xo",
        },
        files: {
          ".xo-config.json": JSON.stringify(
            response.language === "ts"
              ? { space: true, reporter: "stylish", esnext: true, typescript: true }
              : { space: true, reporter: "stylish", esnext: true },
            null,
            2,
          ),
        },
      },
      standard: {
        devDeps: {
          standard: "^17.0.0",
        },
        scripts: {
          lint: "standard --verbose",
        },
        files: {},
      },
      biome: {
        devDeps: {
          biome: "^1.0.0",
        },
        scripts: {
          lint: "biome check",
          "format:check": "biome check",
          format: "biome format",
        },
        files: {
          "biome.config.json": JSON.stringify(
            {
              files: ["src/**/*.{js,ts,tsx,jsx}"],
              lint: { language: response.language === "ts" ? "typescript" : "javascript" },
            },
            null,
            2,
          ),
        },
      },
    };

    const chosenLinters: string[] = Array.isArray(response.linters) ? response.linters : [];

    const mergedScripts: Record<string, string> = { ...basePackage.scripts };

    const perLinterPackages: Record<string, any> = {};

    for (const linter of chosenLinters) {
      const cfg = linterConfigs[linter];
      if (!cfg) continue;
      for (const [dep, ver] of Object.entries(cfg.devDeps)) {
        basePackage.devDependencies[dep] = ver;
      }
      for (const [scriptName, scriptCmd] of Object.entries(cfg.scripts)) {
        if (mergedScripts[scriptName]) {
          mergedScripts[scriptName] = `${mergedScripts[scriptName]} && ${scriptCmd}`;
        } else {
          mergedScripts[scriptName] = scriptCmd;
        }
      }
      const singlePkg = {
        name,
        private: true,
        version: "1.0.0",
        scripts: { dev: basePackage.scripts.dev, ...cfg.scripts },
        dependencies: basePackage.dependencies,
        devDependencies: cfg.devDeps,
      };
      perLinterPackages[linter] = singlePkg;
      if (cfg.files) {
        for (const [fileName, content] of Object.entries(cfg.files)) {
          fs.writeFileSync(path.join(targetDir, fileName), content, { encoding: "utf-8" });
        }
      }
    }

    basePackage.scripts = mergedScripts;

    const packageJsonPath = path.join(targetDir, "package.json");
    fs.writeFileSync(packageJsonPath, JSON.stringify(basePackage, null, 2), { encoding: "utf-8" });

    for (const [linter, pkgJson] of Object.entries(perLinterPackages)) {
      const filename = `package.${linter}.json`;
      fs.writeFileSync(path.join(targetDir, filename), JSON.stringify(pkgJson, null, 2), {
        encoding: "utf-8",
      });
    }

    if (response.language === "ts") {
      const tsconfig = {
        compilerOptions: {
          target: "ES2020",
          module: "ES2020",
          moduleResolution: "node",
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          strict: true,
          skipLibCheck: true,
        },
        include: ["src"],
      };
      fs.writeFileSync(path.join(targetDir, "tsconfig.json"), JSON.stringify(tsconfig, null, 2), {
        encoding: "utf-8",
      });
    }

    const boxTop = kleur.green().bold("==========================================");
    const title = kleur.cyan().bold("   AzuraJS — Project Generator");
    const nameLine = kleur.yellow().bold(`   Project: ${name}`);
    const langLine = kleur.magenta().bold(`   Language: ${response.language}`);
    const pmLine = kleur.blue().bold(`   Package Manager: ${response.pkgManager}`);
    const lintersLine = kleur
      .white()
      .bold(`   Linters: ${chosenLinters.length ? chosenLinters.join(", ") : "none"}`);
    console.log("");
    console.log(boxTop);
    console.log(title);
    console.log(nameLine);
    console.log(langLine);
    console.log(pmLine);
    console.log(lintersLine);
    console.log(boxTop);
    console.log("");

    if (response.install) {
      console.log(kleur.cyan("📦 Instalando dependências..."));
      try {
        const installCmd =
          response.pkgManager === "npm"
            ? "npm install"
            : response.pkgManager === "pnpm"
              ? "pnpm install"
              : response.pkgManager === "yarn"
                ? "yarn install"
                : "bun install";
        execSync(installCmd, { cwd: targetDir, stdio: "inherit" });
      } catch (e) {
        console.log(
          kleur.red(
            "⚠️ Falha ao instalar dependências automaticamente. Você pode rodar o comando manualmente.",
          ),
        );
      }
    }

    console.log(kleur.green("✅ Project created successfully!"));
    console.log("");
    console.log(kleur.bold("Next steps:"));
    console.log(kleur.white(`  ${kleur.gray("$")} ${kleur.green(`cd ${name}`)}`));
    const runCmd =
      response.pkgManager === "npm"
        ? "npm run dev"
        : response.pkgManager === "pnpm"
          ? "pnpm run dev"
          : response.pkgManager === "yarn"
            ? "yarn dev"
            : "bun run dev";
    console.log(kleur.white(`  ${kleur.gray("$")} ${kleur.green(runCmd)}`));
    console.log("");
    console.log(kleur.dim("Have fun building with AzuraJS ✨"));
  });

program.parse();
