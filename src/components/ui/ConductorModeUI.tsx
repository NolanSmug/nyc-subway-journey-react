import React from 'react'
import ActionButton from '../common/ActionButton'
import Station from '../station/Station'
import LineSVGs from '../LineSVGs'
import TrainCar from '../train/TrainCar'
import Header from '../common/Header'
import AdvanceNStationsInput from '../navigation/AdvanceNStationsInput'

import './ConductorModeUI.css'
import { useTrainContext } from '../../contexts/TrainContext'
import { useGameStateContext } from '../../contexts/GameStateContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useUIContext } from '../../contexts/UIContext'

import { useGame } from '../../hooks/useGame'

import { getLineSVGs } from '../../logic/LineSVGsMap'
import { Station as StationObject } from '../../logic/StationManager'
import { Direction } from '../../logic/LineManager'

import R_ARROW_BLACK from '../../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../../images/right-arrow-w.svg'
import TRANSFER_WHITE from '../../images/transfer-icon-w.svg'
import TRANSFER_BLACK from '../../images/transfer-icon-b.svg'
import C_DIRECTION_WHITE from '../../images/change-direction-icon-w.svg'
import C_DIRECTION_BLACK from '../../images/change-direction-icon-b.svg'
import REFRESH_BLACK from '../../images/refresh-icon-b.svg'
import REFRESH_WHITE from '../../images/refresh-icon-w.svg'

function ConductorModeUI() {
    const { gameState } = useGameStateContext()
    const { initializeGame } = useGame()

    const currentStation: StationObject = useTrainContext((state) => state.train.getCurrentStation())
    const isNullDirection: boolean = useTrainContext((state) => state.train.getDirection()) === Direction.NULL_DIRECTION
    const { advanceStation, transfer, changeDirection } = useTrainContext((state) => state.actions)

    const darkMode = useUIContext((state) => state.darkMode)
    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)

    const conductorMode = useSettingsContext((state) => state.conductorMode)
    const numAdvanceStations = useSettingsContext((state) => state.numAdvanceStations)

    return (
        <>
            <div className={`${gameState.isWon ? 'win-state' : ''}`}>
                <TrainCar />
            </div>

            <div className='stations-container'>
                <div className={`station-box ${gameState.isWon ? 'win-state' : ''}`} id='current-station'>
                    <Header text='Current station' />
                    <div className='station-item'>
                        <Station name={currentStation.getName()}>
                            <LineSVGs
                                svgPaths={getLineSVGs(currentStation.getTransfers())}
                                onTransferSelect={(index) => {
                                    setIsTransferMode(false)
                                    transfer(index).catch(console.error)
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
                            onMouseDown={() => {
                                setIsTransferMode(false)
                                changeDirection()
                            }}
                        />
                        <ActionButton
                            imageSrc={darkMode ? R_ARROW_WHITE : R_ARROW_BLACK}
                            label={`Advance station${numAdvanceStations > 1 ? 's' : ''}`}
                            onMouseDown={() => {
                                setIsTransferMode(false)
                                advanceStation(numAdvanceStations)
                            }}
                            additionalInput={<AdvanceNStationsInput />}
                            disabled={isNullDirection}
                        />
                    </div>
                </div>

                <div className={`station-box ${gameState.isWon ? 'win-state' : ''}`} id='destination-station'>
                    <Header text='Destination station' />
                    <div className='station-item'>
                        <Station name={gameState.destinationStation.getName()}>
                            <LineSVGs svgPaths={getLineSVGs(gameState.destinationStation.getTransfers())} />
                        </Station>
                    </div>
                    <div className='action-buttons-container' id='destination-station'>
                        <ActionButton
                            imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK}
                            label='Reset game'
                            onMouseDown={() => initializeGame()}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default React.memo(ConductorModeUI)
