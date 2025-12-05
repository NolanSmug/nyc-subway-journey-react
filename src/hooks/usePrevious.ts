import { useRef, useEffect } from 'react'

// returns the value of a variable from the previous render.
// https://davidwalsh.name/react-useprevious-hook
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>()
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}
