import { useState, useEffect, useCallback, useRef } from 'react'

interface UseAsyncLoaderOptions<T> {
  loader: () => T
  onError?: (error: Error) => void
  deps?: React.DependencyList
  immediate?: boolean
}

interface UseAsyncLoaderReturn<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  reload: () => void
  setData: (data: T | null) => void
}

export function useAsyncLoader<T>({
  loader,
  onError,
  deps = [],
  immediate = true,
}: UseAsyncLoaderOptions<T>): UseAsyncLoaderReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(immediate)
  const [error, setError] = useState<Error | null>(null)

  const loaderRef = useRef(loader)
  const onErrorRef = useRef(onError)
  const loadRef = useRef<(() => void) | null>(null)

  loaderRef.current = loader
  onErrorRef.current = onError

  const loadData = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)
      const result = loaderRef.current()
      setData(result)
    } catch (err) {
      const error = err as Error
      console.error('Error loading data:', error)
      setError(error)
      onErrorRef.current?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  loadRef.current = loadData

  useEffect(
    () => {
      if (immediate) {
        loadData()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [immediate, ...deps]
  )

  const reload = useCallback(() => {
    loadRef.current?.()
  }, [])

  return { data, isLoading, error, reload, setData }
}
