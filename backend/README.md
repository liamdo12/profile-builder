# Profile Builder — Backend

AI-powered profile builder built with **Java 21**, **Spring Boot 3.4**, **Hibernate/JPA**, **PostgreSQL 16**, and **LangChain4j**.

---

## Prerequisites

- **Docker** & **Docker Compose** (recommended)
- **Java 21** (only if running without Docker)
- **Maven 3.9+** (only if running without Docker)

---

## Quick Start (Docker)

The easiest way to run the backend — no local Java/Maven install needed.

```bash
# 1. Clone the repo and navigate to backend
cd backend

# 2. (Optional) Set your OpenAI API key
export OPENAI_API_KEY=sk-your-key-here

# 3. Start PostgreSQL + Spring Boot app
docker compose up -d

# 4. Check logs
docker compose logs -f app

# 5. Verify the app is running
curl http://localhost:8080/actuator/health
```

### Stop

```bash
docker compose down        # Stop containers
docker compose down -v     # Stop + delete database volume
```

---

## Running Locally (without Docker)

### 1. Start PostgreSQL

You need a PostgreSQL 16 instance running. You can start just the database from Docker Compose:

```bash
docker compose up -d postgres
```

### 2. Build & Run

```bash
# Using Maven wrapper or installed Maven
mvn clean package -DskipTests
java -jar target/profile-builder-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

Or run directly:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `profile_builder` | Database name |
| `DB_USERNAME` | `profilebuilder` | Database user |
| `DB_PASSWORD` | `profilebuilder` | Database password |
| `OPENAI_API_KEY` | `demo` | OpenAI API key |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model |
| `UPLOAD_DIR` | `src/main/resources/uploads` | File upload directory |

---

## API Endpoints

### Document Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/documents/upload` | Upload a PDF or Word document |
| `GET`  | `/api/documents` | List all documents (optional `?documentType=RESUME`) |
| `GET`  | `/api/documents/{id}` | Get document by ID |

#### Upload Example

```bash
curl -X POST http://localhost:8080/api/documents/upload \
  -F "file=@/path/to/resume.pdf" \
  -F "documentType=RESUME"
```

**Supported file types:** PDF (`.pdf`), Word (`.doc`, `.docx`)  
**Document types:** `RESUME`, `COVER_LETTER`  
**Max file size:** 2MB

---

## Database Migrations

SQL migration files are located in `db/migrations/`. They are provided for manual/reference use; Hibernate auto-creates the schema from JPA entities at startup (`ddl-auto: update`).

```bash
# To apply manually against PostgreSQL:
docker compose exec postgres psql -U profilebuilder -d profile_builder \
  -f /path/to/20260214_create_documents_table.sql
```

---

## Project Structure

```
backend/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── db/migrations/              # SQL schema files
└── src/main/java/com/profilebuilder/
    ├── ProfileBuilderApplication.java
    ├── config/                 # Spring & AI config
    ├── controller/             # REST endpoints
    ├── service/                # Business logic
    ├── repository/             # JPA repositories
    ├── model/
    │   ├── entity/             # Hibernate entities
    │   ├── dto/                # Request/Response DTOs
    │   └── enums/              # Enums (DocumentType)
    ├── ai/                     # LangChain4j layer
    │   ├── agent/              # @AiService interfaces
    │   ├── tool/               # LLM-callable tools
    │   └── prompt/             # Prompt helpers
    ├── exception/              # Error handling
    └── util/                   # Shared utilities
```
