use serde::{Deserialize, Deserializer, Serialize};

use crate::dusty::system::git::GitInfo;

#[derive(Serialize, Debug, Clone, PartialEq)]
pub enum Tag {
    #[serde(rename = "rust")]
    Rust,
    #[serde(rename = "typescript")]
    TypeScript,
    #[serde(rename = "javascript")]
    JavaScript,
    #[serde(rename = "react")]
    React,
    #[serde(rename = "nextjs")]
    NextJs,
    #[serde(rename = "vue")]
    Vue,
    #[serde(rename = "angular")]
    Angular,
    #[serde(rename = "svelte")]
    Svelte,
    #[serde(rename = "astro")]
    Astro,
    #[serde(rename = "solidjs")]
    SolidJs,
    #[serde(rename = "tauri")]
    Tauri,
    #[serde(rename = "electron")]
    Electron,
    #[serde(rename = "python")]
    Python,
    #[serde(rename = "django")]
    Django,
    #[serde(rename = "flask")]
    Flask,
    #[serde(rename = "fastapi")]
    FastApi,
    #[serde(rename = "java")]
    Java,
    #[serde(rename = "spring_boot")]
    SpringBoot,
    #[serde(rename = "nodejs")]
    NodeJs,
    #[serde(rename = "express")]
    Express,
    #[serde(rename = "nestjs")]
    NestJs,
    #[serde(rename = "c_cpp")]
    CCpp,
    #[serde(rename = "csharp")]
    CSharp,
    #[serde(rename = "dotnet")]
    DotNet,
    #[serde(rename = "go")]
    Go,
    #[serde(rename = "php")]
    Php,
    #[serde(rename = "laravel")]
    Laravel,
    #[serde(rename = "ruby")]
    Ruby,
    #[serde(rename = "rails")]
    Rails,
    #[serde(rename = "dart")]
    Dart,
    #[serde(rename = "flutter")]
    Flutter,
    #[serde(rename = "ai")]
    Ai,
    #[serde(rename = "machine_learning")]
    MachineLearning,
    #[serde(rename = "game")]
    Game,
    #[serde(rename = "desktop")]
    Desktop,
    #[serde(rename = "backend")]
    Backend,
    #[serde(rename = "frontend")]
    Frontend,
    #[serde(rename = "web")]
    Web,
    #[serde(rename = "mobile")]
    Mobile,
    #[serde(rename = "cli")]
    Cli,
    #[serde(rename = "api")]
    Api,
    #[serde(rename = "database")]
    Database,
    #[serde(rename = "automation")]
    Automation,
    #[serde(rename = "open_source")]
    OpenSource,
    #[serde(rename = "personal")]
    Personal,
    #[serde(rename = "college")]
    College,
    #[serde(rename = "archived")]
    Archived,
    #[serde(rename = "vite")]
    Vite,
}

impl Tag {
    pub fn from_string(value: &str) -> Option<Self> {
        match value.to_lowercase().replace([' ', '-'], "_").as_str() {
            "rust" => Some(Self::Rust),
            "typescript" => Some(Self::TypeScript),
            "javascript" => Some(Self::JavaScript),
            "react" => Some(Self::React),
            "nextjs" | "next_js" => Some(Self::NextJs),
            "vue" => Some(Self::Vue),
            "angular" => Some(Self::Angular),
            "svelte" => Some(Self::Svelte),
            "astro" => Some(Self::Astro),
            "solidjs" | "solid_js" => Some(Self::SolidJs),
            "tauri" => Some(Self::Tauri),
            "electron" => Some(Self::Electron),
            "python" => Some(Self::Python),
            "django" => Some(Self::Django),
            "flask" => Some(Self::Flask),
            "fastapi" | "fast_api" => Some(Self::FastApi),
            "java" => Some(Self::Java),
            "spring_boot" => Some(Self::SpringBoot),
            "nodejs" | "node_js" => Some(Self::NodeJs),
            "express" => Some(Self::Express),
            "nestjs" | "nest_js" => Some(Self::NestJs),
            "c_cpp" | "c/c++" => Some(Self::CCpp),
            "csharp" | "c#" => Some(Self::CSharp),
            "dotnet" | ".net" => Some(Self::DotNet),
            "go" => Some(Self::Go),
            "php" => Some(Self::Php),
            "laravel" => Some(Self::Laravel),
            "ruby" => Some(Self::Ruby),
            "rails" => Some(Self::Rails),
            "dart" => Some(Self::Dart),
            "flutter" => Some(Self::Flutter),
            "ai" => Some(Self::Ai),
            "machine_learning" => Some(Self::MachineLearning),
            "game" => Some(Self::Game),
            "desktop" => Some(Self::Desktop),
            "backend" => Some(Self::Backend),
            "frontend" => Some(Self::Frontend),
            "web" => Some(Self::Web),
            "mobile" => Some(Self::Mobile),
            "cli" => Some(Self::Cli),
            "api" => Some(Self::Api),
            "database" => Some(Self::Database),
            "automation" => Some(Self::Automation),
            "open_source" => Some(Self::OpenSource),
            "personal" => Some(Self::Personal),
            "college" => Some(Self::College),
            "archived" => Some(Self::Archived),
            "vite" => Some(Self::Vite),
            _ => None,
        }
    }

