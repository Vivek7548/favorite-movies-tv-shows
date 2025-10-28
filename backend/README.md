## Favorite Movies - Backend API

Express.js + Prisma ORM backend for managing favorite movies and TV shows. Features RESTful API endpoints with pagination, validation, and error handling.

### Quick Summary

- **Server**: Express.js API (entry point: `src/index.js`)
- **Database**: Prisma ORM with SQLite (development) or MySQL (production)
- **Database Schema**: `prisma/schema.prisma`
- **Seed Data**: `prisma/seed.js`
- **Port**: `4000` (configurable via `.env`)

### Prerequisites

- Node.js v18+ recommended
- npm
- MySQL (for production) or SQLite (for local development)

### Local Development Setup

1. **Install dependencies**:
```powershell
cd 'f:\Favorite Movies & TV Shows\backend'
npm install
```

2. **Configure environment variables**:
Create or edit `.env`:
```env
# Local development with SQLite
DATABASE_URL="file:./dev.db"
PORT=4000
NODE_ENV=development

# Production with MySQL (uncomment and configure)
# DATABASE_URL="mysql://user:password@localhost:3306/favorites"
```

3. **Generate Prisma client and initialize database**:
```powershell
# Generate Prisma client
npm run prisma:generate

# Apply schema (creates dev.db for SQLite)
npm run prisma:migrate

# Seed sample data (optional)
npm run prisma:seed
```

4. **Start development server**:
```powershell
npm run dev
```

The API will be available at `http://localhost:4000`

### Database Schema

```prisma
model Favorite {
  id          Int      @id @default(autoincrement())
  title       String
  type        String    # "MOVIE" or "TV_SHOW"
  director    String
  budget      String
  location    String
  duration    String
  yearTime    String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Field Descriptions**:
- `id`: Auto-incremented primary key
- `title`: Movie/TV show name
- `type`: "MOVIE" or "TV_SHOW"
- `director`: Director/creator name
- `budget`: Budget information (stored as string for flexibility)
- `location`: Filming/production location
- `duration`: Runtime/episode length
- `yearTime`: Release year or date
- `description`: Optional plot summary or notes
- `createdAt`: Automatic creation timestamp
- `updatedAt`: Automatic update timestamp

### API Endpoints

#### Get Health Status
**GET** `/health`

Quick check that the API is running.

Response:
```json
{ "status": "ok" }
```

#### List Favorites (Paginated)
**GET** `/favorites?take=10&cursor=<id>`

Fetch paginated list of favorites using cursor-based pagination.

**Query Parameters**:
- `take` (default: 20, max: 100) — Number of items to return
- `cursor` (optional) — ID of the last item from previous page for pagination

Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Inception",
      "type": "MOVIE",
      "director": "Christopher Nolan",
      "budget": "$160 million",
      "location": "Various",
      "duration": "148 minutes",
      "yearTime": "2010",
      "description": "A skilled thief...",
      "createdAt": "2025-01-01T12:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z"
    }
  ],
  "nextCursor": 2
}
```

#### Create Favorite
**POST** `/favorites`

Create a new favorite entry.

**Request Body**:
```json
{
  "title": "The Shawshank Redemption",
  "type": "MOVIE",
  "director": "Frank Darabont",
  "budget": "$25 million",
  "location": "Ohio, USA",
  "duration": "142 minutes",
  "yearTime": "1994",
  "description": "Two imprisoned men bond..."
}
```

**Response**: `201 Created`
```json
{
  "id": 2,
  "title": "The Shawshank Redemption",
  "type": "MOVIE",
  "director": "Frank Darabont",
  "budget": "$25 million",
  "location": "Ohio, USA",
  "duration": "142 minutes",
  "yearTime": "1994",
  "description": "Two imprisoned men bond...",
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

#### Update Favorite
**PUT** `/favorites/:id`

Update an existing favorite entry.

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "type": "TV_SHOW",
  "director": "New Director"
}
```

**Response**: `200 OK` with updated object

#### Delete Favorite
**DELETE** `/favorites/:id`

Delete a favorite entry.

**Response**: `204 No Content`

### Validation Rules

All endpoints validate input using Zod schemas. Invalid requests return `400 Bad Request`:

```json
{
  "message": "Validation error",
  "issues": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "path": ["title"],
      "message": "String must contain at least 1 character(s)"
    }
  ]
}
```

**Validation Rules**:
- `title`: Required, min 1 character
- `type`: Required, must be "MOVIE" or "TV_SHOW"
- `director`: Required, min 1 character
- `budget`: Required, min 1 character
- `location`: Required, min 1 character
- `duration`: Required, min 1 character
- `yearTime`: Required, min 1 character
- `description`: Optional

### Error Handling

The API returns appropriate HTTP status codes:

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **204 No Content**: Resource deleted successfully
- **400 Bad Request**: Validation error or invalid input
- **404 Not Found**: Resource not found (Prisma will throw error)
- **500 Internal Server Error**: Unexpected server error

Error responses include a message and optional details:

```json
{
  "message": "Error description",
  "issues": [...]
}
```

### Security

The API includes:
- **CORS**: Enabled for all origins
- **Helmet**: HTTP header security
- **Morgan**: Request logging
- **Validation**: Zod schema validation on all inputs

### Production Deployment

1. **Install dependencies**:
```bash
npm install
```

2. **Generate Prisma client**:
```bash
npm run prisma:generate
```

3. **Run migrations**:
```bash
npm run prisma:migrate
```

4. **Start server**:
```bash
npm run start
```

**Environment Variables** (.env):
```env
DATABASE_URL="mysql://user:password@host:3306/database"
PORT=4000
NODE_ENV=production
```

### Docker Deployment

Build and run in Docker:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate
EXPOSE 4000
CMD ["npm", "run", "start"]
```

### Scripts

- `npm run dev` — Start development server with hot reload (Nodemon)
- `npm run start` — Start production server
- `npm run prisma:generate` — Generate Prisma client
- `npm run prisma:migrate` — Run database migrations
- `npm run prisma:seed` — Seed database with sample data

### Troubleshooting

**Database Connection Issues**:
- Verify MySQL is running (if using MySQL)
- Check `DATABASE_URL` format in `.env`
- Ensure database user has correct permissions
- For SQLite, ensure write permissions in project directory

**Port Already in Use**:
```powershell
# Find process on port 4000
netstat -ano | findstr :4000

# Kill process (replace <PID> with actual PID)
taskkill /PID <PID> /F
```

**Prisma Client Generation Fails**:
- Stop running Node processes
- Delete `.prisma/client` directory
- Run `npm run prisma:generate` again

**Windows Path Issues**:
- The workspace path contains an ampersand (&)
- Use direct Node invocation instead of npm scripts if needed
- Example: `node src/index.js` instead of `npm run dev`

### Notes

- SQLite is recommended for local development (`dev.db` file-based)
- MySQL is recommended for production with better concurrency support
- All timestamps are in UTC and ISO 8601 format
- Pagination uses cursor-based approach (more efficient than offset)
