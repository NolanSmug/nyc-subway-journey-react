import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { UIProvider } from './contexts/UIContext'
import { GameProvider } from './contexts/GameContext'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
    <React.StrictMode>
        <UIProvider>
            <GameProvider>
                <App />
            </GameProvider>
        </UIProvider>
    </React.StrictMode>
)
