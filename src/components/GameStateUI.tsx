import { useEffect } from 'react'

import './GameStateUI.css'
import ActionButton from './ActionButton'
import Header from './Header'
import Station from './Station'
import LineSVGs from './LineSVGs'
import TrainCar from './TrainCar'
import AdvanceNStationsInput from './AdvanceNStationsInput'

import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import { LineName } from '../logic/LineManager'
import { getLineSVG } from '../logic/LineSVGsMap'

import R_ARROW_BLACK from '../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../images/right-arrow-w.svg'
import TRANSFER_WHITE from '../images/transfer-icon-w.svg'
import TRANSFER_BLACK from '../images/transfer-icon-b.svg'
import C_DIRECTION_WHITE from '../images/change-direction-icon-w.svg'
import C_DIRECTION_BLACK from '../images/change-direction-icon-b.svg'
import REFRESH_BLACK from '../images/refresh-icon-b.svg'
import REFRESH_WHITE from '../images/refresh-icon-w.svg'

function GameStateUI() {
    const { darkMode, setIsTransferMode, setUpcomingStationsVisible, toggleUpcomingStationsLayout, setDarkMode } = useUIContext()
    const { numAdvanceStations, setNumAdvanceStations, conductorMode, setConductorMode, defaultDirectionToggle } =
        useSettingsContext()
    const { train, updateTrainObject, setGameState, gameState, initializeGame } = useGameContext()

    // TRAIN ACTIONS
    const refreshGameAction = async () => {
        await initializeGame()
    }

    const advanceStationAction = () => {
        if (!repOK()) throw new Error('repOK failed on advanceaction')

        setIsTransferMode(false)
        if (numAdvanceStations > 1 && conductorMode) {
            updateTrainObject({ ...train.advanceStationInc(numAdvanceStations) })
        } else {
            updateTrainObject({ ...train.advanceStation() })
        }

        checkForWin()
    }

    const transferAction = () => {
        if (!repOK()) throw new Error('repOK failed on transfer action')
        setIsTransferMode((prev) => prev ? false : true) // if already in transfer mode, exit
    }

    const changeDirectionAction = () => {
        if (!repOK()) throw new Error('repOK failed on change direction action')
        setIsTransferMode(false)
        updateTrainObject({ ...train.reverseDirection() })
    }

    // TRAIN ACTION CHECKS
    function repOK(): boolean {
        if (gameState.isWon || train === null || gameState === null) {
            return false
        }
        return true
    }

    const checkForWin = () => {
        const winState = gameState.checkWin(train.getCurrentStation())
        if (winState) {
            setGameState(gameState)
        }
    }

    // UI/UX -> TRANSFER FUNCTIONALITY
    const transferTo = async (selectedLine: LineName): Promise<void> => {
        if (await train.transferToLine(selectedLine, train.getCurrentStation())) {
            train.setLine(selectedLine)
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
            'Shift+L': () => toggleUpcomingStationsLayout(),
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
            t: () => transferAction(),
            c: () => changeDirectionAction(),
            r: () => refreshGameAction(),
            ArrowRight: () => advanceStationAction(),
            Escape: () => setIsTransferMode(false),
            '-': () => setNumAdvanceStations(numAdvanceStations > 1 ? (prev) => prev - 1 : () => 1),
            '+': () => setNumAdvanceStations((prev) => prev + 1),
            '=': () => setNumAdvanceStations((prev) => prev + 1), // Handle "+" from "=" without Shift key
        }

        // Handle single-key action
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
                <div className={`station-box ${gameState.isWon ? 'win-state' : ''}`} id="current-station">
                    <Header text="Current station"/>
                    <div className="station-item">
                        <Station name={train.getCurrentStation().getName()}>
                            <LineSVGs
                                getSVGClicked={getTransferLineClicked}
                                transfers={getLineSVG(train.getCurrentStation())}
                                notDim
                            />
                        </Station>
                    </div>
                    <div className={`action-buttons-container ${conductorMode ? 'conductor' : ''}`} id="starting-station">
                        <ActionButton
                            imageSrc={darkMode ? TRANSFER_WHITE : TRANSFER_BLACK}
                            label="Transfer lines"
                            onMouseDown={() => transferAction()}
                        />
                        <ActionButton
                            imageSrc={darkMode ? C_DIRECTION_WHITE : C_DIRECTION_BLACK}
                            label="Change direction"
                            onMouseDown={() => changeDirectionAction()}
                        />
                        <ActionButton
                            imageSrc={darkMode ? R_ARROW_WHITE : R_ARROW_BLACK}
                            label={`Advance station${numAdvanceStations > 1 ? 's' : ''}`}
                            onMouseDown={() => advanceStationAction()}
                            additionalInput={<AdvanceNStationsInput />}
                        />
                    </div>
                </div>

                <div className={`station-box ${gameState.isWon ? 'win-state' : ''}`} id="destination-station">
                    <Header text="Destination station" />
                    <div className="station-item">
                        <Station name={gameState.destinationStation.getName()}>
                            <LineSVGs transfers={getLineSVG(gameState.destinationStation)} />
                        </Station>
                    </div>
                    <div className="action-buttons-container" id="destination-station">
                        <ActionButton
                            imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK}
                            label="Reset game"
                            onMouseDown={() => refreshGameAction()}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GameStateUI
