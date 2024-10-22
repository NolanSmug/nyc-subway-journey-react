import React, { useEffect, useState } from 'react'
import './App.css'
import TransferLines from './components/TransferLines'
import Station from './components/Station'
import Header from './components/Header'
import ActionButton from './components/ActionButton'
import TrainCar from './components/TrainCar'
import { Station as StationClass } from './logic/StationManager'
import { Game } from './logic/Game'
import { getTransferImages } from './logic/TransferImageMap'
import { LineName } from './logic/Line'

import R_ARROW_BLACK from './images/right-arrow-b.svg'
import R_ARROW_WHITE from './images/right-arrow-w.svg'
import L_MODE from './images/light-mode-icon.svg'
import D_MODE from './images/dark-mode-icon.svg'
import TRANSFER_WHITE from './images/transfer-icon-w.svg'
import TRANSFER_BLACK from './images/transfer-icon-b.svg'
import C_DIRECTION_WHITE from './images/change-direction-icon-w.svg'
import C_DIRECTION_BLACK from './images/change-direction-icon-b.svg'

function App() {
    const [darkMode, setDarkMode] = useState<boolean>(false)
    let [currentStation, setCurrentStation] = useState<StationClass | null>(null)
    let [destinationStation, setDestinationStation] = useState<StationClass | null>(null)
    const [game, setGame] = useState<Game | null>(null)

    // starting the train and game
    useEffect(() => {
        const initializeGame = async () => {
            await StationClass.initializeAllStations()
            let newGame = new Game()
            await newGame.runGame()
            setGame(newGame)
            setCurrentStation(newGame.train.getCurrentStation() as StationClass)
            setDestinationStation(newGame.gameState.destinationStation as StationClass)
        }
        initializeGame()
    }, [])

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode)
    }, [darkMode])

    const handleAction = (action: 'transfer' | 'changeDirection' | 'advanceStation') => {
        console.log(`${action} button clicked`)
        switch (
            action
            // cases
        ) {
        }
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        const actions: { [key: string]: () => void } = {
            t: () => handleAction('transfer'),
            c: () => handleAction('changeDirection'),
            ArrowRight: () => handleAction('advanceStation'),
            d: () => setDarkMode((prev) => !prev),
        }
        actions[event.key]?.()
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    })

    const getTransferImageUrls = (input: StationClass | LineName | null | undefined): string[] => {
        if (!input) return []

        if (input instanceof StationClass) {
            return getTransferImages(input.getTransfers() as LineName[])
        }

        if (typeof input === 'string') {
            return getTransferImages([input as LineName])
        }

        return []
    }

    return (
        <div className="Game">
            <Header text="Current Line:"></Header>
            <TrainCar name={game?.train.getUptownLabel()} altName={game?.train.getLineType() + ' Train'}>
                <TransferLines transfers={getTransferImageUrls(game?.train.getLineName())} />
            </TrainCar>
            <div className="stations-container">
                <div className="station-box" id="current-station">
                    <Header text="Current Station" />
                    <div className="station-item">
                        <Station name={currentStation?.getName() || 'Loading...'}>
                            <TransferLines transfers={getTransferImageUrls(currentStation)} />
                        </Station>
                    </div>
                    <div className="action-buttons-container">
                        <ActionButton
                            imageSrc={darkMode ? TRANSFER_WHITE : TRANSFER_BLACK}
                            label="Transfer Lines"
                            onClick={() => handleAction('transfer')}
                        />
                        <ActionButton
                            imageSrc={darkMode ? C_DIRECTION_WHITE : C_DIRECTION_BLACK}
                            label="Change Direction"
                            onClick={() => handleAction('changeDirection')}
                        />
                        <ActionButton
                            imageSrc={darkMode ? R_ARROW_WHITE : R_ARROW_BLACK}
                            label="Advance Station"
                            onClick={() => handleAction('advanceStation')}
                        />
                    </div>
                </div>

                <div className="station-box" id="destination-station">
                    <Header text="Destination Station" />
                    <div className="station-item">
                        <Station name={destinationStation?.getName() || 'Loading...'}>
                            <TransferLines transfers={getTransferImageUrls(destinationStation)} />
                        </Station>
                    </div>
                </div>
            </div>
            <ActionButton
                className="dark-mode-toggle-button"
                imageSrc={darkMode ? L_MODE : D_MODE}
                onClick={() => setDarkMode((prev) => !prev)}
            />
        </div>
    )
}

export default App
