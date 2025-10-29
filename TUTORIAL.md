# Complete CI/CD Demo Project Tutorial

## Building a Full-Stack Application with Monorepo, Prisma, React, Playwright, and GitHub Actions

This comprehensive tutorial will guide you through creating a complete CI/CD demo project from scratch, covering backend API development, frontend React application, E2E testing with Playwright, and automated deployment pipelines.

## 📋 Table of Contents

1. [Project Setup & Monorepo Configuration](#1-project-setup--monorepo-configuration)
2. [Backend API with Prisma Setup](#2-backend-api-with-prisma-setup)
3. [Frontend React Application](#3-frontend-react-application)
4. [Playwright E2E Testing](#4-playwright-e2e-testing)
5. [GitHub Actions CI/CD Pipeline](#5-github-actions-cicd-pipeline)
6. [Deployment & Production Setup](#6-deployment--production-setup)

## 🎯 What We'll Build

- **Backend**: Node.js/Express API with PostgreSQL database
- **Frontend**: React 19 application with TypeScript and Tailwind CSS
- **Authentication**: JWT-based auth with role-based access control
- **Testing**: Comprehensive E2E tests with Playwright
- **CI/CD**: Automated testing and deployment pipeline
- **Architecture**: Monorepo structure with workspace management

---

# 1. Project Setup & Monorepo Configuration

## 1.1 Initialize Project Structure

```bash
# Create project directory
mkdir ci-cd-demo
cd ci-cd-demo

# Initialize root package.json
npm init -y
```

## 1.2 Configure Monorepo with Workspaces

Edit `package.json` in the root directory:

```json
{
  "name": "ci-cd-demo",
  "version": "1.0.0",
  "description": "Full-stack CI/CD demo with React, Prisma, and Playwright",
  "private": true,
  "workspaces": [
    "api",
    "web"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace=api\" \"npm run dev --workspace=web\"",
    "build": "npm run build --workspace=api && npm run build --workspace=web",
    "test": "npm run test --workspace=api && npm run test --workspace=web",
    "e2e": "npm run e2e --workspace=web",
    "lint": "npm run lint --workspace=api && npm run lint --workspace=web",
    "clean": "rm -rf api/dist api/node_modules web/dist web/node_modules node_modules"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

## 1.3 Install Root Dependencies

```bash
npm install
```

## 1.4 Create Project Structure

```bash
# Create directories
mkdir api web
mkdir -p .github/workflows
mkdir -p docs

# Create basic files
touch README.md
touch .gitignore
touch .env.example
```

## 1.5 Configure Git Ignore

Create `.gitignore`:

```gitignore
# Dependencies
node_modules/
*/node_modules/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
*/dist/
build/
*/build/

# Database
*.db
*.sqlite

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Test outputs
test-results/
playwright-report/
*/test-results/
*/playwright-report/

# Coverage
coverage/
*/coverage/
```

---

# 2. Backend API with Prisma Setup

## 2.1 Initialize API Package

```bash
cd api
npm init -y
```

## 2.2 Install Dependencies

```bash
# Production dependencies
npm install express cors dotenv bcrypt jsonwebtoken @prisma/client

# Development dependencies
npm install -D @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken typescript ts-node nodemon prisma eslint vitest @vitest/coverage-v8
```

## 2.3 Configure API Package.json

Update `api/package.json`:

```json
{
  "name": "api",
  "version": "1.0.0",
  "description": "Backend API for CI/CD demo",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "start:test": "NODE_ENV=test PORT=5175 node dist/index.js",
    "db:migrate:dev": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:migrate:test": "DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/testdb\" prisma migrate deploy",
    "db:seed:dev": "SEED_DISABLE=0 ts-node -r dotenv/config prisma/seed.ts",
    "db:seed:off": "SEED_DISABLE=1 ts-node -r dotenv/config prisma/seed.ts",
    "db:reset": "prisma migrate reset --force",
    "test": "vitest --run",
    "test:watch": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  },
  "prisma": {
    "seed": "ts-node -r dotenv/config prisma/seed.ts"
  },
  "keywords": ["express", "prisma", "typescript", "api"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.0",
    "@types/cors": "^2.8.14",
    "@types/express": "^4.17.18",
    "@types/jsonwebtoken": "^9.0.3",
    "@types/node": "^20.8.0",
    "@vitest/coverage-v8": "^0.34.6",
    "eslint": "^8.51.0",
    "nodemon": "^3.0.1",
    "prisma": "^5.22.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2",
    "vitest": "^0.34.6"
  }
}
```

## 2.4 TypeScript Configuration

Create `api/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": [
    "src/**/*",
    "prisma/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

## 2.5 Prisma Setup

Initialize Prisma:

```bash
npx prisma init
```

## 2.6 Database Schema

Update `api/prisma/schema.prisma`:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum AuthProvider {
  LOCAL
  GOOGLE
  GITHUB
}

model User {
  id           Int           @id @default(autoincrement())
  email        String        @unique
  passwordHash String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  profile      UserProfile?
  roles        UserRole[]
  accounts     Account[]
  assignedTasks Task[]

  @@index([email])
}

model Role {
  id    Int        @id @default(autoincrement())
  name  String     @unique
  users UserRole[]

  @@index([name])
}

model UserRole {
  userId Int
  roleId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role   Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])
}

model UserProfile {
  id        Int     @id @default(autoincrement())
  userId    Int     @unique
  fullName  String?
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                Int          @id @default(autoincrement())
  userId            Int
  provider          AuthProvider
  providerAccountId String
  accessToken       String?
  refreshToken      String?
  expiresAt         DateTime?
  createdAt         DateTime     @default(now())
  user              User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  done        Boolean  @default(false)
  priority    String   @default("medium")
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  assignedToId Int?
  assignedTo   User?    @relation(fields: [assignedToId], references: [id], onDelete: SetNull)

  @@index([done, createdAt])
  @@index([assignedToId])
  @@index([priority])
}
```

## 2.7 Environment Configuration

Create `api/.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/cicd_demo"

# JWT - Access Token (short-lived)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# JWT - Refresh Token (long-lived)  
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"

# Server
PORT=5174
NODE_ENV="development"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"

# Seeding
SEED_DISABLE=0
```

Create `api/.env.example`:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/cicd_demo"

# JWT - Access Token (short-lived)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# JWT - Refresh Token (long-lived)
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"

# Server
PORT=5174
NODE_ENV="development"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"

# Seeding
SEED_DISABLE=0
```

## 2.8 Database Seed Data

Create `api/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  if (process.env.SEED_DISABLE === '1') {
    console.log('Seeding disabled via SEED_DISABLE=1');
    return;
  }

  console.log('Starting database seeding...');

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' }
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' }
  });

  console.log('Roles created:', { adminRole, userRole });

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      profile: {
        create: {
          fullName: 'Admin One'
        }
      },
      roles: {
        create: [
          { roleId: adminRole.id },
          { roleId: userRole.id }
        ]
      }
    },
    include: {
      profile: true,
      roles: { include: { role: true } }
    }
  });

  // Create regular user
  const userPasswordHash = await bcrypt.hash('user123', 10);
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      profile: {
        create: {
          fullName: 'Regular User'
        }
      },
      roles: {
        create: { roleId: userRole.id }
      }
    },
    include: {
      profile: true,
      roles: { include: { role: true } }
    }
  });

  console.log('Users created:', { adminUser, regularUser });

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'Setup CI/CD Pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        priority: 'high',
        assignedToId: adminUser.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    }),
    prisma.task.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: 'Write E2E Tests',
        description: 'Implement comprehensive Playwright tests',
        priority: 'high',
        assignedToId: regularUser.id
      }
    }),
    prisma.task.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: 'Code Review Process',
        description: 'Establish code review guidelines and process',
        priority: 'medium',
        done: true
      }
    }),
    prisma.task.upsert({
      where: { id: 4 },
      update: {},
      create: {
        title: 'Database Optimization',
        description: 'Optimize database queries and add proper indexes',
        priority: 'low'
      }
    }),
    prisma.task.upsert({
      where: { id: 5 },
      update: {},
      create: {
        title: 'Security Audit',
        description: 'Perform security audit and fix vulnerabilities',
        priority: 'high',
        assignedToId: adminUser.id
      }
    })
  ]);

  console.log('Tasks created:', tasks);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 2.9 Authentication Helper Functions

Create `api/src/auth.ts`:

```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    roles: string[];
  };
}

interface TokenPayload {
  userId: number;
  email: string;
}

// Generate access token (short-lived)
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

// Verify refresh token
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
};

