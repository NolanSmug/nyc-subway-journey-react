import { useEffect } from 'react'

import './GameStateUI.css'
import ActionButton from './ActionButton'
import Header from './Header'
import Station from './Station'
import TransferLines from './TransferLines'
import TrainCar from './TrainCar'
import AdvanceNStationsInput from './AdvanceNStationsInput'
import DirectionSwitch from './DirectionSwitch'

import { useUIContext } from '../contexts/UIContext'
import { Direction, LineName } from '../logic/EnumManager'
import { getTransferImageSvg } from '../logic/TransferImageMap'
import { useGameContext } from '../contexts/GameContext'
import { useSettingsContext } from '../contexts/SettingsContext'

import R_ARROW_BLACK from '../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../images/right-arrow-w.svg'
import TRANSFER_WHITE from '../images/transfer-icon-w.svg'
import TRANSFER_BLACK from '../images/transfer-icon-b.svg'
import C_DIRECTION_WHITE from '../images/change-direction-icon-w.svg'
import C_DIRECTION_BLACK from '../images/change-direction-icon-b.svg'
import REFRESH_BLACK from '../images/refresh-icon-b.svg'
import REFRESH_WHITE from '../images/refresh-icon-w.svg'

function GameStateUI() {
    const {
        darkMode,
        setIsTransferMode,
        setUpcomingStationsVertical,
        setDarkMode,
        setUpcomingStationsVisible,
        upcomingStationsVisible,
    } = useUIContext()
    const {
        numAdvanceStations,
        setNumAdvanceStations,
        conductorMode,
        setConductorMode,
        defaultDirectionToggle,
        setDefaultDirectionToggle,
    } = useSettingsContext()
    const { train, updateTrainObject, gameState, initializeGame } = useGameContext()

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

                const winState = await gameState.checkWin(train.getCurrentStation())
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

    const transferTo = async (selectedLine: LineName): Promise<void> => {
        if (await train.transferToLine(selectedLine, train.getCurrentStation())) {
            train.setLine(selectedLine)
            train.setLineType()
            train.setCurrentStation(train.getCurrentStation())
            if (conductorMode) train.setDirection(defaultDirectionToggle)
            train.updateTrainState()
        }
        updateTrainObject({ ...train })
        setIsTransferMode(false)
    }

    const getTransferLineClicked = async (transferIndex: number): Promise<void> => {
        const selectedLine = train.getCurrentStation().getTransfers()[transferIndex]

        if (selectedLine !== undefined) {
            await transferTo(selectedLine)
        }
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        if (document.activeElement instanceof HTMLInputElement) {
            return // Ignore key presses inside input fields
        }

        // Mapping for key commands
        const comboKeyActions: { [combo: string]: () => void } = {
            'Shift+L': () => upcomingStationsVisible && setUpcomingStationsVertical((prev) => !prev), // only allow layout change when upcoming stations are visible
            'Shift+D': () => setDarkMode((prev) => !prev),
            'Shift+U': () => setUpcomingStationsVisible((prev) => !prev),
            'Shift+C': () => setConductorMode((prev) => !prev),
        }

        // Check for combo keys (commands)
        const keyCombo = `${event.shiftKey ? 'Shift+' : ''}${event.key}`
        if (comboKeyActions[keyCombo]) {
            event.preventDefault() // Prevent default browser behavior
            comboKeyActions[keyCombo]()
            return // don't check for single key actions
        }

        // Mapping for single-key actions
        const singleKeyActions: { [key: string]: () => void } = {
            t: () => handleTrainAction('transfer'),
            c: () => handleTrainAction('changeDirection'),
            r: () => handleTrainAction('refresh'),
            ArrowRight: () => handleTrainAction('advanceStation'),
            Escape: () => setIsTransferMode(false),
            '-': () => setNumAdvanceStations(numAdvanceStations > 1 ? (prev) => prev - 1 : () => 1),
            '+': () => setNumAdvanceStations((prev) => prev + 1),
            '=': () => setNumAdvanceStations((prev) => prev + 1), // Handle "+" from "=" without Shift key
        }

        // Handle single-key actions
        singleKeyActions[event.key]?.()
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    })

    return (
        <>
            <div className={`${gameState.isWon ? 'win-state' : ''}`}>
                <TrainCar />
            </div>

            <div className="stations-container">
                <div className="station-box" id="current-station">
                    <Header text="Current station" />
                    <div className="station-item">
                        <Station name={train.getCurrentStation().getName()}>
                            <TransferLines
                                getTransferLineClicked={getTransferLineClicked}
                                transfers={getTransferImageSvg(train.getCurrentStation())}
                                notDim
                            />
                        </Station>
                    </div>
                    <div className={`action-buttons-container ${conductorMode ? 'conductor' : ''}`} id="starting-station">
                        <ActionButton
                            imageSrc={darkMode ? TRANSFER_WHITE : TRANSFER_BLACK}
                            label="Transfer lines"
                            onClick={() => handleTrainAction('transfer')}
                        />
                        <ActionButton
                            imageSrc={darkMode ? C_DIRECTION_WHITE : C_DIRECTION_BLACK}
                            label="Change direction"
                            onClick={() => handleTrainAction('changeDirection')}
                        />
                        <ActionButton
                            imageSrc={darkMode ? R_ARROW_WHITE : R_ARROW_BLACK}
                            label={`Advance station${numAdvanceStations > 1 ? 's' : ''}`}
                            onClick={() => handleTrainAction('advanceStation')}
                            additionalInput={<AdvanceNStationsInput visible={conductorMode} />}
                        />
                    </div>
                </div>

                <div className="station-box" id="destination-station">
                    <Header text="Destination station" />
                    <div className="station-item">
                        <Station name={gameState.destinationStation.getName()}>
                            <TransferLines transfers={getTransferImageSvg(gameState.destinationStation)} />
                        </Station>
                    </div>
                    <div className="action-buttons-container" id="destination-station">
                        <ActionButton
                            imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK}
                            label="Reset game"
                            onClick={() => handleTrainAction('refresh')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GameStateUI
