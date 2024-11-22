import './GameStateUI.css'
import { LineName } from '../logic/Line'
import { getTransferImageSvg } from '../logic/TransferImageMap'
import ActionButton from './ActionButton'
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
import { useGameContext } from '../contexts/GameContext'

function GameStateUI() {
    const { darkMode, setIsTransferMode, numAdvanceStations, advancedMode } = useUIContext()
    const { train, updateTrainObject, gameState, initializeGame } = useGameContext()
    const currentStation = train.getCurrentStation()

    const handleTrainAction = async (action: 'transfer' | 'changeDirection' | 'advanceStation' | 'refresh') => {
        if (gameState.isWon || train === null || gameState === null) return
        if (action !== 'transfer') setIsTransferMode(false)

        switch (action) {
            case 'refresh':
                await initializeGame()
                break

            case 'advanceStation':
                if (numAdvanceStations > 1) {
                    updateTrainObject({ ...train.advanceStationInc(numAdvanceStations) })
                } else {
                    updateTrainObject({ ...train.advanceStation() })
                }

                const winState = await gameState.checkWin(currentStation)
                if (winState) {
                    setTimeout(() => {
                        initializeGame()
                    }, 4000)
                }
                break

            case 'transfer':
                setIsTransferMode(true)
                break

            case 'changeDirection':
                updateTrainObject({ ...train.reverseDirection() })
                break
            default:
                return
        }
    }

    const getTransferLineClicked = async (transferIndex: number): Promise<void> => {
        const transfers = currentStation.getTransfers()
        const selectedLine = transfers[transferIndex]

        if (selectedLine !== undefined) {
            await transferTo(selectedLine)
        }
    }

    const transferTo = async (selectedLine: LineName): Promise<void> => {
        if (train == null) return

        if (await train.transferToLine(selectedLine, currentStation)) {
            train.setLine(selectedLine)
            train.setLineType()
            train.setCurrentStation(currentStation)
        }
        updateTrainObject({ ...train.updateTrainState() })
        setIsTransferMode(false)
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

    const currentLine = useMemo(() => train.getLine(), [train])
    useEffect(() => {
        document.documentElement.style.setProperty('--line-color', lineToLineColor(currentLine))
    }, [currentLine])

    return (
        <div className="stations-container">
            <div className="station-box" id="current-station">
                <Header text="Current Station" />
                <div className="station-item">
                    <Station name={currentStation.getName()}>
                        <div className="not-dim">
                            <TransferLines onClick={getTransferLineClicked} transfers={getTransferImageSvg(currentStation)} />
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
                        label={`Advance Station${numAdvanceStations > 1 ? 's' : ''}`}
                        onClick={() => handleTrainAction('advanceStation')}
                        additionalInput={advancedMode}
                    />
                </div>
            </div>

            <div className="station-box blanket" id="destination-station">
                <Header text="Destination Station" />
                <div className="station-item">
                    <Station name={gameState.destinationStation.getName()}>
                        <TransferLines transfers={getTransferImageSvg(gameState.destinationStation)} />
                    </Station>
                </div>
                {gameState.isFirstTurn && (
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
