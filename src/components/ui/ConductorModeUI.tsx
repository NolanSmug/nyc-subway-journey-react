import React from 'react'
import './ConductorModeUI.css'

import ActionButton from '../common/ActionButton'
import Station from '../station/Station'
import LineSVGs from '../LineSVGs'
import TrainCar from '../train/TrainCar'
import Header from '../common/Header'
import AdvanceNStationsInput from '../navigation/AdvanceNStationsInput'

import { Train } from '../../logic/TrainManager'
import { LineName } from '../../logic/LineManager'
import { GameState } from '../../logic/GameState'
import { getLineSVGs } from '../../logic/LineSVGsMap'

import R_ARROW_BLACK from '../../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../../images/right-arrow-w.svg'
import TRANSFER_WHITE from '../../images/transfer-icon-w.svg'
import TRANSFER_BLACK from '../../images/transfer-icon-b.svg'
import C_DIRECTION_WHITE from '../../images/change-direction-icon-w.svg'
import C_DIRECTION_BLACK from '../../images/change-direction-icon-b.svg'
import REFRESH_BLACK from '../../images/refresh-icon-b.svg'
import REFRESH_WHITE from '../../images/refresh-icon-w.svg'

interface ConductorModeUIProps {
    train: Train
    gameState: GameState
    advanceStation: (n: number) => void
    transfer: (input: number | LineName) => Promise<void>
    changeDirection: () => void
    resetGame: () => void
    setIsTransferMode: React.Dispatch<React.SetStateAction<boolean>>
    conductorMode: boolean
    darkMode: boolean
    numAdvanceStations: number
}

function ConductorModeUI({
    train,
    gameState,
    advanceStation,
    transfer,
    changeDirection,
    resetGame,
    setIsTransferMode,
    conductorMode,
    darkMode,
    numAdvanceStations,
}: ConductorModeUIProps) {
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
                                svgPaths={getLineSVGs(train.getCurrentStation().getTransfers())}
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
                            onMouseDown={() => resetGame()}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default React.memo(ConductorModeUI)
