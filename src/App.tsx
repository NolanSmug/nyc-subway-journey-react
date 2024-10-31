import './App.css'
import React, { useEffect, useState } from 'react'
import TransferLines from './components/TransferLines'
import Station from './components/Station'
import UpcomingStations from './components/UpcomingStations'
import Header from './components/Header'
import ActionButton from './components/ActionButton'
import TrainCar from './components/TrainCar'
import { Station as StationClass } from './logic/StationManager'
import { Game } from './logic/Game'
import { getTransferImageUrls } from './logic/TransferImageMap'
import { LineName } from './logic/Line'
import { Train } from './logic/TrainManager'
import { GameState } from './logic/GameState'

import R_ARROW_BLACK from './images/right-arrow-b.svg'
import R_ARROW_WHITE from './images/right-arrow-w.svg'
import L_MODE from './images/light-mode-icon.svg'
import D_MODE from './images/dark-mode-icon.svg'
import TRANSFER_WHITE from './images/transfer-icon-w.svg'
import TRANSFER_BLACK from './images/transfer-icon-b.svg'
import C_DIRECTION_WHITE from './images/change-direction-icon-w.svg'
import C_DIRECTION_BLACK from './images/change-direction-icon-b.svg'
import REFRESH_BLACK from './images/refresh-icon-b.svg'
import REFRESH_WHITE from './images/refresh-icon-w.svg'

function App() {
    const [darkMode, setDarkMode] = useState<boolean>(true)
    const [train, setTrain] = useState<Train | null>(null)
    const [gameState, setGameState] = useState<GameState | null>(null)
    const [isTransferMode, setIsTransferMode] = useState<boolean>(false)
    const [, forceRenderRefresh] = useState(false)

    // dark mode
    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode)
    }, [darkMode])

    const initializeGame = async () => {
        await StationClass.initializeAllStations()

        let newGame = new Game()
        await newGame.runGame()

        setIsTransferMode(false)
        setTrain(newGame.train)
        setGameState(newGame.gameState)
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        const actions: { [key: string]: () => void } = {
            t: () => handleTrainAction('transfer'),
            c: () => handleTrainAction('changeDirection'),
            r: () => handleTrainAction('refresh'),
            Enter: () => handleTrainAction('advanceStation'),
            Escape: () => setIsTransferMode(false),
            d: () => setDarkMode((prev) => !prev),
        }
        actions[event.key]?.()
    }

    const handleClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.transfer-lines-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            setIsTransferMode(false)
        }
    }

    const handleTrainAction = async (action: 'transfer' | 'changeDirection' | 'advanceStation' | 'refresh') => {
        if (gameState?.isWon) return
        if (action != 'transfer') setIsTransferMode(false)

        switch (action) {
            case 'refresh':
                initializeGame()
                break

            case 'advanceStation':
                await train?.advanceStation()
                forceRenderRefresh((prev) => !prev)

                const winState = await gameState?.checkWin(train?.getCurrentStation() as StationClass)
                if (winState) {
                    setTimeout(() => {
                        initializeGame()
                    }, 5000)
                }
                break

            case 'transfer':
                setIsTransferMode(true)
                break

            case 'changeDirection':
                await train?.reverseDirection()
                forceRenderRefresh((prev) => !prev)
                break
            default:
        }
    }

    const getTransferLineClicked = async (transferIndex: number): Promise<void> => {
        const transfers = train?.getCurrentStation().getTransfers()
        const selectedLine = transfers?.[transferIndex]

        if (selectedLine !== undefined) {
            await transferLines(selectedLine)
        }
    }

    const transferLines = async (selectedLine: LineName): Promise<void> => {
        if (await train?.transferToLine(selectedLine, train?.getCurrentStation())) {
            train?.setLine(selectedLine)
            train?.setLineType()
            train?.setCurrentStation(train.getCurrentStation() as StationClass)

            await train?.updateTrainState()
        }

        forceRenderRefresh((prev) => !prev)
        setIsTransferMode(false)
    }

    // starting the train and game
    useEffect(() => {
        initializeGame()
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    })

    useEffect(() => {
        if (train?.getCurrentStation()) {
            const currentElement = document.querySelector('.current-station')
            if (currentElement) {
                currentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }
        }
    }, [train?.getCurrentStation()])

    if (train && gameState) {
        return (
            <div className="Game">
                <div className={`dimmed-overlay ${isTransferMode ? 'active' : ''}`} onClick={handleClickAway} />

                <div className="upcoming-stations">
                    {train && train.getCurrentStation() && train.getLine() && (
                        <UpcomingStations
                            stations={train.getScheduledStops()}
                            currentStation={gameState.currentStations[train.getCurrentStationIndex()]}
                            line={train.getLine()}
                        />
                    )}
                </div>

                <Header text="Current Line:"></Header>
                <div className={`train ${gameState.isWon ? 'win-state' : ''}`}>
                    <TrainCar trainDirection={train.getDirectionLabel()} trainType={train.getLineType() + ' Train'}>
                        <div className="not-dim">
                            <TransferLines transfers={getTransferImageUrls(train.getLine())} />
                        </div>
                    </TrainCar>
                </div>
                <div className="stations-container">
                    <div className="station-box" id="current-station">
                        <Header text="Current Station" />
                        <div className="station-item">
                            <Station
                                name={
                                    train.getScheduledStops()[train.getCurrentStationIndex() || 0].getName() || 'Loading...'
                                }
                            >
                                <div className="not-dim">
                                    <TransferLines
                                        onClick={getTransferLineClicked}
                                        transfers={getTransferImageUrls(train.getCurrentStation())}
                                    />
                                </div>
                            </Station>
                        </div>
                        <div className="action-buttons-container not-dim" id="starting-station">
                            <ActionButton
                                imageSrc={darkMode ? TRANSFER_WHITE : TRANSFER_BLACK}
                                label="Transfer Lines"
                                onClick={() => handleTrainAction('transfer')}
                            />
                            <ActionButton
                                imageSrc={darkMode ? C_DIRECTION_WHITE : C_DIRECTION_BLACK}
                                label="Change Direction"
                                onClick={() => handleTrainAction('changeDirection')}
                            />
                            <ActionButton
                                imageSrc={darkMode ? R_ARROW_WHITE : R_ARROW_BLACK}
                                label="Advance Station"
                                onClick={() => handleTrainAction('advanceStation')}
                            />
                        </div>
                    </div>

                    <div className="station-box blanket">
                        <Header text="Destination Station" />
                        <div id="destination-station" className="station-item">
                            <Station name={gameState.destinationStation.getName() || 'Loading...'}>
                                <TransferLines transfers={getTransferImageUrls(gameState.destinationStation)} />
                            </Station>
                        </div>
                        {gameState?.isFirstTurn && (
                            <div className="action-buttons-container" id="destination-station">
                                <ActionButton
                                    imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK}
                                    label="Reset Game"
                                    onClick={() => handleTrainAction('refresh')}
                                />
                            </div>
                        )}
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
}

export default App
