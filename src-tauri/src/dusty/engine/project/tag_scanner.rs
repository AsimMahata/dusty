use std::{fs::read_dir, path::PathBuf};

use crate::dusty::{
    data::project::{Project, Tag},
    engine::project::tag_parser::scan_tags_from_readme,
};

pub fn scan_tags(project: &Project) -> Vec<Tag> {
    let mut tags: Vec<Tag> = Vec::new();
    tags.extend(scan_tags_from_readme(project));
    tags.extend(scan_tags_from_structure(project));
    tags.sort_by(|a, b| a.as_str().cmp(b.as_str()));
    tags.dedup();
    tags
}
pub fn get_git_ignores(path: &PathBuf) -> Vec<String> {
    let git_ignore_path = format!("{}/.gitignore", path.to_str().unwrap());
    let git_ignore = std::fs::read_to_string(git_ignore_path);
    match git_ignore {
        Ok(git_ignore) => git_ignore.lines().map(|line| line.to_string()).collect(),
        Err(_) => Vec::new(),
    }
}

pub fn scan_tags_from_directory_structure(path: &PathBuf,tags:&mut Vec<Tag>,git_ignores:&mut Vec<String>) {
    git_ignores.extend(get_git_ignores(path));
    let entries = match read_dir(path) {
        Ok(entries) => entries,
        Err(_) => return,
    };
    let mut file_names: Vec<String> = Vec::new();
    let mut child_directories: Vec<PathBuf> = Vec::new();

    for entry in entries.filter_map(|e| e.ok()) {
        let p = entry.path();
        let path_str = p.to_str().unwrap_or("").to_string();
        let file_name = p.file_name().and_then(|n| n.to_str()).unwrap_or("").to_string();

        if git_ignores.contains(&path_str) || git_ignores.contains(&file_name) {
            continue;
        }

        if file_name == "node_modules" || file_name == "target" || file_name == ".git" {
            continue;
        }

        if let Ok(file_type) = entry.file_type() {
            if file_type.is_file() {
                file_names.push(file_name);
            } else if file_type.is_dir() {
                child_directories.push(p);
            }
        }
    }


    for name in &file_names {
        match name.as_str() {
            // Languages & runtimes
            "Cargo.toml" => tags.push(Tag::Rust),
            "package.json" => tags.push(Tag::NodeJs),
            "go.mod" => tags.push(Tag::Go),
            "pom.xml" | "build.gradle" | "build.gradle.kts" => tags.push(Tag::Java),
            "requirements.txt" | "setup.py" | "pyproject.toml" | "Pipfile" => tags.push(Tag::Python),
            "composer.json" => tags.push(Tag::Php),
            "Gemfile" => tags.push(Tag::Ruby),
            "pubspec.yaml" => tags.push(Tag::Dart),
            "CMakeLists.txt" | "Makefile.am" => tags.push(Tag::CCpp),

            // Frameworks & Build Tools — detected by config files
            "vite.config.js" | "vite.config.ts" => {
                tags.push(Tag::Vite);
                tags.push(Tag::React);
            },
            "next.config.js" | "next.config.mjs" | "next.config.ts" => tags.push(Tag::NextJs),
            "nuxt.config.ts" | "nuxt.config.js" => tags.push(Tag::Vue),
            "angular.json" => tags.push(Tag::Angular),
            "svelte.config.js" | "svelte.config.ts" => tags.push(Tag::Svelte),
            "astro.config.mjs" | "astro.config.ts" => tags.push(Tag::Astro),
            "manage.py" => tags.push(Tag::Django),
            "artisan" => tags.push(Tag::Laravel),
            "Rakefile" | "config.ru" => tags.push(Tag::Rails),

            // Frameworks — detected by directories
            "src-tauri" => tags.push(Tag::Tauri),

            _ => {}
        }
    }

    // TypeScript detection
    if file_names.iter().any(|n| n == "tsconfig.json" || n == "tsconfig.app.json") {
        tags.push(Tag::TypeScript);
    }

    // Flutter detection (pubspec.yaml + lib/)
    if file_names.iter().any(|n| n == "pubspec.yaml") && file_names.iter().any(|n| n == "lib") {
        tags.push(Tag::Flutter);
    }

    // .NET detection
    if file_names.iter().any(|n| n.ends_with(".csproj") || n.ends_with(".sln")) {
        tags.push(Tag::DotNet);
    }

    // C# detection
    if file_names.iter().any(|n| n.ends_with(".csproj")) {
        tags.push(Tag::CSharp);
    }

    for child in &child_directories {
        scan_tags_from_directory_structure(child,tags,git_ignores);
    }
}

pub fn scan_tags_from_structure(project: &Project) -> Vec<Tag> {
    let mut tags: Vec<Tag> = Vec::new();
    let mut git_ignores = Vec::new();
    scan_tags_from_directory_structure(&PathBuf::from(project.path.clone()),&mut tags,&mut git_ignores);
    tags
}
