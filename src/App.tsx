import './App.css'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TransferLines from './components/TransferLines'
import UpcomingStations from './components/UpcomingStations'
import Header from './components/Header'
import TrainCar from './components/TrainCar'
import GameStateUI from './components/GameStateUI'
import SettingsUmbrella from './components/SettingsUmbrella'
import UpcomingStationsVertical from './components/UpcomingStationsVertical'

import { Station as StationClass } from './logic/StationManager'
import { Game } from './logic/Game'
import { Train } from './logic/TrainManager'
import { GameState } from './logic/GameState'
import { getTransferImageUrls } from './logic/TransferImageMap'
import { useUIContext } from './contexts/UIContext'

function App() {
    const [train, setTrain] = useState<Train | null>(null)
    const [gameState, setGameState] = useState<GameState | null>(null)
    const { isTransferMode, setIsTransferMode, upcomingStationsVisible, upcomingStationsVertical } = useUIContext()

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

    const line = train?.getLine()
    const transferImages = useMemo(() => getTransferImageUrls(line), [line])

    if (!train || !gameState) return <>Error</>

    return (
        <>
            <div className="Game">
                <div className={`dimmed-overlay ${isTransferMode ? 'active' : ''}`} onClick={handleClickAway} />

                {!upcomingStationsVertical && (
                    <UpcomingStations
                        stations={train.getScheduledStops()}
                        currentStation={gameState.currentStations[train.getCurrentStationIndex()]}
                        line={train.getLine()}
                        direction={train.getDirection()}
                        visible={upcomingStationsVisible}
                    />
                )}

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
            {upcomingStationsVertical && (
                <div className="upcoming-stations-vertical">
                    <UpcomingStationsVertical
                        stations={train.getScheduledStops()}
                        currentStation={gameState.currentStations[train.getCurrentStationIndex()]}
                        line={train.getLine()}
                        direction={train.getDirection()}
                        visible={upcomingStationsVisible}
                    />
                </div>
            )}
        </>
    )
}

export default App
