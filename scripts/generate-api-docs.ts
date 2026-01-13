#!/usr/bin/env tsx
/**
 * API Documentation Generator
 *
 * Generates OpenAPI/Swagger documentation from Zod schemas.
 *
 * Usage:
 *   pnpm generate:api-docs
 *   pnpm generate:api-docs:watch
 */

import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { OpenAPIGenerator, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod/v4"
import { apiSchemas } from "../src/lib/api-schemas"
import { createScriptLogger } from "../src/lib/logger"

const log = createScriptLogger("generate-api-docs")

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z)

// Create OpenAPI registry
const registry = new OpenAPIRegistry()

// Register all schemas with OpenAPI metadata
registry.register(
  "ErrorResponse",
  apiSchemas.errorResponse.openapi({
    description: "Standard error response",
    example: {
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      timestamp: new Date().toISOString(),
    },
  })
)

registry.register(
  "User",
  apiSchemas.userResponse.openapi({
    description: "User object",
    example: {
      id: 1,
      email: "user@example.com",
      name: "John Doe",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  })
)

registry.register(
  "CreateUserInput",
  apiSchemas.createUserInput.openapi({
    description: "User creation input",
    example: {
      email: "newuser@example.com",
      name: "Jane Doe",
      password: "example-password-placeholder", // Example only - use environment variables in production
    },
  })
)

registry.register(
  "UpdateUserInput",
  apiSchemas.updateUserInput.openapi({
    description: "User update input",
    example: {
      name: "Jane Smith",
      isActive: true,
    },
  })
)

// Register API endpoints
registry.registerPath({
  method: "get",
  path: "/api/users",
  summary: "List users",
  description: "Get a paginated list of users",
  tags: ["Users"],
  request: {
    query: apiSchemas.userQuery,
  },
  responses: {
    200: {
      description: "List of users",
      content: {
        "application/json": {
          schema: apiSchemas.userListResponse,
        },
      },
    },
    400: {
      description: "Bad request",
      content: {
        "application/json": {
          schema: apiSchemas.errorResponse,
        },
      },
    },
  },
})

registry.registerPath({
  method: "get",
  path: "/api/users/{id}",
  summary: "Get user by ID",
  description: "Retrieve a single user by their ID",
  tags: ["Users"],
  request: {
    params: apiSchemas.userIdParams,
  },
  responses: {
    200: {
      description: "User details",
      content: {
        "application/json": {
          schema: apiSchemas.userResponse,
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: apiSchemas.errorResponse,
        },
      },
    },
  },
})

registry.registerPath({
  method: "post",
  path: "/api/users",
  summary: "Create user",
  description: "Create a new user",
  tags: ["Users"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: apiSchemas.createUserInput,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User created",
      content: {
        "application/json": {
          schema: apiSchemas.userResponse,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: apiSchemas.errorResponse,
        },
      },
    },
  },
})

registry.registerPath({
  method: "patch",
  path: "/api/users/{id}",
  summary: "Update user",
  description: "Update an existing user",
  tags: ["Users"],
  request: {
    params: apiSchemas.userIdParams,
    body: {
      content: {
        "application/json": {
          schema: apiSchemas.updateUserInput,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User updated",
      content: {
        "application/json": {
          schema: apiSchemas.userResponse,
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: apiSchemas.errorResponse,
        },
      },
    },
  },
})

registry.registerPath({
  method: "delete",
  path: "/api/users/{id}",
  summary: "Delete user",
  description: "Delete a user by ID",
  tags: ["Users"],
  request: {
    params: apiSchemas.userIdParams,
  },
  responses: {
    204: {
      description: "User deleted",
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: apiSchemas.errorResponse,
        },
      },
    },
  },
})

// Generate OpenAPI document
const generator = new OpenAPIGenerator(registry.definitions, "3.1.0")

const openApiDocument = generator.generateDocument({
  info: {
    title: "My Project API",
    version: "1.0.0",
    description: "Auto-generated API documentation from Zod schemas",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://api.example.com",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Users",
      description: "User management endpoints",
    },
  ],
})

// Write OpenAPI spec to file
const outputPath = join(process.cwd(), "public", "openapi.json")
writeFileSync(outputPath, JSON.stringify(openApiDocument, null, 2))

log.info({ outputPath }, `✅ OpenAPI specification generated: ${outputPath}`)
log.info(
  { schemaCount: registry.definitions.length },
  `📊 Registered ${registry.definitions.length} schemas`
)
log.info({ url: "http://localhost:3000/api-docs" }, "🔗 View at: http://localhost:3000/api-docs")
