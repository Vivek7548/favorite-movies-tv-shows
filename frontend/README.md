## Favorite Movies - Frontend

A modern React + TypeScript + Vite frontend for managing favorite movies and TV shows. Features a responsive UI with CRUD operations, form validation, and infinite scrolling.

### Overview

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Forms**: react-hook-form with Zod validation
- **HTTP**: Axios
- **Icons**: Heroicons

### Prerequisites

- Node.js v18+ recommended
- npm
- Backend API running on `http://localhost:4000` (configurable)

### Quick Start

1. **Install dependencies**:
```powershell
cd 'f:\Favorite Movies & TV Shows\frontend'
npm install
```

2. **Configure environment** (optional):
Create `.env` file:
```env
VITE_API_BASE=http://localhost:4000
```

3. **Start development server**:
```powershell
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Features

#### Display & Navigation
- **Movie List**: Displays all favorites with color-coded badges (Movies = Blue, TV Shows = Purple)
- **Infinite Scroll**: Automatically loads more items as you scroll to the bottom
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Item Details**: Shows title, type, director, year, duration, budget, location, and description

#### CRUD Operations

**Create**: Click "Add Favorite" button to open form modal
- Opens a form to add a new movie/TV show
- Form validation prevents submission with incomplete data
- Shows real-time validation errors

**Read**: Main list displays all favorites
- Paginated with infinite scroll
- Shows 10 items per page by default
- Auto-loads more when scrolling near bottom

**Update**: Click "Edit" button on any item
- Opens form modal pre-filled with current data
- Modify any fields and save
- Real-time validation feedback

**Delete**: Click "Delete" button on any item
- Shows confirmation modal before deletion
- Prevents accidental data loss
- Updates list immediately after deletion

#### Form Modal

The form modal (`FavoriteFormModal`) provides:
- **All input fields**: Title, Type, Director, Budget, Location, Duration, Year, Description
- **Real-time validation**: Displays error messages as you type
- **Type selection**: Dropdown to choose between MOVIE and TV_SHOW
- **Description field**: Optional textarea for additional notes
- **Loading states**: Shows feedback while submitting
- **Cancel option**: Close modal without changes

#### Delete Confirmation

The delete confirmation modal (`DeleteConfirmModal`):
- Shows the item being deleted
- Requires explicit confirmation
- Shows loading state during deletion
- Prevents accidental loss of data

### Project Structure

```
frontend/
├── src/
│   ├── App.tsx           # Main component with all CRUD logic
│   ├── main.tsx          # React DOM render entry point
│   └── styles.css        # Global styles
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.cjs   # Tailwind CSS configuration
├── postcss.config.cjs    # PostCSS configuration
└── package.json          # Dependencies and scripts
```

### Components

#### App Component (`App.tsx`)

Main component containing:
- **FavoriteFormModal**: Modal form for creating/editing favorites
- **DeleteConfirmModal**: Confirmation dialog for deletion
- **List Display**: Main list of favorite items with action buttons

**State Management**:
- `favorites`: Array of favorite items
- `loading`: Initial page load state
- `isLoadingMore`: Pagination loading state
- `error`: Error messages
- `nextCursor`: For pagination
- `showFormModal`: Form modal visibility
- `editingFavorite`: Currently edited item
- `showDeleteModal`: Delete confirmation visibility

**Key Functions**:
- `loadFavorites()`: Fetch favorites from API
- `handleAddClick()`: Open form for new item
- `handleEditClick()`: Open form for editing
- `handleFormSave()`: Save new or updated item
- `handleDeleteClick()`: Show delete confirmation
- `handleConfirmDelete()`: Confirm and delete item

#### FavoriteFormModal Component

Provides:
- Form fields for all favorite attributes
- Zod-based validation with error display
- Loading states during submission
- Cancel/Save buttons

#### DeleteConfirmModal Component

Provides:
- Confirmation message with item name
- Cancel/Delete buttons
- Loading state feedback

### Data Types

```typescript
type Favorite = {
  id: number
  title: string
  type: 'MOVIE' | 'TV_SHOW'
  director: string
  description?: string
  budget: string
  location: string
  duration: string
  yearTime: string
}

type FavoriteFormData = z.infer<typeof favoriteSchema>
```

### Validation Schema

Uses Zod for runtime type-safe validation:

```typescript
const favoriteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['MOVIE', 'TV_SHOW']),
  director: z.string().min(1, 'Director is required'),
  budget: z.string().min(1, 'Budget is required'),
  location: z.string().min(1, 'Location is required'),
  duration: z.string().min(1, 'Duration is required'),
  yearTime: z.string().min(1, 'Year is required'),
  description: z.string().optional(),
})
```

### API Integration

The frontend communicates with the backend API at:
- Default: `http://localhost:4000`
- Configurable via `VITE_API_BASE` environment variable

**Endpoints used**:
- `GET /favorites?take=10&cursor=<id>` — Fetch favorites with pagination
- `POST /favorites` — Create new favorite
- `PUT /favorites/:id` — Update existing favorite
- `DELETE /favorites/:id` — Delete favorite

### Environment Variables

Create `.env` in the frontend root:

```env
# Backend API URL
VITE_API_BASE=http://localhost:4000
```

Vite automatically loads variables prefixed with `VITE_`.

### Styling

The application uses Tailwind CSS with:
- Responsive grid layouts
- Color coding (Blue for movies, Purple for TV shows)
- Hover effects and transitions
- Mobile-first design
- Custom spacing and typography

### Icons

Uses Heroicons React icons:
- `PlusIcon` — Add button
- `PencilIcon` — Edit button
- `TrashIcon` — Delete button
- `ChevronDownIcon` — Dropdown indicator

### Scripts

- `npm run dev` — Start Vite development server
- `npm run build` — Build for production (generates `dist/`)
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint checks

### Building for Production

```powershell
npm run build
```

This generates optimized static files in the `dist/` directory ready for deployment.

### Troubleshooting

**Backend Connection Errors**:
- Ensure backend is running on `http://localhost:4000`
- Check `VITE_API_BASE` environment variable
- Verify no CORS issues (backend should have CORS enabled)

**Form Won't Submit**:
- Check browser console for validation errors
- Ensure all required fields are filled
- Verify backend is responding to POST/PUT requests

**Infinite Scroll Not Loading**:
- Check network tab for `/favorites` requests
- Ensure `nextCursor` is being returned by backend
- Verify IntersectionObserver is supported (modern browsers)

**Type Errors**:
- Run `npm install` to ensure all dependencies are installed
- Run TypeScript compiler: `npx tsc`

### Performance

- Uses Intersection Observer API for efficient infinite scroll
- Minimal re-renders with proper state management
- Form validation happens client-side to avoid unnecessary requests
- Loading states prevent duplicate submissions

### Notes

- The dev script invokes Vite via Node directly to work around Windows path parsing issues with special characters (ampersand `&`)
- All form submissions include validation feedback
- Deletion is permanent and shows confirmation
- Empty states are handled gracefully with loading/error messages
