import './index.css' // (CSS > React)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { UIProvider } from './contexts/UIContext'
import { GameStateProvider } from './contexts/GameStateContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { TrainProvider } from './contexts/TrainContext'

const root = ReactDOM.createRoot(document.getElementById('root')!)

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
