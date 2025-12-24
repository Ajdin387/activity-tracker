# Activity Tracker (Monorepo)

Mini **bullet journal / activity tracker** aplikacija.

- **Frontend:** React + TypeScript  
- **Backend:** Spring Boot (Java 21) + Spring Data JPA + MapStruct  
- **DB:** H2 (local/dev) ali PostgreSQL (Docker)  
- **Docker:** `docker compose` (postgres + backend + frontend + nginx proxy)

---

## Funkcionalnosti

### Osnovno

- Seznam aktivnosti (**ime, datum, opis, trajanje, kategorija**)
- Dodajanje nove aktivnosti + osnovna validacija
- Brisanje aktivnosti
- Shranjevanje prek API klicev na backend

### Dodatno (opcijsko iz navodil)

- Filtriranje/iskanje (`category`, `from`, `to`, `q`)
- Sortiranje + paginacija (Spring `Pageable`)
- Urejanje aktivnosti (PUT)
- Statistika:
  - total (skupni čas)
  - by-day
  - by-category
  - by-day-category
- PostgreSQL persistenca prek Docker profila
- Docker (compose + nginx proxy za `/api`)

---

## Hitri zagon z Dockerjem

### Predpogoji

- Docker Desktop (Windows/macOS/Linux)

### Zagon

V root mapi repo-ja:

```bash
docker compose up --build
```

Odpri:

- **Frontend:** http://localhost:3000  
- **Backend (health):** http://localhost:8080/api/health

### Ustavitev

```bash
docker compose down
```

Če želiš pobrisati tudi podatke baze:

```bash
docker compose down -v
```

---

## Lokalni razvoj (brez Dockera)

### Predpogoji

- Java 21
- Maven (ali Maven Wrapper)
- Node.js (npr. 18+ ali 20)

### Backend (H2 in-memory)

V `backend/`:

**Windows (PowerShell):**

```powershell
.\mvnw.cmd spring-boot:run
```

**Linux/macOS:**

```bash
./mvnw spring-boot:run
```

Backend:

- **Health:** http://localhost:8080/api/health
- **DB:** H2 in-memory (konfigurirano v `backend/src/main/resources/application.yml`)

### Frontend (dev server)

V `frontend/`:

```bash
npm install
npm start
```

Frontend:

- http://localhost:3000

V dev načinu frontend uporablja:

- `proxy: "http://localhost:8080"` (CRA)

Zato API kličeš kot `/api/...` brez CORS konfiguracije.

---

## API

### Health

#### GET `/api/health`

Vrne `"OK"`.

---

## Activities

### Model (API)

**Activity (response):**

```json
{
  "id": 1,
  "name": "Reading",
  "description": "optional",
  "category": "Hobby",
  "date": "2025-12-24",
  "durationMinutes": 30
}
```

**Create/Update request:**

```json
{
  "name": "Reading",
  "description": "optional",
  "category": "Hobby",
  "date": "2025-12-24",
  "durationMinutes": 30
}
```

---

### List (paging, sorting, filtering)

#### GET `/api/activities`

**Query params:**

- `page` (0-based), npr. `page=0`
- `size`, npr. `size=20`
- `sort` (ponovi večkrat), npr. `sort=date,desc&sort=id,desc`
- `category` (exact match, case-insensitive)
- `from` (YYYY-MM-DD)
- `to` (YYYY-MM-DD)
- `q` (search v `name` in `description`)

**Primer:**

```
/api/activities?page=0&size=10&sort=date,desc&sort=id,desc&category=Sport&from=2025-01-01&to=2025-12-31&q=run
```

Response je Spring `Page`, npr.:

```json
{
  "content": [ ],
  "totalElements": 12,
  "totalPages": 2,
  "number": 0,
  "size": 10,
  "first": true,
  "last": false
}
```

---

### Get by id

#### GET `/api/activities/{id}`

```
/api/activities/1
```

---

### Create

#### POST `/api/activities`

Vrne **201 Created** + `Location` header.

Body primer:

```json
{
  "name": "Reading",
  "category": "Hobby",
  "date": "2025-12-24",
  "durationMinutes": 30,
  "description": "Book"
}

```

---

### Update

#### PUT `/api/activities/{id}`

Primer: 
```
/api/activities/1
``` 
Body primer:
```json
{
  "name": "Reading (updated)",
  "category": "Hobby",
  "date": "2025-12-24",
  "durationMinutes": 45,
  "description": "Updated"
}
```

---

### Delete

#### DELETE `/api/activities/{id}`

Vrne **204 No Content**.

```
DELETE /api/activities/1
```

---

## Stats

Vsi stats endpointi podpirajo opcijske filtre:

- `categories` (lahko večkrat): `?categories=sport&categories=hobby`
- `from` / `to` (YYYY-MM-DD)

### Total

#### GET `/api/stats/total`

```
/api/stats/total?from=2025-01-01&to=2025-12-31&categories=sport
```

Response:

```json
{ "totalMinutes": 123 }
```

### By day

#### GET `/api/stats/by-day`

```
/api/stats/by-day?from=2025-01-01&to=2025-12-31
```

### By category

#### GET `/api/stats/by-category`

```
/api/stats/by-category?from=2025-01-01&to=2025-12-31
```

### By day + category

#### GET `/api/stats/by-day-category`

```
/api/stats/by-day-category?from=2025-01-01&to=2025-12-31
```

---

## Napake / Error format

Backend vrača strukturiran JSON za tipične napake:

- **400 Bad Request** (validation, malformed JSON, invalid query param)
- **404 Not Found** (neobstoječi resource)
- **500 Internal Server Error** (unexpected)

Primer (404):

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Activity with id 999 not found",
  "path": "/api/activities/999",
  "timestamp": "2025-12-24T10:00:00Z"
}
```

---

## Opombe

- V Docker načinu je priporočeno uporabljati `/api/*` prek nginx proxy-ja.
- V lokalnem dev načinu (CRA proxy) kliči endpoint-e kot `/api/...`.
