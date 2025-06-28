import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { UIProvider } from './contexts/UIContext'
import { GameProvider } from './contexts/GameContext'
import { SettingsProvider } from './contexts/SettingsContext'

import useBrowserCSS from './hooks/useBrowserCSS'

const root = ReactDOM.createRoot(document.getElementById('root')!)

document.body.classList.add(useBrowserCSS())

root.render(
    <UIProvider>
        <GameProvider>
            <SettingsProvider>
                {/* <React.StrictMode> */}
                <App />
                {/* </React.StrictMode> */}
            </SettingsProvider>
        </GameProvider>
    </UIProvider>
)
