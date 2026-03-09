import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { UIProvider } from './contexts/UIContext'
import { GameStateProvider } from './contexts/GameStateContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { TrainProvider } from './contexts/TrainContext'

import getBrowserType from './logic/browser'

const root = ReactDOM.createRoot(document.getElementById('root')!)

document.body.classList.add(getBrowserType())

root.render(
    <UIProvider>
        <SettingsProvider>
            <GameStateProvider>
                <TrainProvider>
                    <App />
                </TrainProvider>
            </GameStateProvider>
        </SettingsProvider>
    </UIProvider>
)