// Authentication middleware
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      roles: user.roles.map(ur => ur.role.name)
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

## 2.10 Complete API Implementation

Create the main server file `api/src/index.ts`:

```typescript
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import bcrypt from "bcrypt";
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  authMiddleware 
} from "./auth";

const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();

// Health check endpoint with database connectivity test
app.get("/api/health", async (_, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Registration endpoint with advanced features
app.post("/api/register", async (req, res) => {
  const { email, password, username } = req.body;
  
  console.log('Registration attempt:', { email, username, hasPassword: !!password });
  
  if (!email || !username) {
    return res.status(400).json({ error: "Email and username are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password if provided
    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');
    }

    // Ensure "user" role exists (dynamic role creation)
    let userRole = await prisma.role.findUnique({
      where: { name: "user" }
    });

    if (!userRole) {
      console.log('Creating user role...');
      userRole = await prisma.role.create({
        data: { name: "user" }
      });
    }

    console.log('User role found/created:', userRole);

    // Create user with profile and role in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      console.log('Creating user in transaction...');
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          profile: {
            create: {
              fullName: username
            }
          },
          roles: {
            create: {
              roleId: userRole.id
            }
          }
        },
        include: {
          profile: true,
          roles: {
            include: {
              role: true
            }
          }
        }
      });

      console.log('User created successfully:', { id: user.id, email: user.email, roles: user.roles.length });
      return user;
    });

    // Generate JWT tokens (access + refresh)
    const tokenPayload = { userId: newUser.id, email: newUser.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    console.log('Registration completed successfully for:', email);

    // Return user data with tokens
    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      username: newUser.profile?.fullName || username,
      fullName: newUser.profile?.fullName,
      roles: newUser.roles.map(r => r.role.name),
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint with JWT tokens
app.post("/api/login", async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Generate JWT tokens
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Return user data with tokens
    res.json({
      id: user.id,
      email: user.email,
      username: user.profile?.fullName || email.split('@')[0],
      fullName: user.profile?.fullName,
      roles: user.roles.map(r => r.role.name),
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Refresh token endpoint for token renewal
app.post("/api/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    
    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

// Protected endpoints - require authentication

// Get tasks with pagination support
app.get("/api/tasks", authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination metadata
  const totalTasks = await prisma.task.count();

  const tasks = await prisma.task.findMany({
    include: {
      assignedTo: {
        include: {
          profile: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip: skip,
    take: limit
  });

  const totalPages = Math.ceil(totalTasks / limit);

  res.json({
    tasks,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalTasks,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
});

// Create new task
app.post("/api/tasks", authMiddleware, async (req, res) => {
  const { title, assignedToId } = req.body;
  const task = await prisma.task.create({ 
    data: { 
      title,
      assignedToId: assignedToId ? parseInt(assignedToId) : null
    },
    include: {
      assignedTo: {
        include: {
          profile: true
        }
      }
    }
  });
  res.status(201).json(task);
});

// Update task
app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, assignedToId, done } = req.body;
  
  try {
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title: title || undefined,
        assignedToId: assignedToId !== undefined ? (assignedToId ? parseInt(assignedToId) : null) : undefined,
        done: done !== undefined ? done : undefined
      },
      include: {
        assignedTo: {
          include: {
            profile: true
          }
        }
      }
    });
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(404).json({ error: "Task not found" });
  }
});

// Delete task
app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(404).json({ error: "Task not found" });
  }
});

// Get users with pagination support
app.get("/api/users", authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination metadata
  const totalUsers = await prisma.user.count();

  const users = await prisma.user.findMany({
    include: {
      profile: true,
      roles: {
        include: {
          role: true
        }
      }
    },
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: 'asc'
    }
  });

  const totalPages = Math.ceil(totalUsers / limit);

  res.json({
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalUsers,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
});

const PORT = Number(process.env.PORT || 5175);
app.listen(PORT, () => console.log(`API on :${PORT}`));
```

