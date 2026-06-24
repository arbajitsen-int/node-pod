#!/usr/bin/env node

import path from "path";
import fs from "fs-extra";
import { execa } from "execa";

async function main() {
    const projectName = process.argv[2];

    if (!projectName) {
        console.log("Please provide a project name.");
        console.log("Example:");
        console.log("node-forge my-api");
        process.exit(1);
    }

    const targetDir = path.join(process.cwd(), projectName);
    const templateDir = path.join(__dirname, "../templates/node-ts");

    // Check if project already exists
    if (fs.existsSync(targetDir)) {
        console.error(
            `Directory "${projectName}" already exists.`
        );
        process.exit(1);
    }

    console.log(`Creating project: ${projectName}`);

    // Copy template
    fs.copySync(templateDir, targetDir);

    // Rename _gitignore -> .gitignore
    const gitignoreSource = path.join(
        targetDir,
        "_gitignore"
    );
    // Rename _env.example -> .env.example
    const envExampleSource = path.join(
        targetDir,
        "_env.example"
    );
    // Rename _eslintrc.json -> .eslintrc.json
    const eslintrcSource = path.join(
        targetDir,
        "_eslintrc.json"
    );
    // Rename _prettierrc -> .prettierrc
    const prettierrcSource = path.join(
        targetDir,
        "_prettierrc"
    );

    if (fs.existsSync(gitignoreSource)) {
        fs.renameSync(
            gitignoreSource,
            path.join(targetDir, ".gitignore")
        );
    }
    if (fs.existsSync(envExampleSource)) {
        fs.renameSync(
            envExampleSource,
            path.join(targetDir, ".env.example")
        );
    }
    if (fs.existsSync(eslintrcSource)) {
        fs.renameSync(
            eslintrcSource,
            path.join(targetDir, ".eslintrc.json")
        );
    }
    if (fs.existsSync(prettierrcSource)) {
        fs.renameSync(
            prettierrcSource,
            path.join(targetDir, ".prettierrc")
        );
    }

    console.log("Installing dependencies...");

    // Runtime dependencies
    await execa(
        "npm",
        [
            "install",
            "express",
            "cors",
            "dotenv",
            "cookie-parser",
            "helmet",
            "winston",
            "winston-daily-rotate-file"
        ],
        {
            cwd: targetDir,
            stdio: "inherit"
        }
    );

    console.log("Installing dev dependencies...");

    // Dev dependencies
    await execa(
        "npm",
        [
            "install",
            "-D",
            "typescript",
            "ts-node",
            "nodemon",
            "eslint",
            "prettier",
            "husky",
            "lint-staged",
            "@types/node",
            "@types/express",
            "@types/cors",
            "@types/cookie-parser"
        ],
        {
            cwd: targetDir,
            stdio: "inherit"
        }
    );

    console.log("Initializing git repository...");

    await execa("git", ["init"], {
        cwd: targetDir,
        stdio: "inherit"
    });

    console.log("");
    console.log("Project created successfully!");
    console.log("");
    console.log(`Next steps:`);
    console.log(`cd ${projectName}`);
    console.log(`npm run dev`);
}

main().catch((error) => {
    console.error("Error creating project:");
    console.error(error);
    process.exit(1);
});