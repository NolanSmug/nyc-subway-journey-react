import './App.css'
import React, { useEffect, useState } from 'react'
import TransferLines from './components/TransferLines'
import UpcomingStations from './components/UpcomingStations'
import Header from './components/Header'
import ActionButton from './components/ActionButton'
import TrainCar from './components/TrainCar'
import { Station as StationClass } from './logic/StationManager'
import { Game } from './logic/Game'
import { getTransferImageUrls } from './logic/TransferImageMap'
import { Direction, Train } from './logic/TrainManager'
import { GameState } from './logic/GameState'
import GameStateUI from './components/GameStateUI'

import L_MODE from './images/light-mode-icon.svg'
import D_MODE from './images/dark-mode-icon.svg'

function App() {
    const [train, setTrain] = useState<Train | null>(null)
    const [gameState, setGameState] = useState<GameState | null>(null)
    const [isTransferMode, setIsTransferMode] = useState<boolean>(false)
    const [, forceRenderRefresh] = useState(false)
    const [darkMode, setDarkMode] = useState<boolean>(true)

    // dark mode
    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode)
    }, [darkMode])

    // starting the train and game
    useEffect(() => {
        initializeGame()
    }, [])

    // station map smooth-scrolling to the train state current station
    useEffect(() => {
        if (train?.getCurrentStation()) {
            const currentElement = document.querySelector('.current-station')
            if (currentElement) {
                currentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }
        }
    }, [train?.getCurrentStation()])

    const initializeGame = async () => {
        await StationClass.initializeAllStations()

        let newGame = new Game()
        await newGame.runGame()

        setIsTransferMode(false)
        setTrain(newGame.train)
        setGameState(newGame.gameState)
    }

    const handleClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.transfer-lines-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            setIsTransferMode(false)
        }
    }

    if (!train || !gameState) return <>Error</>

    return (
        <div className="Game">
            <div className={`dimmed-overlay ${isTransferMode ? 'active' : ''}`} onClick={handleClickAway} />

            {train && train.getCurrentStation() && train.getLine() && (
                <UpcomingStations
                    stations={train.getScheduledStops()}
                    currentStation={gameState.currentStations[train.getCurrentStationIndex()]}
                    line={train.getLine()}
                />
            )}

            <Header text="Current Line:"></Header>
            <div className={`train ${gameState.isWon ? 'win-state' : ''}`}>
                <TrainCar
                    trainDirection={train.getDirection() == Direction.NULL_DIRECTION ? 'Toggle Direction' : train.getDirectionLabel()}
                    flipDirection={async () => {
                        await train.reverseDirection()
                        forceRenderRefresh((prev) => !prev)
                    }}
                    trainType={`${train.getLineType()} Train`}
                    trainLine={train.getLine()}
                >
                    <div className="not-dim">
                        <TransferLines transfers={getTransferImageUrls(train.getLine())} />
                    </div>
                </TrainCar>
            </div>
            <GameStateUI
                train={train}
                gameState={gameState}
                initializeGame={initializeGame}
                darkMode={darkMode}
                isTransferMode={setIsTransferMode}
                forceRenderRefresh={forceRenderRefresh}
            />
            <ActionButton
                className="dark-mode-toggle-button"
                imageSrc={darkMode ? L_MODE : D_MODE}
                onClick={() => setDarkMode((prev) => !prev)}
            />
        </div>
    )
}

export default App