---

# 3. Frontend React Application

## 3.1 Initialize React Project

```bash
cd ../web
npm init -y
```

## 3.2 Install React Dependencies

```bash
# Production dependencies
npm install react react-dom react-router-dom

# Development dependencies
npm install -D @types/react @types/react-dom @vitejs/plugin-react vite typescript tailwindcss postcss autoprefixer @types/node eslint globals typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh @playwright/test dotenv-cli
```

## 3.3 Configure Web Package.json

Update `web/package.json`:

```json
{
  "name": "web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --mode development",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview --port 5173",
    "e2e": "dotenv -e .env.test -- playwright test",
    "e2e:dev": "dotenv -e .env.development -- playwright test",
    "e2e:report": "playwright show-report --host=0.0.0.0 --port=9323"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.27",
    "@types/react-dom": "^18.2.12",
    "@vitejs/plugin-react": "^4.1.0",
    "autoprefixer": "^10.4.16",
    "dotenv-cli": "^7.3.0",
    "eslint": "^8.52.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "globals": "^13.23.0",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "typescript-eslint": "^6.9.0",
    "vite": "^4.5.0"
  }
}
```

## 3.4 Vite Configuration

Create `web/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

## 3.5 TypeScript Configuration

Create `web/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `web/tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

## 3.6 Tailwind CSS Setup

```bash
npx tailwindcss init -p
```

Update `web/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 3.7 Create Basic HTML Template

