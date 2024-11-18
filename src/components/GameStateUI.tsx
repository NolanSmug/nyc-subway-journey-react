import { GameState } from '../logic/GameState'
import { Train } from '../logic/TrainManager'
import { LineName } from '../logic/Line'
import { getTransferImageUrls } from '../logic/TransferImageMap'
import ActionButton from './ActionButton'
import './GameStateUI.css'
import Header from './Header'
import Station from './Station'
import TransferLines from './TransferLines'

import R_ARROW_BLACK from '../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../images/right-arrow-w.svg'
import TRANSFER_WHITE from '../images/transfer-icon-w.svg'
import TRANSFER_BLACK from '../images/transfer-icon-b.svg'
import C_DIRECTION_WHITE from '../images/change-direction-icon-w.svg'
import C_DIRECTION_BLACK from '../images/change-direction-icon-b.svg'
import REFRESH_BLACK from '../images/refresh-icon-b.svg'
import REFRESH_WHITE from '../images/refresh-icon-w.svg'
import { useEffect, useMemo } from 'react'
import { useUIContext } from '../contexts/UIContext'
import { lineToLineColor } from './UpcomingStations'

interface GameStateUIProps {
    train: Train
    gameState: GameState
    initializeGame: () => Promise<void>
}

function GameStateUI({ train, gameState, initializeGame }: GameStateUIProps) {
    const { darkMode, setIsTransferMode, setCurrentLineColor, forceRenderRefresh } = useUIContext()
    const handleTrainAction = async (action: 'transfer' | 'changeDirection' | 'advanceStation' | 'refresh') => {
        if (gameState?.isWon || train === null || gameState === null) return
        if (action !== 'transfer') setIsTransferMode(false)

        setCurrentLineColor(lineToLineColor(train.getLine()))

        switch (action) {
            case 'refresh':
                await initializeGame()
                break

            case 'advanceStation':
                await train.advanceStation()
                forceRenderRefresh()

                const winState = await gameState.checkWin(train.getCurrentStation())
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
                await train.reverseDirection()
                forceRenderRefresh()
                break
            default:
        }
    }

    const getTransferLineClicked = async (transferIndex: number): Promise<void> => {
        const transfers = train.getCurrentStation().getTransfers()
        const selectedLine = transfers[transferIndex]

        if (selectedLine !== undefined) {
            await transferLines(selectedLine)
        }
    }

    const transferLines = async (selectedLine: LineName): Promise<void> => {
        if (train == null) return

        if (await train.transferToLine(selectedLine, train.getCurrentStation())) {
            train.setLine(selectedLine)
            train.setLineType()
            train.setCurrentStation(train.getCurrentStation())

            await train.updateTrainState()
        }
        forceRenderRefresh()
        setIsTransferMode(false)
        setCurrentLineColor(lineToLineColor(selectedLine))
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        const actions: { [key: string]: () => void } = {
            t: () => handleTrainAction('transfer'),
            c: () => handleTrainAction('changeDirection'),
            r: () => handleTrainAction('refresh'),
            ArrowRight: () => handleTrainAction('advanceStation'),
            Escape: () => setIsTransferMode(false),
        }
        actions[event.key]?.()
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    })

    return (
        <div className="stations-container">
            <div className="station-box" id="current-station">
                <Header text="Current Station" />
                <div className="station-item">
                    <Station name={train.getScheduledStops()[train.getCurrentStationIndex()].getName()}>
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

            <div className="station-box blanket" id="destination-station">
                <Header text="Destination Station" />
                <div className="station-item">
                    <Station name={gameState.destinationStation.getName()}>
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
    )
}

export default GameStateUI
