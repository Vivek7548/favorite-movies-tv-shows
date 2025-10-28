import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { ChevronDownIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline'

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

const favoriteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['MOVIE', 'TV_SHOW'], { errorMap: () => ({ message: 'Type must be MOVIE or TV_SHOW' }) }),
  director: z.string().min(1, 'Director is required'),
  budget: z.string().min(1, 'Budget is required'),
  location: z.string().min(1, 'Location is required'),
  duration: z.string().min(1, 'Duration is required'),
  yearTime: z.string().min(1, 'Year is required'),
  description: z.string().optional(),
})

type FavoriteFormData = z.infer<typeof favoriteSchema>

const API_BASE = (import.meta as any).VITE_API_BASE || (import.meta as any).VITE_API_URL || 'http://localhost:4000'

function DeleteConfirmModal({ favorite, onConfirm, onCancel, isLoading }: {
  favorite: Favorite
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Favorite?</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to delete <span className="font-medium">{favorite.title}</span>? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

function FavoriteFormModal({ favorite, onSave, onCancel, isLoading }: {
  favorite?: Favorite
  onSave: (data: FavoriteFormData) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FavoriteFormData>({
    resolver: zodResolver(favoriteSchema),
    defaultValues: favorite || {
      type: 'MOVIE',
      description: '',
    },
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 my-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {favorite ? 'Edit Favorite' : 'Add New Favorite'}
        </h3>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="MOVIE">Movie</option>
                <option value="TV_SHOW">TV Show</option>
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
              <input
                {...register('director')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black"
              />
              {errors.director && <p className="text-red-500 text-sm mt-1">{errors.director.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input
                {...register('budget')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black"
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                {...register('location')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                {...register('duration')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black"
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                {...register('yearTime')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black"
              />
              {errors.yearTime && <p className="text-red-500 text-sm mt-1">{errors.yearTime.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-black placeholder:text-black"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (favorite ? 'Updating...' : 'Creating...') : (favorite ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingFavorite, setEditingFavorite] = useState<Favorite | null>(null)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState<Favorite | null>(null)
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadFavorites = useCallback(async (cursor?: number) => {
    try {
      const params = new URLSearchParams({ take: '10' })
      if (cursor) params.append('cursor', cursor.toString())
      const res = await axios.get(`${API_BASE}/favorites?${params}`)
      const newFavorites = res.data.data ?? res.data ?? []
      if (cursor) {
        setFavorites((prev) => [...prev, ...newFavorites])
      } else {
        setFavorites(newFavorites)
      }
      setNextCursor(res.data.nextCursor ?? null)
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Failed to load')
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !isLoadingMore && !loading) {
          setIsLoadingMore(true)
          loadFavorites(nextCursor)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [nextCursor, isLoadingMore, loading, loadFavorites])

  const handleAddClick = () => {
    setEditingFavorite(null)
    setShowFormModal(true)
  }

  const handleEditClick = (favorite: Favorite) => {
    setEditingFavorite(favorite)
    setShowFormModal(true)
  }

  const handleFormSave = async (data: FavoriteFormData) => {
    setIsFormLoading(true)
    try {
      if (editingFavorite) {
        await axios.put(`${API_BASE}/favorites/${editingFavorite.id}`, data)
        setFavorites((prev) =>
          prev.map((f) => (f.id === editingFavorite.id ? { ...f, ...data } : f))
        )
      } else {
        const res = await axios.post(`${API_BASE}/favorites`, data)
        setFavorites((prev) => [res.data, ...prev])
      }
      setShowFormModal(false)
      setEditingFavorite(null)
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.message ?? 'Failed to save')
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleDeleteClick = (favorite: Favorite) => {
    setShowDeleteModal(favorite)
  }

  const handleConfirmDelete = async () => {
    if (!showDeleteModal) return
    setIsDeletingId(showDeleteModal.id)
    try {
      await axios.delete(`${API_BASE}/favorites/${showDeleteModal.id}`)
      setFavorites((prev) => prev.filter((f) => f.id !== showDeleteModal.id))
      setShowDeleteModal(null)
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.message ?? 'Failed to delete')
    } finally {
      setIsDeletingId(null)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Favorite Movies & TV Shows</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5" />
          Add Favorite
        </button>
      </div>

      <ul className="space-y-4">
        {favorites.map((f) => (
          <li
            key={f.id}
            className={`p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              f.type === 'MOVIE' ? 'bg-blue-50' : 'bg-purple-50'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{f.title}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    f.type === 'MOVIE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {f.type === 'MOVIE' ? '🎬 Movie' : '📺 TV Show'}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  Directed by <span className="font-medium">{f.director}</span>
                </div>
                {f.description && (
                  <p className="mt-2 text-gray-600">{f.description}</p>
                )}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">
                    <span className="font-medium">Year:</span> {f.yearTime}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Duration:</span> {f.duration}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Budget:</span> {f.budget}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Location:</span> {f.location}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-col">
                <button
                  onClick={() => handleEditClick(f)}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(f)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {nextCursor && (
        <div ref={observerTarget} className="mt-8 flex justify-center">
          {isLoadingMore && <div className="text-gray-600">Loading more...</div>}
        </div>
      )}

      {showFormModal && (
        <FavoriteFormModal
          favorite={editingFavorite ?? undefined}
          onSave={handleFormSave}
          onCancel={() => {
            setShowFormModal(false)
            setEditingFavorite(null)
          }}
          isLoading={isFormLoading}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          favorite={showDeleteModal}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(null)}
          isLoading={isDeletingId === showDeleteModal.id}
        />
      )}
    </div>
  )
}
