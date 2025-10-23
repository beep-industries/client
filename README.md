# Beep

## Project Architecture

The project follows a modern and modular architecture to facilitate maintainability and scalability.

```
src/
├── app/                          # Global app configuration
│   ├── providers/                # All React providers
│   │   ├── QueryProvider.tsx     # TanStack Query
│   │   ├── RouterProvider.tsx    # TanStack Router
│   │   ├── ThemeProvider.tsx     # Theme context
│   │   └── I18nProvider.tsx      # i18n
│   ├── styles/
│   │   ├── globals.css           # Global styles + Tailwind
│   │   └── themes.css            # CSS variables for themes
│   └── App.tsx                   # Main entry point
│
├── features/                     # Features by business domain
│   ├── auth/
│   │   ├── api/                  # Auth API calls
│   │   ├── components/           # Auth-specific components
│   │   ├── hooks/                # Auth business hooks
│   │   ├── types/                # TypeScript types
│   │   └── utils/                # Auth utilities
│   ├── dashboard/
│   └── users/
│
├── shared/                       # Shared code between features
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Shadcn components
│   │   ├── layout/               # Header, Sidebar, Footer
│   │   └── common/               # Other shared components
│   ├── hooks/                    # Reusable hooks
│   │   ├── useMediaQuery.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── lib/                      # External libs configuration
│   │   ├── api-client.ts         # Configured Axios/Fetch
│   │   ├── query-client.ts       # TanStack Query config
│   │   └── utils.ts              # cn() and utilities
│   ├── types/                    # Global types
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   └── constants/                # Global constants
│       ├── routes.ts
│       └── api-endpoints.ts
│
├── routes/                       # TanStack Router routes
│   ├── __root.tsx                # Root layout
│   ├── index.tsx                 # Home page
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── dashboard/
│       └── index.tsx
│
├── locales/                      # Translation files
│   ├── en/
│   │   ├── common.json
│   │   └── features.json
│   └── fr/
│       ├── common.json
│       └── features.json
│
├── assets/                       # Static assets
│   ├── images/
│   └── icons/
│
├── main.tsx                      # Vite entry point
└── vite-env.d.ts
```

### Architecture Principles

- **Separation by business domain**: Each feature is isolated in its own folder with its components, hooks, and API logic
- **Centralized shared code**: Reusable elements are in `shared/` to avoid duplication
- **Centralized configuration**: All providers and global configuration are in `app/`
- **File-based routing**: TanStack Router with an intuitive file structure
- **Internationalization**: Multi-language support with translation files organized by language

> **Note**: Some files and folders shown in the architecture tree do not exist yet. This structure is provided as a guide for the intended project organization.

---

## Code Formatting with Prettier

This project uses **Prettier** to maintain consistent code formatting across the codebase.

### Configuration

The Prettier configuration is located in the `.prettierrc` file at the root of the project.

### Setup in VS Code

To automatically format your code on save:

1. Install the **Prettier - Code formatter** extension in VS Code
2. Set Prettier as your default formatter:
   - Open VS Code Settings (Ctrl+, or Cmd+,)
   - Search for "Default Formatter"
   - Select **Prettier - Code formatter** from the dropdown
3. Enable "Format On Save" in VS Code settings

### Format Command

You can manually format the entire codebase by running:

```bash
pnpm run format
```

This command will format all TypeScript, JavaScript, JSON, and CSS files in the `src/` directory according to the rules defined in `.prettierrc`.

---

## Build and run with docker

To build and run the Beep client application using Docker, follow these steps:
1. **Build the Docker Image**  
   Open a terminal in the root directory of the project (where the `Dockerfile` is located) and run the following command to build the Docker image:
   ```bash
   docker build -t beep-client .
   ```

2. **Run the Docker Container**
    After the image is built, you can run a container using the following command:
    ```bash
    docker run -d --rm -p 8080:8080 beep-client
    ```
---

_This README will be completed with additional sections as development progresses._
