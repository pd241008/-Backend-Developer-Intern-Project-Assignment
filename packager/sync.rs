use crate::{log_error, log_info, log_success};
use std::env;
use std::fs;
use std::path::Path;

pub async fn run() {
    let root_dir = env::current_dir().unwrap();
    let root = root_dir.as_path();

    log_info("Checking for ExpressKit project...");

    if !root.join("package.json").exists() {
        log_error("No package.json found. Are you in the root of an ExpressKit project?");
        std::process::exit(1);
    }

    let is_ts = root.join("tsconfig.json").exists();
    let ext = if is_ts { "ts" } else { "js" };

    log_info(&format!(
        "Detected {} environment.",
        if is_ts { "TypeScript" } else { "JavaScript" }
    ));
    log_info("Regenerating internal bridge systems...");

    // Generate Config System
    fs::create_dir_all(root.join("src/config")).unwrap();
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
    fs::create_dir_all(root.join(".expresskit")).unwrap();
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
    fs::create_dir_all(root.join(".expresskit/error_handling")).unwrap();
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

    // Generate Core System (app.ts and server.ts usually shouldn't be overwritten, 
    // but the original sync script regenerated everything in config, route, error, core, example, readme)
    // Actually, looking at original sync.ts, it calls all generation functions.
    // The original functions overwrite the files.

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
    fs::create_dir_all(root.join("src/controllers")).unwrap();
    fs::create_dir_all(root.join("src/services")).unwrap();
    fs::create_dir_all(root.join("src/middleware")).unwrap();
    fs::create_dir_all(root.join("src/routes/health")).unwrap();
    
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

    log_success("Successfully rebuilt .expresskit bridge files ✨");
}
