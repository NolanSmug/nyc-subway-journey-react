import './App.css'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TransferLines from './components/TransferLines'
import UpcomingStations from './components/UpcomingStations'
import Header from './components/Header'
import TrainCar from './components/TrainCar'
import GameStateUI from './components/GameStateUI'
import SettingsUmbrella from './components/SettingsUmbrella'

import { Station as StationClass } from './logic/StationManager'
import { Game } from './logic/Game'
import { Direction, Train } from './logic/TrainManager'
import { GameState } from './logic/GameState'
import { getTransferImageUrls } from './logic/TransferImageMap'
import { useUIContext } from './contexts/UIContext'

function App() {
    const [train, setTrain] = useState<Train | null>(null)
    const [gameState, setGameState] = useState<GameState | null>(null)
    const { isTransferMode, setIsTransferMode, upcomingStationsVisible } = useUIContext()
    const transferImages = useMemo(() => getTransferImageUrls(train?.getLine()), [train?.getLine()])

    const initializeGame = useCallback(async () => {
        await StationClass.initializeAllStations()
        let newGame = new Game()
        await newGame.runGame()

        setIsTransferMode(false)
        setTrain(newGame.train)
        setGameState(newGame.gameState)
    }, [setIsTransferMode, setTrain, setGameState])

    const handleClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.transfer-lines-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            setIsTransferMode(false)
        }
    }

    // starting the train and game
    useEffect(() => {
        initializeGame()
    }, [initializeGame])

    // station map smooth-scrolling to the train state current station
    useEffect(() => {
        if (train?.getCurrentStation()) {
            const currentElement = document.querySelector('.current-station')
            if (currentElement) {
                currentElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' })
            }
        }
    }, [train])

    if (!train || !gameState) return <>Error</>

    return (
        <div className="Game">
            <div className={`dimmed-overlay ${isTransferMode ? 'active' : ''}`} onClick={handleClickAway} />

            <UpcomingStations
                stations={train.getScheduledStops()}
                currentStation={gameState.currentStations[train.getCurrentStationIndex()]}
                line={train.getLine()}
                visible={upcomingStationsVisible}
            />

            <Header text="Current Line:"></Header>
            <div className={`train ${gameState.isWon ? 'win-state' : ''}`}>
                <TrainCar
                    train={train}
                    flipDirection={async () => {
                        await train.reverseDirection()
                    }}
                >
                    <TransferLines transfers={transferImages} notDim />
                </TrainCar>
            </div>

            <GameStateUI train={train} gameState={gameState} initializeGame={initializeGame} />

            <SettingsUmbrella />
        </div>
    )
}

export default App
