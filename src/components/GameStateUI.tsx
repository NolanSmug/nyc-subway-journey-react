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
import { useEffect } from 'react'

interface GameStateUIProps {
    train: Train
    gameState: GameState
    initializeGame: () => Promise<void>
    darkMode: boolean
    isTransferMode: React.Dispatch<React.SetStateAction<boolean>>
    forceRenderRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

function GameStateUI({ train, gameState, initializeGame, darkMode, isTransferMode, forceRenderRefresh }: GameStateUIProps) {
    const handleTrainAction = async (action: 'transfer' | 'changeDirection' | 'advanceStation' | 'refresh') => {
        if (gameState?.isWon || train === null || gameState === null) return
        if (action !== 'transfer') isTransferMode(false)

        switch (action) {
            case 'refresh':
                await initializeGame()
                break

            case 'advanceStation':
                await train.advanceStation()
                forceRenderRefresh((prev) => !prev)

                const winState = await gameState?.checkWin(train.getCurrentStation())
                if (winState) {
                    setTimeout(() => {
                        initializeGame()
                    }, 5000)
                }
                break

            case 'transfer':
                isTransferMode(true)
                break

            case 'changeDirection':
                await train.reverseDirection()
                forceRenderRefresh((prev) => !prev)
                break
            default:
        }
    }

    const getTransferLineClicked = async (transferIndex: number): Promise<void> => {
        const transfers = train.getCurrentStation().getTransfers()
        const selectedLine = transfers?.[transferIndex]

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
        forceRenderRefresh((prev: any) => !prev)
        isTransferMode(false)
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        const actions: { [key: string]: () => void } = {
            t: () => handleTrainAction('transfer'),
            c: () => handleTrainAction('changeDirection'),
            r: () => handleTrainAction('refresh'),
            Enter: () => handleTrainAction('advanceStation'),
            Escape: () => isTransferMode(false),
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

            <div className="station-box blanket">
                <Header text="Destination Station" />
                <div id="destination-station" className="station-item">
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
