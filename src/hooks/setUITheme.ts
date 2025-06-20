import { useEffect } from 'react'

export default function setUITheme(darkMode: boolean) {
    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode)
    }, [darkMode])
}