    pub fn as_str(&self) -> &str {
        match self {
            Self::Rust => "rust",
            Self::TypeScript => "typescript",
            Self::JavaScript => "javascript",
            Self::React => "react",
            Self::NextJs => "nextjs",
            Self::Vue => "vue",
            Self::Angular => "angular",
            Self::Svelte => "svelte",
            Self::Astro => "astro",
            Self::SolidJs => "solidjs",
            Self::Tauri => "tauri",
            Self::Electron => "electron",
            Self::Python => "python",
            Self::Django => "django",
            Self::Flask => "flask",
            Self::FastApi => "fastapi",
            Self::Java => "java",
            Self::SpringBoot => "spring_boot",
            Self::NodeJs => "nodejs",
            Self::Express => "express",
            Self::NestJs => "nestjs",
            Self::CCpp => "c_cpp",
            Self::CSharp => "csharp",
            Self::DotNet => "dotnet",
            Self::Go => "go",
            Self::Php => "php",
            Self::Laravel => "laravel",
            Self::Ruby => "ruby",
            Self::Rails => "rails",
            Self::Dart => "dart",
            Self::Flutter => "flutter",
            Self::Ai => "ai",
            Self::MachineLearning => "machine_learning",
            Self::Game => "game",
            Self::Desktop => "desktop",
            Self::Backend => "backend",
            Self::Frontend => "frontend",
            Self::Web => "web",
            Self::Mobile => "mobile",
            Self::Cli => "cli",
            Self::Api => "api",
            Self::Database => "database",
            Self::Automation => "automation",
            Self::OpenSource => "open_source",
            Self::Personal => "personal",
            Self::College => "college",
            Self::Archived => "archived",
            Self::Vite => "vite",
        }
    }
}

fn deserialize_tags<'de, D>(deserializer: D) -> Result<Vec<Tag>, D::Error>
where
    D: Deserializer<'de>,
{
    let values = Vec::<String>::deserialize(deserializer)?;
    Ok(values
        .iter()
        .filter_map(|value| Tag::from_string(value))
        .collect())
}

#[derive(Deserialize, Serialize, Debug, Clone, Default, PartialEq)]
pub enum Framework {
    React,
    #[serde(rename = "Next.js")]
    NextJs,
    Vue,
    Angular,
    Svelte,
    Astro,
    #[serde(rename = "SolidJS")]
    SolidJs,
    Tauri,
    Electron,
    Flutter,
    Django,
    Flask,
    #[serde(rename = "FastAPI")]
    FastApi,
    #[serde(rename = "Spring Boot")]
    SpringBoot,
    Express,
    #[serde(rename = "NestJS")]
    NestJs,
    Rails,
    Laravel,
    #[serde(rename = ".NET")]
    DotNet,
    #[default]
    #[serde(other)]
    Unknown,
}

impl Framework {
    pub fn from_value(value: &str) -> Self {
        match value {
            "React" | "react" => Self::React,
            "Next.js" | "nextjs" | "next_js" => Self::NextJs,
            "Vue" | "vue" => Self::Vue,
            "Angular" | "angular" => Self::Angular,
            "Svelte" | "svelte" => Self::Svelte,
            "Astro" | "astro" => Self::Astro,
            "SolidJS" | "solidjs" => Self::SolidJs,
            "Tauri" | "tauri" => Self::Tauri,
            "Electron" | "electron" => Self::Electron,
            "Flutter" | "flutter" => Self::Flutter,
            "Django" | "django" => Self::Django,
            "Flask" | "flask" => Self::Flask,
            "FastAPI" | "fastapi" => Self::FastApi,
            "Spring Boot" | "spring_boot" => Self::SpringBoot,
            "Express" | "express" => Self::Express,
            "NestJS" | "nestjs" => Self::NestJs,
            "Rails" | "rails" => Self::Rails,
            "Laravel" | "laravel" => Self::Laravel,
            ".NET" | "dotnet" => Self::DotNet,
            _ => Self::Unknown,
        }
    }
}

impl std::fmt::Display for Framework {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let value = serde_json::to_string(self).map_err(|_| std::fmt::Error)?;
        write!(formatter, "{}", value.trim_matches('"'))
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Project {
    pub id: String,
    pub title: String,
    pub path: String,
    pub project_type: Option<Framework>,
    pub pinned: bool,
    pub status: String,
    #[serde(default, deserialize_with = "deserialize_tags")]
    pub tags: Vec<Tag>,
    #[serde(default)]
    pub cover_image: Option<String>,
    #[serde(default)]
    pub logo: Option<String>,
    #[serde(default)]
    pub last_opened: Option<String>,
    #[serde(default)]
    pub last_modified: Option<String>,
    #[serde(default)]
    pub last_scan: Option<String>,
    #[serde(default)]
    pub description: Option<String>,
    #[serde(default)]
    pub size: Option<String>,
    #[serde(default)]
    pub git_info: Option<GitInfo>,
}

#[derive(Serialize, Debug)]
pub struct ProjectInfo {
    pub project_type: Option<Framework>,
    pub pinned: bool,
    pub status: String,
    pub tags: Vec<Tag>,
}

const FRAMEWORK_PRIORITY: &[Framework] = &[
    Framework::NextJs,
    Framework::NestJs,
    Framework::Tauri,
    Framework::Electron,
    Framework::Astro,
    Framework::SolidJs,
    Framework::Svelte,
    Framework::Vue,
    Framework::Angular,
    Framework::React,
    Framework::Flutter,
    Framework::SpringBoot,
    Framework::DotNet,
    Framework::Laravel,
    Framework::Rails,
    Framework::Django,
    Framework::FastApi,
    Framework::Flask,
    Framework::Express,
];

impl Project {
    pub fn get_framework(&self) -> Framework {
        self.project_type
            .clone()
            .filter(|framework| framework != &Framework::Unknown)
            .or_else(|| {
                FRAMEWORK_PRIORITY
                    .iter()
                    .find(|&framework| {
                        self.tags.iter().any(|tag| {
                            &Framework::from_value(tag.as_str()) == framework
                        })
                    })
                    .cloned()
            })
            .unwrap_or_default()
    }
}