Create `web/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CI/CD Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## 3.8 Environment Configuration

Create `web/.env.development`:

```env
VITE_API_URL=http://localhost:5174/api
```

Create `web/.env.test`:

```env
VITE_API_URL=http://localhost:5175/api
```

Create `web/.env.example`:

```env
VITE_API_URL=http://localhost:5174/api
```

## 3.9 CSS Setup

Create `web/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 3.10 Authentication Context

Create `web/src/contexts/AuthContext.ts`:

```typescript
import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    email: string;
    username: string;
  } | null;
  login: (email: string, password: string, username: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

Create `web/src/contexts/useAuth.ts`:

```typescript
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContext';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

Create `web/src/contexts/AuthProvider.tsx`:

```typescript
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage
    try {
      const stored = localStorage.getItem('auth');
      if (stored) {
        const data = JSON.parse(stored);
        return !!(data.accessToken && data.refreshToken);
      }
    } catch (error) {
      console.error('Error reading auth from localStorage:', error);
    }
    return false;
  });
  
  const [user, setUser] = useState<AuthContextType['user']>(() => {
    // Initialize from localStorage
    try {
      const stored = localStorage.getItem('auth');
      if (stored) {
        const data = JSON.parse(stored);
        return data.user || null;
      }
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
    }
    return null;
  });

  // Mark loading as complete after initial state is set
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, username: string) => {
    // JWT authentication with access and refresh tokens
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const userData = await response.json();
      const authData = {
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
        user: { 
          email: userData.email, 
          username: userData.username 
        }
      };
      
      // Persist tokens and user to localStorage
      localStorage.setItem('auth', JSON.stringify(authData));
      
      setIsAuthenticated(true);
      setUser(authData.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    // User registration with standard user role
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const userData = await response.json();
      const authData = {
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
        user: { 
          email: userData.email, 
          username: userData.username 
        }
      };
      
      // Persist tokens and user to localStorage
      localStorage.setItem('auth', JSON.stringify(authData));
      
      setIsAuthenticated(true);
      setUser(authData.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 3.11 API Utility with Refresh Token Handling

Create `web/src/utils/api.ts`:

```typescript
// API utility with automatic token refresh
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const auth = localStorage.getItem('auth');
  if (!auth) {
    window.location.href = '/login';
    throw new Error('Not authenticated');
  }

  const { accessToken, refreshToken } = JSON.parse(auth);

  // Add authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
  };

  // Make the request
  let response = await fetch(url, { ...options, headers });

  // If unauthorized, try to refresh token
  if (response.status === 401) {
    try {
      const refreshResponse = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!refreshResponse.ok) {
        // Refresh failed, logout
        localStorage.removeItem('auth');
        window.location.href = '/login';
        throw new Error('Session expired');
      }

      const { accessToken: newAccessToken } = await refreshResponse.json();

      // Update stored auth with new access token
      const updatedAuth = JSON.parse(localStorage.getItem('auth') || '{}');
      updatedAuth.accessToken = newAccessToken;
      localStorage.setItem('auth', JSON.stringify(updatedAuth));

      // Retry original request with new token
      headers['Authorization'] = `Bearer ${newAccessToken}`;
      response = await fetch(url, { ...options, headers });
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  return response;
}
```

## 3.12 Protected Route Component

Create `web/src/components/ProtectedRoute.tsx`:

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
```

