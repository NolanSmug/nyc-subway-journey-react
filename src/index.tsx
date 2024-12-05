import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { UIProvider } from './contexts/UIContext'
import { GameProvider } from './contexts/GameContext'
import { SettingsProvider } from './contexts/SettingsContext'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
    <React.StrictMode>
        <UIProvider>
            <GameProvider>
                <SettingsProvider>
                    <App />
                </SettingsProvider>
            </GameProvider>
        </UIProvider>
    </React.StrictMode>
)
