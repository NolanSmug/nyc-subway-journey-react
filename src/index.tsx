import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { UIProvider } from './contexts/UIContext'
import { GameStateProvider } from './contexts/GameStateContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { TrainProvider } from './contexts/TrainContext'

import useBrowserCSS from './hooks/useBrowserCSS'

const root = ReactDOM.createRoot(document.getElementById('root')!)

document.body.classList.add(useBrowserCSS())

root.render(
    <UIProvider>
        <GameStateProvider>
            <SettingsProvider>
                <TrainProvider>
                    <App />
                </TrainProvider>
            </SettingsProvider>
        </GameStateProvider>
    </UIProvider>
)
