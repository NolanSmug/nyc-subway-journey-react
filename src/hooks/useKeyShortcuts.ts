import { useEffect, useLayoutEffect, useRef } from 'react'

type ShortcutConfig = {
    comboKeys?: Record<string, () => void>
    singleKeys?: Record<string, () => void>
    enabled?: boolean
}

export default function useKeyShortcuts({ comboKeys = {}, singleKeys = {}, enabled = true }: ShortcutConfig) {
    const keyHandlersRef = useRef({ comboKeys, singleKeys })

    useLayoutEffect(() => {
        keyHandlersRef.current = { comboKeys, singleKeys }
    }, [comboKeys, singleKeys])

    useEffect(() => {
        if (!enabled) return

        const handler = (event: KeyboardEvent) => {
            if (document.activeElement instanceof HTMLInputElement) return

            const { comboKeys, singleKeys } = keyHandlersRef.current
            const keyCombo = `${event.shiftKey ? 'Shift+' : ''}${event.key}`

            if (comboKeys[keyCombo]) {
                event.preventDefault()
                comboKeys[keyCombo]()
                return
            }

            singleKeys[event.key]?.()
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [enabled])
}