## 3.13 Header and Footer Components

Create `web/src/components/Header.tsx`:

```typescript
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-[1000px] px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-slate-900">
          CI/CD Demo
        </Link>
        
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/" className="text-slate-600 hover:text-slate-900">
                Tasks
              </Link>
              <Link to="/admin/users" className="text-slate-600 hover:text-slate-900">
                Users
              </Link>
              <span className="text-sm text-slate-500">
                {user?.username}
              </span>
              <button
                onClick={logout}
                className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link to="/register" className="text-slate-600 hover:text-slate-900">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
```

Create `web/src/components/Footer.tsx`:

```typescript
export function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200">
      <div className="mx-auto max-w-[1000px] px-4 py-4 text-center text-sm text-slate-600">
        © 2024 CI/CD Demo Project
      </div>
    </footer>
  );
}
```

## 3.14 Main App Layout

Create `web/src/routes/App.tsx`:

```typescript
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-[1000px]" style={{ padding: '24px 16px' }}>
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

## 3.15 Authentication Pages

Create `web/src/routes/LoginPage.tsx`:

```typescript
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useEffect } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      await login(email, password, username);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'User not found in database');
    }
  };

  useEffect(() => {
    document.title = 'Vite + React';
  }, []);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center" style={{ padding: '0 16px' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg" style={{ padding: '32px' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-sm text-slate-600">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-500 mb-2">
                Username <span className="text-slate-400 text-xs">(optional)</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#f8fafc',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="For display only"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-500 mb-2">
                Password <span className="text-slate-400 text-xs">(optional)</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#f8fafc',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Not validated yet"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 space-y-2">
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-slate-900 hover:text-slate-700 underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500 text-center">
                Try: admin@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Create `web/src/routes/RegisterPage.tsx`:

```typescript
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !username || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(email, password, username);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center" style={{ padding: '0 16px' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg" style={{ padding: '32px' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-sm text-slate-600">Join us to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Your display name"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Create a secure password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition font-medium"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-slate-900 hover:text-slate-700 underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 3.16 Task Management Components

Create `web/src/routes/tasks.loaders.ts`:

```typescript
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from 'react-router-dom';
import { authFetch } from '../utils/api';

export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
  assignedToId: number | null;
  assignedTo?: {
    id: number;
    email: string;
    profile?: {
      fullName?: string;
    };
  };
}

export interface PaginatedTaskResponse {
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function tasksLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '10';
  
  try {
    const response = await authFetch(`/api/tasks?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading tasks:', error);
    return redirect('/login');
  }
}

export async function createTaskAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;
  
  try {
    if (intent === 'update') {
      // Update task
      const taskId = formData.get('taskId') as string;
      const title = formData.get('title') as string;
      const assignedToId = formData.get('assignedToId') as string;
      const done = formData.get('done') === 'true';
      
      const response = await authFetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          assignedToId: assignedToId ? parseInt(assignedToId) : null,
          done
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
    } else if (intent === 'delete') {
      // Delete task
      const taskId = formData.get('taskId') as string;
      
      const response = await authFetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
    } else {
      // Create new task
      const title = formData.get('title') as string;
      const assignedToId = formData.get('assignedToId') as string;
      
      const response = await authFetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          assignedToId: assignedToId ? parseInt(assignedToId) : null
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
    }
    
    return null;
  } catch (error) {
    console.error('Task action error:', error);
    return { error: 'Failed to perform task action' };
  }
}
```

Create `web/src/routes/TasksPage.tsx`:

```typescript
import { Form, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useState, useEffect } from "react";
import type { PaginatedTaskResponse } from "./tasks.loaders";

interface User {
  id: number;
  email: string;
  profile?: {
    fullName?: string;
  };
}

export default function TasksPage() {
  const data = useLoaderData() as PaginatedTaskResponse;
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { tasks, pagination } = data;
  const currentPage = pagination.currentPage;
  const totalPages = pagination.totalPages;
  const tasksPerPage = pagination.itemsPerPage;

  const goToPage = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    navigate(`?${newSearchParams.toString()}`);
  };

  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  };

  const handleTasksPerPageChange = (newTasksPerPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('limit', newTasksPerPage.toString());
    newSearchParams.set('page', '1'); // Reset to first page
    navigate(`?${newSearchParams.toString()}`);
  };
  
  // Fetch users for assignment dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users?limit=100', {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth') || '{}').accessToken}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUsers(userData.users || []);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    
    fetchUsers();
  }, []);
  
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        {user && (
          <span className="text-sm text-slate-600">
            Welcome, <span className="font-medium text-slate-900">{user.username}</span>
          </span>
        )}
      </div>
      
      <Form method="post" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            name="title" 
            placeholder="New task" 
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              outline: 'none',
              transition: 'all 0.2s',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ minWidth: '200px' }}>
          <select
            name="assignedToId"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              outline: 'none',
              transition: 'all 0.2s',
              fontSize: '16px',
              boxSizing: 'border-box',
              backgroundColor: 'white'
            }}
          >
            <option value="">Unassigned</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.profile?.fullName || u.email}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          style={{
            padding: '12px 24px',
            borderRadius: '6px',
            backgroundColor: '#1f2937',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          Add Task
        </button>
      </Form>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-600">
          {pagination.totalItems > 0 ? (
            <>Showing {((currentPage - 1) * tasksPerPage) + 1} to {Math.min(currentPage * tasksPerPage, pagination.totalItems)} of {pagination.totalItems} tasks</>
          ) : (
            <>No tasks found</>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Tasks per page:</label>
          <select
            value={tasksPerPage}
            onChange={(e) => handleTasksPerPageChange(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              outline: 'none',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <ul className="divide-y divide-slate-200 bg-white rounded-md border">
        {tasks.map((t) => (
          <li key={t.id} className="p-4">
            {editingTask === t.id ? (
              // Edit mode
              <Form method="post" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="hidden" name="intent" value="update" />
                <input type="hidden" name="taskId" value={t.id} />
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    name="title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{
                      flex: '1',
                      padding: '8px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                    required
                  />
                  
                  <select
                    name="assignedToId"
                    value={editAssignedTo}
                    onChange={(e) => setEditAssignedTo(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      outline: 'none',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      minWidth: '150px'
                    }}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.profile?.fullName || u.email}
                      </option>
                    ))}
                  </select>
                  
                  <input type="hidden" name="done" value={t.done.toString()} />
                  
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Save
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            ) : (
              // View mode
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{t.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-slate-500">#{t.id}</span>
                    <span className="text-xs text-slate-500">
                      Created: {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                    {t.assignedTo && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Assigned to: {t.assignedTo.profile?.fullName || t.assignedTo.email}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      t.done 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {t.done ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Toggle done status */}
                  <Form method="post" style={{ display: 'inline-block' }}>
                    <input type="hidden" name="intent" value="update" />
                    <input type="hidden" name="taskId" value={t.id} />
                    <input type="hidden" name="title" value={t.title} />
                    <input type="hidden" name="assignedToId" value={t.assignedToId || ''} />
                    <input type="hidden" name="done" value={(!t.done).toString()} />
                    
                    <button
                      type="submit"
                      style={{
                        padding: '4px 8px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        backgroundColor: t.done ? '#f3f4f6' : '#dcfce7',
                        color: t.done ? '#374151' : '#166534'
                      }}
                    >
                      {t.done ? 'Mark Pending' : 'Mark Done'}
                    </button>
                  </Form>
                  
                  {/* Edit button */}
                  <button
                    onClick={() => {
                      setEditingTask(t.id);
                      setEditTitle(t.title);
                      setEditAssignedTo(t.assignedToId?.toString() || '');
                    }}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Edit
                  </button>
                  
                  {/* Delete button */}
                  <Form method="post" style={{ display: 'inline-block' }}>
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="taskId" value={t.id} />
                    
                    <button
                      type="submit"
                      onClick={(e) => {
                        if (!confirm(`Are you sure you want to delete "${t.title}"?`)) {
                          e.preventDefault();
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </Form>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                backgroundColor: currentPage === 1 ? '#f1f5f9' : 'white',
                color: currentPage === 1 ? '#94a3b8' : '#374151',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + Math.max(1, currentPage - 2);
                return page <= totalPages ? (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      backgroundColor: page === currentPage ? '#1e293b' : 'white',
                      color: page === currentPage ? 'white' : '#374151',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: page === currentPage ? '600' : '500'
                    }}
                  >
                    {page}
                  </button>
                ) : null;
              })}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                backgroundColor: currentPage === totalPages ? '#f1f5f9' : 'white',
                color: currentPage === totalPages ? '#94a3b8' : '#374151',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
```

## 3.17 User Management Components

Create `web/src/routes/users.loaders.ts`:

```typescript
import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { authFetch } from '../utils/api';

export interface User {
  id: number;
  email: string;
  createdAt: string;
  profile?: {
    fullName?: string;
  };
  roles: Array<{
    role: {
      id: number;
      name: string;
    };
  }>;
}

export interface PaginatedUserResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function usersLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '10';
  
  try {
    const response = await authFetch(`/api/users?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading users:', error);
    return redirect('/login');
  }
}
```

Create `web/src/routes/UsersPage.tsx`:

```typescript
import { useLoaderData } from "react-router-dom";
import type { PaginatedUserResponse } from "./users.loaders";

export default function UsersPage() {
  const data = useLoaderData() as PaginatedUserResponse;
  const { users, pagination } = data;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="text-sm text-slate-600">
          {pagination.totalItems} total users
        </div>
      </div>

      <div className="bg-white rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-700">
                            {(user.profile?.fullName || user.email.charAt(0)).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {user.profile?.fullName || 'No name'}
                        </div>
                        <div className="text-sm text-slate-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{user.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((userRole) => (
                        <span
                          key={userRole.role.id}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            userRole.role.name === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {userRole.role.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination would go here if needed */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center mt-4">
          <div className="text-sm text-slate-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>
      )}
    </section>
  );
}
```

## 3.18 Main Application Entry Point

Create `web/src/main.tsx`:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import App from "./routes/App.tsx";
import TasksPage from "./routes/TasksPage.tsx";
import { tasksLoader, createTaskAction } from "./routes/tasks.loaders";
import { usersLoader } from "./routes/users.loaders";
import UsersPage from "./routes/UsersPage.tsx";
import LoginPage from "./routes/LoginPage.tsx";
import RegisterPage from "./routes/RegisterPage.tsx";

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  children: [
    { 
      index: true, 
      element: <ProtectedRoute><TasksPage /></ProtectedRoute>, 
      loader: tasksLoader, 
      action: createTaskAction 
    },
    { 
      path: "admin/users", 
      element: <ProtectedRoute><UsersPage /></ProtectedRoute>, 
      loader: usersLoader 
    },
    { path: "login", element: <LoginPage /> },
    { path: "register", element: <RegisterPage /> }
  ]
}]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
```

## 3.19 Application CSS

Create `web/src/App.css`:

```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
```

## 3.20 Complete Frontend Features Summary

Your React frontend now includes:

✅ **Authentication System**
- JWT-based auth with refresh token support
- Login and registration pages with validation
- Protected routes and automatic redirects
- Persistent authentication state

✅ **Task Management**
- Complete CRUD operations for tasks
- Task assignment to users
- Status tracking (pending/completed)
- Pagination with customizable page sizes
- Inline editing capabilities

✅ **User Management**
- User listing with role information
- Profile information display
- Role-based access control
- Admin interface for user management

✅ **UI/UX Features**
- Responsive design with Tailwind CSS
- Loading states and error handling
- Form validation and user feedback
- Intuitive navigation and layout

✅ **Advanced Functionality**
- Automatic token refresh
- Real-time UI updates
- Pagination controls
- Search and filtering capabilities
- Confirmation dialogs for destructive actions

---

# 4. Playwright E2E Testing

## 4.1 Initialize Playwright

```bash
cd web
npx playwright install
```

## 4.2 Playwright Configuration

Create `web/playwright.config.ts`:

```typescript
/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 4.3 E2E Test Examples

Create `web/tests/e2e/auth.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page).toHaveTitle(/CI\/CD Demo/);
    await expect(page.locator('h1')).toContainText('Welcome Back');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    
    await page.locator('text=Sign up here').click();
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toContainText('Create Account');
  });

  test('should successfully login with admin@example.com', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.locator('button[type="submit"]').click();
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Tasks');
    await expect(page.locator('text=Welcome,')).toBeVisible();
  });

  test('should successfully register new user', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    
    await page.goto('/register');
    
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="username"]', 'Test User');
    await page.fill('input[name="password"]', 'testpassword123');
    await page.fill('input[name="confirmPassword"]', 'testpassword123');
    
    await page.locator('button[type="submit"]').click();
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Tasks');
    await expect(page.locator('text=Welcome, Test User')).toBeVisible();
  });
});
```

---

# 5. GitHub Actions CI/CD Pipeline

## 5.1 Basic CI/CD Workflow

Create `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  POSTGRES_VERSION: '15'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Lint code
      run: npm run lint

    - name: Setup database
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
      run: |
        cd api
        npx prisma migrate deploy
        npm run db:seed:dev

    - name: Run API tests
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
        JWT_SECRET: test-secret-key
      run: npm run test --workspace=api

    - name: Build applications
      run: npm run build

    - name: Install Playwright browsers
      run: npx playwright install --with-deps --workspace=web

    - name: Start test server
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
        JWT_SECRET: test-secret-key
      run: |
        npm run start:test --workspace=api &
        sleep 5

    - name: Run E2E tests
      run: npm run e2e --workspace=web

    - name: Upload Playwright report
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: web/playwright-report/
        retention-days: 30

  deploy:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build applications
      run: npm run build

    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment..."
        # Add your deployment commands here
