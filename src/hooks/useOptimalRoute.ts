import { useEffect, useState } from 'react'
import { fetchOptimalRoute, StationData } from '../logic/RouteUtils'

export function useOptimalRoute(startId: string, destId: string, isHeuristic: boolean, shouldFetch: boolean) {
    const [shortestRoute, setShortestRoute] = useState<StationData[]>([])
    const [heuristicRoute, setHeuristicRoute] = useState<StationData[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const hasShortest = shortestRoute.length > 0
    const hasHeuristic = heuristicRoute.length > 0

    useEffect(() => {
        if (!shouldFetch) return
        if (isHeuristic && hasHeuristic) return
        if (!isHeuristic && hasShortest) return

        const controller = new AbortController()

        const loadRoute = async () => {
            setIsLoading(true)

            try {
                const data = await fetchOptimalRoute(startId, destId, isHeuristic, controller.signal)
                if (isHeuristic) {
                    setHeuristicRoute(data)
                } else {
                    setShortestRoute(data)
                }
            } catch (e: any) {
                if (e.name === 'AbortError') return // why am I using typescript again?
                console.error('Failed to load optimal route', e)
            } finally {
                setIsLoading(false)
            }
        }

        loadRoute()
        return () => controller.abort()
    }, [startId, destId, isHeuristic, shouldFetch, hasShortest, hasHeuristic])

    return {
        routeData: isHeuristic ? heuristicRoute : shortestRoute,
        isLoading,
    }
}
