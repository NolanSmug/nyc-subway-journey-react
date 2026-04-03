import './index.css' // (CSS > React)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { UIProvider } from './contexts/UIContext'
import { JourneyProvider } from './contexts/JourneyContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { TrainProvider } from './contexts/TrainContext'

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
    <UIProvider>
        <SettingsProvider>
            <JourneyProvider>
                <TrainProvider>
                    <App />
                </TrainProvider>
            </JourneyProvider>
        </SettingsProvider>
    </UIProvider>
)
