# Favorite Movies & TV Shows

A full-stack application for managing your favorite movies and TV shows. Built with Express.js backend, React/TypeScript frontend, and MySQL database.

## Project Structure

```
├── backend/                 # Express.js API server
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   └── index.js        # Main API server
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   └── App.tsx         # Main React application
│   └── package.json
└── README.md               # This file
```

## Features

- **CRUD Operations**: Add, edit, and delete favorite movies/TV shows
- **Form Validation**: Real-time validation using Zod
- **Confirmation Modals**: Delete confirmations to prevent accidental data loss
- **Infinite Scroll**: Automatically load more items as you scroll
- **Responsive Design**: Tailwind CSS for mobile-friendly UI
- **Type Safe**: Full TypeScript support on both frontend and backend
- **Modern Stack**: React hooks, react-hook-form, Prisma ORM

## Database Schema

The application uses a single `Favorite` model with the following fields:

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

**Fields**:
- **title**: Name of the movie or TV show
- **type**: Either "MOVIE" or "TV_SHOW"
- **director**: Director/creator name
- **budget**: Budget information
- **location**: Filming location
- **duration**: Runtime/episode length
- **yearTime**: Release year or date
- **description**: Optional detailed description
- **createdAt**: Automatic timestamp when created
- **updatedAt**: Automatic timestamp when updated

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- MySQL Server (or SQLite for local development)
- PowerShell (for running dev scripts on Windows)

### Backend Setup

1. Navigate to the backend directory:
```powershell
cd backend
npm install
```

2. Configure environment variables. Create/edit `.env`:
```env
# SQLite (default for development)
DATABASE_URL="file:./dev.db"
PORT=4000

# OR MySQL
# DATABASE_URL="mysql://user:password@localhost:3306/favorites"
# PORT=4000
```

3. Set up the database:
```powershell
# Generate Prisma client
npm run prisma:generate

# Apply schema to database
npm run prisma:migrate

# Seed sample data (optional)
npm run prisma:seed
```

4. Start the development server:
```powershell
npm run dev
```

The API will be available at `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:
```powershell
cd frontend
npm install
```

2. Configure environment variables. Create/edit `.env`:
```env
VITE_API_BASE=http://localhost:4000
```

3. Start the development server:
```powershell
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Run Both Servers Together

From the root directory:
```powershell
npm run dev
```

To stop both servers:
```powershell
npm run dev:stop
```

## API Endpoints

All endpoints expect and return JSON.

### Get Favorites (Paginated)

**GET** `/favorites?take=10&cursor=<id>`

Query Parameters:
- `take` (default: 20, max: 100) — Number of items per page
- `cursor` (optional) — ID of the last item from the previous page

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
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "nextCursor": 2
}
```

### Get Health Check

**GET** `/health`

Response:
```json
{ "status": "ok" }
```

### Create Favorite

**POST** `/favorites`

Body:
```json
{
  "title": "The Shawshank Redemption",
  "type": "MOVIE",
  "director": "Frank Darabont",
  "budget": "$25 million",
  "location": "Ohio, USA",
  "duration": "142 minutes",
  "yearTime": "1994",
  "description": "Two imprisoned men..."
}
```

Response: Created favorite object with auto-generated `id`

### Update Favorite

**PUT** `/favorites/:id`

Body: Same structure as Create (all fields optional)

Response: Updated favorite object

### Delete Favorite

**DELETE** `/favorites/:id`

Response: 204 No Content

## Validation Rules

All form fields are validated on both client and server:

- **title**: Required, minimum 1 character
- **type**: Required, must be "MOVIE" or "TV_SHOW"
- **director**: Required, minimum 1 character
- **budget**: Required, minimum 1 character
- **location**: Required, minimum 1 character
- **duration**: Required, minimum 1 character
- **yearTime**: Required, minimum 1 character
- **description**: Optional

## Deployment

### Environment Variables

Create a `.env` file in the root of backend/ with:

```env
DATABASE_URL="mysql://user:password@hostname:3306/database_name"
PORT=4000
NODE_ENV=production
```

### Deploy Backend

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma client and apply migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

3. Start the server:
```bash
npm run start
```

### Deploy Frontend

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting provider (Vercel, Netlify, etc.)

3. Configure API endpoint in your environment or build configuration:
```env
VITE_API_BASE=https://your-api-domain.com
```

### Using Docker (Optional)

You can containerize both services:

**Backend Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run prisma:generate
EXPOSE 4000
CMD ["npm", "run", "start"]
```

**Frontend Dockerfile**:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## Development Notes

- On Windows, the workspace path may contain special characters. Build scripts are configured to work around this by invoking Node directly instead of relying on shell parsing.
- For local development, SQLite is the default database. For production, use MySQL.
- The frontend uses Tailwind CSS for styling and Heroicons for icons.
- Forms are managed with react-hook-form and validated with Zod for type-safe validation.
- Data fetching uses Axios for HTTP requests.

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
1. Verify MySQL is running (if using MySQL)
2. Check `DATABASE_URL` in `.env` matches your setup
3. Ensure database user has proper permissions

### CORS Errors

If the frontend can't reach the backend:
1. Verify `VITE_API_BASE` points to correct backend URL
2. Check backend CORS is enabled (it is by default)
3. Ensure backend is running on the expected port

### Port Already in Use

If ports 4000 or 5173 are in use:
1. Change `PORT` in backend `.env`
2. Use `npm run dev -- --port 5174` for frontend

## Deployment

Ready to go live? See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Uploading to GitHub
- Deploying backend to Render/Railway
- Deploying frontend to Vercel/Netlify
- Database setup in production
- Troubleshooting guide

## Demo Credentials

**No authentication required** - This is a public demo application.

All data is stored in the MySQL database. Default seed data includes:
- Inception (Movie)
- Breaking Bad (TV Show)

Run `npm run prisma:seed` to reset with sample data.

## License

MIT
