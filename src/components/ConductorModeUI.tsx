import './ConductorModeUI.css'
import ActionButton from './ActionButton'
import Header from './Header'
import Station from './Station'
import LineSVGs from './LineSVGs'
import TrainCar from './TrainCar'
import AdvanceNStationsInput from './AdvanceNStationsInput'

import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import { getLineSVG } from '../logic/LineSVGsMap'

import useTrainActions from '../hooks/useTrainActions'
import useKeyShortcuts from '../hooks/useKeyShortcuts'
import setUITheme from '../hooks/setUITheme'

import R_ARROW_BLACK from '../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../images/right-arrow-w.svg'
import TRANSFER_WHITE from '../images/transfer-icon-w.svg'
import TRANSFER_BLACK from '../images/transfer-icon-b.svg'
import C_DIRECTION_WHITE from '../images/change-direction-icon-w.svg'
import C_DIRECTION_BLACK from '../images/change-direction-icon-b.svg'
import REFRESH_BLACK from '../images/refresh-icon-b.svg'
import REFRESH_WHITE from '../images/refresh-icon-w.svg'

function ConductorModeUI() {
    const { darkMode, setIsTransferMode, setUpcomingStationsVisible, toggleUpcomingStationsLayout, setDarkMode } = useUIContext()
    const { numAdvanceStations, setNumAdvanceStations, conductorMode, setConductorMode, defaultDirectionToggle } =
        useSettingsContext()
    const { train, updateTrainObject, setGameState, gameState, initializeGame } = useGameContext()

    setUITheme(darkMode)

    const refreshGameAction = async () => {
        await initializeGame()
    }

    const { advanceStation, transfer, changeDirection } = useTrainActions({
        train,
        gameState,
        conductorMode,
        updateTrainObject,
        setGameState,
    })
    // TODO
    useKeyShortcuts({
        comboKeys: {
            'Shift+L': toggleUpcomingStationsLayout,
            'Shift+D': () => setDarkMode((prev) => !prev),
            'Shift+U': () => setUpcomingStationsVisible((prev) => !prev),
            'Shift+C': () => setConductorMode((prev) => !prev),
        },
        singleKeys: {
            t: () => setIsTransferMode((prev) => !prev),
            c: changeDirection,
            r: refreshGameAction,
            ArrowRight: () => advanceStation(numAdvanceStations),
            Escape: () => setIsTransferMode(false),
            '-': () => setNumAdvanceStations((prev) => Math.max(1, prev - 1)),
            '+': () => setNumAdvanceStations((prev) => prev + 1),
            '=': () => setNumAdvanceStations((prev) => prev + 1),
        },
    })

    return (
        <>
            <div className={`${gameState.isWon ? 'win-state' : ''}`}>
                <TrainCar />
            </div>

            <div className='stations-container'>
                <div className={`station-box ${gameState.isWon ? 'win-state' : ''}`} id='current-station'>
                    <Header text='Current station' />
                    <div className='station-item'>
                        <Station name={train.getCurrentStation().getName()}>
                            <LineSVGs
                                svgPaths={getLineSVG(train.getCurrentStation())}
                                onTransferSelect={(index) => {
                                    setIsTransferMode(false), transfer(index).catch(console.error)
                                }}
                                notDim
                                selectable
                            />
                        </Station>
                    </div>
                    <div className={`action-buttons-container ${conductorMode ? 'conductor' : ''}`} id='starting-station'>
                        <ActionButton
                            imageSrc={darkMode ? TRANSFER_WHITE : TRANSFER_BLACK}
                            label='Transfer lines'
                            onMouseDown={() => setIsTransferMode((prev) => (prev ? false : true))}
                        />
                        <ActionButton
                            imageSrc={darkMode ? C_DIRECTION_WHITE : C_DIRECTION_BLACK}
                            label='Change direction'
                            onMouseDown={() => (setIsTransferMode(false), changeDirection())}
                        />
                        <ActionButton
                            imageSrc={darkMode ? R_ARROW_WHITE : R_ARROW_BLACK}
                            label={`Advance station${numAdvanceStations > 1 ? 's' : ''}`}
                            onMouseDown={() => (setIsTransferMode(false), advanceStation(numAdvanceStations))}
                            additionalInput={<AdvanceNStationsInput />}
                        />
                    </div>
                </div>

                <div className={`station-box ${gameState.isWon ? 'win-state' : ''}`} id='destination-station'>
                    <Header text='Destination station' />
                    <div className='station-item'>
                        <Station name={gameState.destinationStation.getName()}>
                            <LineSVGs svgPaths={getLineSVG(gameState.destinationStation)} />
                        </Station>
                    </div>
                    <div className='action-buttons-container' id='destination-station'>
                        <ActionButton
                            imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK}
                            label='Reset game'
                            onMouseDown={() => refreshGameAction()}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConductorModeUI
