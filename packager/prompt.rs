use inquire::{Text, Select};

pub struct ProjectConfig {
    pub name: String,
    pub language: String,
}

pub fn prompt_user() -> ProjectConfig {
    let project_name = Text::new("📦 Project name")
        .with_default("express-backend")
        .prompt()
        .unwrap();

    let language_options = vec!["TypeScript", "JavaScript"];
    let language_selection = Select::new("🧠 Choose language", language_options)
        .with_starting_cursor(0)
        .prompt()
        .unwrap();

    let language = if language_selection == "TypeScript" { "ts".to_string() } else { "js".to_string() };

    ProjectConfig {
        name: project_name,
        language,
    }
}
