use clap::{Parser, Subcommand};
use colored::*;

mod init;
mod sync;
mod prompt;

#[derive(Parser)]
#[command(name = "expresskit")]
#[command(about = "ExpressKit – Opinionated Backend Starter", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Initialize a new ExpressKit project
    Init,
    /// Regenerate internal bridge systems
    Sync,
}

pub fn log_info(msg: &str) {
    println!("{}  {}", "ℹ️".blue(), msg);
}

pub fn log_success(msg: &str) {
    println!("{} {}", "✔".green(), msg);
}

pub fn log_error(msg: &str) {
    eprintln!("{} {}", "❌".red(), msg);
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Init) => {
            init::run().await;
        }
        Some(Commands::Sync) => {
            sync::run().await;
        }
        None => {
            // Safety Net (UX Guard)
            println!("
🚀 ExpressKit – Express.js Project Generator

This is a CLI tool and must be run with a command.

👉 To get started, run:

  npx @pd241008/expresskit init

or (recommended):

  npm create expresskit

👉 To regenerate bridge files (if missing after cloning):

  npx @pd241008/expresskit sync

Optional global install:

  npm install -g @pd241008/expresskit
  expresskit init
");
            std::process::exit(0);
        }
    }
}
