use crate::prompt::prompt_user;
use crate::{log_error, log_info, log_success};
use indicatif::{ProgressBar, ProgressStyle};
use serde_json::Value;
use std::fs;
use std::path::Path;
use std::process::Command;
use std::time::Duration;

pub async fn run() {
    let config = prompt_user();
    create_project(&config.name, &config.language).await;
}

async fn create_project(project_name: &str, language: &str) {
    let root = Path::new(project_name);
    let is_ts = language == "ts";
    let ext = if is_ts { "ts" } else { "js" };

    if root.exists() {
        log_error(&format!("Folder \"{}\" already exists", project_name));
        return;
    }

    log_info("Creating ExpressKit project");

    // Scaffolding
    let user_dirs = vec![
        "src/config",
        "src/controllers",
        "src/services",
        "src/middleware",
        "src/models",
        "src/utils",
        "src/routes/health",
    ];
    let framework_dirs = vec![".expresskit/error_handling"];

    fs::create_dir_all(root).unwrap();
    for dir in user_dirs.iter().chain(framework_dirs.iter()) {
        fs::create_dir_all(root.join(dir)).unwrap();
    }

    log_info("Generating internal systems...");

    // Generate Config System
    fs::write(
        root.join(format!("src/config/expresskit.config.{}", ext)),
        include_str!("templates/expresskit.config.ts"),
    )
    .unwrap();
    fs::write(
        root.join(format!("src/config/expresskit.bridge.{}", ext)),
        include_str!("templates/expresskit.bridge.ts"),
    )
    .unwrap();

    // Generate Route System
    fs::write(
        root.join(format!(".expresskit/route_loader.{}", ext)),
        include_str!("templates/route_loader.ts"),
    )
    .unwrap();
    fs::write(
        root.join(format!(".expresskit/default_route.{}", ext)),
        include_str!("templates/default_route.ts"),
    )
    .unwrap();

    // Generate Error System
    fs::write(
        root.join(format!(".expresskit/error_handling/AppError.{}", ext)),
        include_str!("templates/AppError.ts"),
    )
    .unwrap();
    fs::write(
        root.join(format!(".expresskit/error_handling/catchAsync.{}", ext)),
        include_str!("templates/catchAsync.ts"),
    )
    .unwrap();
    fs::write(
        root.join(format!(".expresskit/error_handling/handler.{}", ext)),
        include_str!("templates/handler.ts"),
    )
    .unwrap();

    // Generate Core System
    fs::write(
        root.join(format!("src/app.{}", ext)),
        include_str!("templates/app.ts"),
    )
    .unwrap();
    fs::write(
        root.join(format!("src/server.{}", ext)),
        include_str!("templates/server.ts"),
    )
    .unwrap();

    // Generate Example System
    fs::write(
        root.join(format!("src/controllers/health_controller.{}", ext)),
        include_str!("templates/health_controller.ts"),
    )
    .unwrap();
    fs::write(
        root.join(format!("src/services/health_service.{}", ext)),
        include_str!("templates/health_service.ts"),
    )
    .unwrap();
    fs::write(
        root.join(format!("src/middleware/health_middleware.{}", ext)),
        include_str!("templates/health_middleware.ts"),
    )
    .unwrap();
    fs::write(
        root.join(format!("src/routes/health/route.{}", ext)),
        include_str!("templates/health_route.ts"),
    )
    .unwrap();

    // ReadMe
    fs::write(
        root.join("README.md"),
        include_str!("templates/README.md"),
    )
    .unwrap();

    // Dotfiles
    fs::write(root.join(".env"), "PORT=5000\n").unwrap();
    fs::write(root.join(".env.example"), "PORT=5000\n").unwrap();
    
    let ignore_rules = [
        "# Dependencies",
        "node_modules/",
        "",
        "# Build output",
        "dist/",
        "",
        "# Environment",
        ".env",
        ".env.*",
        "!.env.example",
        "",
        "# ExpressKit internals",
        ".expresskit/",
        "",
    ].join("\n");
    fs::write(root.join(".gitignore"), ignore_rules).unwrap();

    log_info("Installing dependencies");

    let spinner = ProgressBar::new_spinner();
    spinner.set_style(
        ProgressStyle::default_spinner()
            .tick_chars("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏")
            .template("{spinner:.green} {msg}")
            .unwrap(),
    );
    spinner.enable_steady_tick(Duration::from_millis(80));
    spinner.set_message("Installing packages...");

    // Git Init
    Command::new("git")
        .arg("init")
        .current_dir(root)
        .output()
        .expect("Failed to initialize git");

    // NPM Init
    Command::new("npm")
        .args(["init", "-y"])
        .current_dir(root)
        .output()
        .expect("Failed to npm init");

    // Modify package.json
    let pkg_path = root.join("package.json");
    let pkg_content = fs::read_to_string(&pkg_path).unwrap();
    let mut pkg: Value = serde_json::from_str(&pkg_content).unwrap();

    if let Some(scripts) = pkg.get_mut("scripts").and_then(|s| s.as_object_mut()) {
        scripts.insert(
            "dev".to_string(),
            Value::String(if is_ts {
                "nodemon src/server.ts".to_string()
            } else {
                "nodemon src/server.js".to_string()
            }),
        );
        scripts.insert(
            "start".to_string(),
            Value::String(if is_ts {
                "node dist/server.js".to_string()
            } else {
                "node src/server.js".to_string()
            }),
        );
        scripts.insert(
            "postinstall".to_string(),
            Value::String("npx @pd241008/expresskit sync".to_string()),
        );
        if is_ts {
            scripts.insert("build".to_string(), Value::String("tsc".to_string()));
        }
    }
    fs::write(&pkg_path, serde_json::to_string_pretty(&pkg).unwrap()).unwrap();

    // Install Dependencies
    Command::new("npm")
        .args([
            "install",
            "express",
            "cors",
            "dotenv",
            "morgan",
            "zod",
            "--no-fund",
            "--no-audit",
        ])
        .current_dir(root)
        .output()
        .expect("Failed to install dependencies");

    Command::new("npm")
        .args(["install", "-D", "nodemon", "--no-fund", "--no-audit"])
        .current_dir(root)
        .output()
        .expect("Failed to install dev dependencies");

    if is_ts {
        Command::new("npm")
            .args([
                "install",
                "-D",
                "typescript",
                "ts-node",
                "@types/node",
                "@types/express",
                "@types/cors",
                "@types/morgan",
                "--no-fund",
                "--no-audit",
            ])
            .current_dir(root)
            .output()
            .expect("Failed to install TS dependencies");

        let tsconfig = serde_json::json!({
            "compilerOptions": {
                "target": "ES2020",
                "module": "CommonJS",
                "rootDir": ".",
                "outDir": "dist",
                "strict": true,
                "esModuleInterop": true
            },
            "include": ["src/**/*", ".expresskit/**/*"]
        });
        fs::write(
            root.join("tsconfig.json"),
            serde_json::to_string_pretty(&tsconfig).unwrap(),
        )
        .unwrap();
    }

    spinner.finish_and_clear();
    log_success("Dependencies installed & Git initialized");
    println!("\n✅ ExpressKit ready. Magic enabled ✨\n");
}
