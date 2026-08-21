import { useState, ReactNode, useMemo } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
import { useMediaQuery } from '../hooks/useMediaQuery'

interface UIContextProps {
    isTransferMode: boolean
    setIsTransferMode: React.Dispatch<React.SetStateAction<boolean>>
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    isMobile: boolean
}

const UIContext = createContext<UIContextProps | undefined>(undefined)

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [isTransferMode, setIsTransferMode] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(() => (process.env.REACT_APP_USE_DEV_API === 'true' ? false : true))

    const isMobile = useMediaQuery('(max-width: 768px)')

    const value = useMemo(
        () => ({
            isTransferMode,
            setIsTransferMode,
            isModalOpen,
            setIsModalOpen,
            isMobile,
        }),
        [isTransferMode, isModalOpen, isMobile]
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
