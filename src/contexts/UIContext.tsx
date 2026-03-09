import React, { useState, ReactNode, useMemo, useCallback } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'

interface UIContextProps {
    isTransferMode: boolean
    setIsTransferMode: React.Dispatch<React.SetStateAction<boolean>>

    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UIContext = createContext<UIContextProps | undefined>(undefined)

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [isTransferMode, setIsTransferMode] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(() => (process.env.REACT_APP_USE_DEV_API === '' ? false : true))

    const toggleTransferMode = useCallback(() => setIsTransferMode((prev) => !prev), [])

    const value = useMemo(
        () => ({
            isTransferMode,
            setIsTransferMode,
            isModalOpen,
            setIsModalOpen,
            toggleTransferMode,
        }),
        [isTransferMode, isModalOpen, toggleTransferMode]
    )

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export const useUIContext = <T,>(selector: (state: UIContextProps) => T): T => {
    const context = useContextSelector(UIContext, (state) => {
        if (state === undefined) {
            throw new Error('useUIContext must be used within a UIProvider')
        }
        return selector(state)
    })

    return context
}