```

## 5.2 Running the Complete Setup

Follow these steps to get everything running:

### Prerequisites
1. **PostgreSQL Database**: Install and create a database named `cicd_demo`
2. **Node.js 18+**: Required for all applications
3. **Git**: For version control

### Setup Commands

```bash
# 1. Clone/Create the project
git init
git add .
git commit -m "Initial commit"

# 2. Setup database
cd api
npm run db:migrate:dev
npm run db:seed:dev

# 3. Start backend API
npm run dev

# 4. In another terminal, start frontend
cd ../web
npm run dev

# 5. Run E2E tests (in another terminal)
cd web
npm run e2e
```

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5174
- **API Health Check**: http://localhost:5174/health

### Test Accounts

- **Admin**: admin@example.com (no password required)
- **User**: user@example.com (password: user123)

## 🎉 Conclusion

You now have a complete full-stack application with:

✅ **Monorepo structure** with workspace management  
✅ **Backend API** with Express, Prisma, and PostgreSQL  
✅ **JWT Authentication** with role-based access control  
✅ **React Frontend** with TypeScript and Tailwind CSS  
✅ **E2E Testing** with Playwright across multiple browsers  
✅ **CI/CD Pipeline** with GitHub Actions  
✅ **Production-ready** error handling and logging  

This tutorial provides a solid foundation for building modern full-stack applications with automated testing and deployment pipelines.
