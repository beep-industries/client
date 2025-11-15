# Beep

## Prerequisites

```
node 22.21+
```


## Project Architecture

The project follows a modern and modular architecture to facilitate maintainability and scalability.

```
src/
├── app/                          # Global app configuration
│   ├── providers/                # All React providers
│   │   ├── ThemeProvider.tsx     # Theme context
│   │   └── AuthProvider.tsx     
│   ├── styles/
│   │   ├── globals.css           # Global styles + Tailwind
│   │   └── themes.css            # CSS variables for themes
│   └── App.tsx                   # Main entry point
│
├── features/                     # Features by business domain
# Each feature has its own folder with components, hooks, types, and utils  
│   ├── auth/
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
│   │   ├── api.ts                # Configured Axios/Fetch
│   │   └── utils.ts              # cn() and utilities
│   ├── queries/                  # TanStack Query configurations
│   │   └── auth/                 # Authentication queries
│   │       ├── auth.api.ts       # Auth API functions
│   │       ├── auth.queries.ts   # TanStack Query hooks
│   │       └── auth.types.ts     # Auth query types
│   ├── types/                    # Global types
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
├── assets/                       # Static assets
│   ├── images/
│   └── icons/
│
├── main.tsx                      # Vite entry point
└── vite-env.d.ts
public/
├── locales/                      # Translation files
│   ├── en.json                   # English translations
│   └── fr.json                   # French translations
└── vite.svg                      # Vite logo
```

### Architecture Principles

- **Separation by business domain**: Each feature is isolated in its own folder with its components, hooks, and API logic
- **Centralized shared code**: Reusable elements are in `shared/` to avoid duplication
- **Centralized configuration**: All providers and global configuration are in `app/`
- **File-based routing**: TanStack Router with an intuitive file structure
- **Internationalization**: Multi-language support with translation files organized by language
- **Query layer**: TanStack Query configurations organized by domain in `shared/queries/`

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

## Authentication with Keycloak

> **⚠️ Work in Progress**: Keycloak integration is currently under development. Keycloak is not yet available in our infrastructure. The configuration below is for local development and testing purposes only.

This project uses **Keycloak** for authentication and authorization. The Keycloak instance is automatically configured when you start the Docker Compose stack.

### Test User Credentials

A test user is automatically created with the following credentials:

- **Username**: `testuser`
- **Password**: `test123`

### Testing the Authentication Flow

1. **Start Keycloak**:
   ```bash
   docker-compose up -d
   ```

2. **Access the application**:
   - Open your browser and go to `http://localhost:5173`
   - Click on the "Se connecter" (Login) button
   - You will be redirected to the Keycloak login page

3. **Login with the test user**:
   - Enter username: `testuser`
   - Enter password: `test123`
   - After successful authentication, you will be redirected to `/discover`

4. **Access Keycloak Admin Console** (optional):
   - Go to `http://localhost:8080`
   - Use the admin credentials from your `.env` file
   - You can manage users, clients, and realm settings

### Realm Configuration

The Keycloak realm (`myrealm`) and client (`frontend`) are automatically imported on startup from the `keycloak-config/realm-export.json` file. The configuration includes:

- **Client ID**: `frontend`
- **Redirect URIs**: `http://localhost:5173/*`
- **Web Origins**: `http://localhost:5173`
- **PKCE**: Enabled (S256)

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

## Adding new shadcn components

Use the following command to add components in order to import it with the right file naming convention:

```bash
pnpm add-component <component-name>
```


## WebRTC Demo

- A minimal WebRTC provider and UI component were added to mirror the provided HTML example.
- Navigate to /webrtc to try it.
- Signaling uses a Phoenix channel for the initial offer/answer and leave events, while in-call negotiation still uses the WebRTC DataChannel (offer/answer messages over the RTC data channel), just like the original HTML snippet.

Signaling details:
- Topic: `voice-channel:<session_id>`
- Events:
  - `offer` request payload: `{ session_id, endpoint_id, offer_sdp }` → ok reply: `{ answer_sdp }`
  - `leave` request payload: `{ session_id, endpoint_id }`

Configuration:
- Set `VITE_REAL_TIME_URL` to your backend HTTP base (e.g., `http://localhost:4000`). The client derives the Phoenix socket URL as `ws(s)://.../socket`.

Files:
- src/app/providers/WebRTCProvider.tsx: Context/provider encapsulating the WebRTC logic (join, leave, startCam, startMic) with Phoenix channel signaling for initial connection and RTC DataChannel for subsequent negotiation.
- src/app/providers/RealTimeSocketProvider.tsx: Provides a Phoenix socket and helpers to join/leave topics.
- src/features/webrtc/components/WebRTCDemo.tsx: Simple UI using the provider.
- src/routes/webrtc.tsx: Route exposing the demo page and wiring RealTimeSocketProvider + WebRTCProvider.

_This README will be completed with additional sections as development progresses._
