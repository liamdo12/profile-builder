# Profile Builder — Backend Planning

## Overview

AI-powered profile builder application built with **Java 21**, **Spring Boot 3.4**, **Hibernate/JPA**, **PostgreSQL 16**, and **LangChain4j 1.11.0**.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | Java | 21 |
| Framework | Spring Boot | 3.4.13 |
| ORM | Hibernate (via Spring Data JPA) | managed by Spring Boot |
| Database | PostgreSQL | 16 |
| AI/LLM | LangChain4j | 1.11.0-beta19 |
| Build | Maven | 3.9+ |
| Containerization | Docker + Docker Compose | latest |

---

## Folder Structure

```
backend/
├── pom.xml                         # Maven build & dependencies
├── Dockerfile                      # Multi-stage Docker build
├── docker-compose.yml              # PostgreSQL + app services
├── .dockerignore
└── src/
    ├── main/
    │   ├── java/com/profilebuilder/
    │   │   ├── ProfileBuilderApplication.java    # Entry point
    │   │   ├── config/                           # Spring & AI config
    │   │   │   ├── AiConfig.java
    │   │   │   └── WebConfig.java
    │   │   ├── controller/                       # REST endpoints
    │   │   ├── service/                          # Business logic
    │   │   ├── repository/                       # JPA repositories
    │   │   ├── model/
    │   │   │   ├── entity/                       # Hibernate entities
    │   │   │   └── dto/                          # Request/Response DTOs
    │   │   ├── ai/                               # LangChain4j layer
    │   │   │   ├── agent/                        # @AiService interfaces
    │   │   │   ├── tool/                         # LLM-callable tools
    │   │   │   └── prompt/                       # Prompt helpers
    │   │   ├── exception/                        # Error handling
    │   │   │   └── GlobalExceptionHandler.java
    │   │   └── util/                             # Shared utilities
    │   └── resources/
    │       ├── application.yml                   # Main config
    │       ├── application-dev.yml               # Dev overrides
    │       └── prompts/                          # Prompt templates
    └── test/
        └── java/com/profilebuilder/
            └── ProfileBuilderApplicationTests.java
```

### Package Responsibilities

- **`config/`** — Spring beans, CORS, security, and LangChain4j model configuration
- **`controller/`** — Thin REST controllers mapping HTTP → service calls
- **`service/`** — Core business logic, orchestration between AI and data layers
- **`repository/`** — Spring Data JPA interfaces for database access
- **`model/entity/`** — `@Entity` classes mapped to PostgreSQL tables
- **`model/dto/`** — Data Transfer Objects for API request/response payloads
- **`ai/agent/`** — LangChain4j `@AiService` declarative interfaces
- **`ai/tool/`** — Methods the LLM can invoke (function calling)
- **`ai/prompt/`** — Prompt builders and helper utilities
- **`exception/`** — Custom exceptions and `@RestControllerAdvice` handler
- **`util/`** — Shared helpers (string manipulation, date formatting, etc.)

---

## Dependencies

### Production

| Dependency | Purpose |
|-----------|---------|
| `spring-boot-starter-web` | REST API, embedded Tomcat |
| `spring-boot-starter-data-jpa` | Hibernate ORM + Spring Data repositories |
| `spring-boot-starter-validation` | Bean Validation (Jakarta) |
| `spring-boot-starter-actuator` | Health checks, metrics |
| `postgresql` | JDBC driver for PostgreSQL |
| `langchain4j-spring-boot-starter` | LangChain4j core + `@AiService` support |
| `langchain4j-open-ai-spring-boot-starter` | OpenAI model auto-configuration |
| `lombok` | Boilerplate reduction |

### Development & Test

| Dependency | Purpose |
|-----------|---------|
| `spring-boot-devtools` | Hot reload during development |
| `spring-boot-starter-test` | JUnit 5, Mockito, Spring Test |

---

## Docker Setup

### Dockerfile (Multi-stage)

1. **Build stage** — `maven:3.9-eclipse-temurin-21` compiles the project
2. **Run stage** — `eclipse-temurin:21-jre-alpine` runs the JAR as non-root user

### Docker Compose Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `postgres` | `postgres:16-alpine` | 5432 | Database with persistent volume + health check |
| `app` | Built from `Dockerfile` | 8080 | Spring Boot application |

### Quick Start

```bash
# Start everything (DB first, then app after health check passes)
docker compose up -d

# View logs
docker compose logs -f app

# Stop everything
docker compose down

# Stop and remove data volume
docker compose down -v
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `profile_builder` | Database name |
| `DB_USERNAME` | `profilebuilder` | Database user |
| `DB_PASSWORD` | `profilebuilder` | Database password |
| `OPENAI_API_KEY` | `demo` | OpenAI API key |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model name |

---

## Development Roadmap

- [ ] Define domain entities (Profile, Skill, Experience, etc.)
- [ ] Implement CRUD REST APIs
- [ ] Build LangChain4j AI agents for profile generation/enhancement
- [ ] Add AI tools for data extraction and enrichment
- [ ] Implement authentication & authorization (Spring Security)
- [ ] Add comprehensive test coverage
- [ ] Set up CI/CD pipeline
