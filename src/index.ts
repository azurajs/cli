import { Command } from "commander";
import prompts from "prompts";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import kleur from "kleur";

const program = new Command();

program.name("azurajs").description("⚙️ CLI from azurajs - the best framework").version("1.0.0");
program
  .command("create <name>")
  .description("Create new project")
  .action(async (name) => {
    const response = await prompts([
      {
        type: "select",
        name: "language",
        message: "Choise the language",
        choices: [
          { title: "Typescript", value: "ts" },
          { title: "Javascript", value: "js" },
        ],
      },
      {
        type: "confirm",
        name: "install",
        message: "Install dependencies?",
        initial: true,
      },
    ]);

    const targetDir = path.resolve(process.cwd(), name);
    const templateDir = path.resolve(
      new URL(import.meta.url).pathname,
      "../../templates/",
      response.language
    );

    fs.mkdirSync(targetDir, { recursive: true });
    fs.cpSync(templateDir, targetDir, { recursive: true });

    console.log(kleur.green(`✅ Project created successfully!`));

    if (response.install) {
      console.log(kleur.cyan("📦 Instalando dependências..."));
      execSync("npm install", { cwd: targetDir, stdio: "inherit" });
    }

    console.log(kleur.bold("\n🚀 Done! Let's start the project"));
    console.log(`cd ${name}`);
    console.log("npm run dev");
  });

program.parse();
