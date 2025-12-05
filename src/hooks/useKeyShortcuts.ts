import { useEffect } from 'react'

type ShortcutConfig = {
    comboKeys?: Record<string, () => void>
    singleKeys?: Record<string, () => void>
    enabled?: boolean
}

export default function useKeyShortcuts({ comboKeys = {}, singleKeys = {}, enabled = true }: ShortcutConfig) {
    useEffect(() => {
        if (!enabled) return

        const handler = (event: KeyboardEvent) => {
            if (document.activeElement instanceof HTMLInputElement) return

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
    }, [comboKeys, singleKeys, enabled])
}
