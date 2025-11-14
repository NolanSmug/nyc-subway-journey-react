import './ConductorModeUI.css'
import React, { useMemo } from 'react'

import ActionButton from '../common/ActionButton'
import Station from '../station/Station'
import LineSVGs from '../LineSVGs'
import TrainCar from '../train/TrainCar'
import Header from '../common/Header'
import AdvanceNStationsInput from '../navigation/AdvanceNStationsInput'

import { Station as StationObject } from '../../logic/StationManager'
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
    handleLineClick: (index: number) => void
    handleTransferClick: () => void
    handleAdvanceClick: () => void
    handleChangeDirectionClick: () => void
    handleResetClick: () => void

    gameState: GameState
    currentStation: StationObject
    isNullDirection: boolean
    darkMode: boolean
    numAdvanceStations: number
}

function ConductorModeUI({
    gameState,
    currentStation,
    isNullDirection,
    darkMode,
    numAdvanceStations,
    handleLineClick,
    handleTransferClick,
    handleAdvanceClick,
    handleChangeDirectionClick,
    handleResetClick,
}: ConductorModeUIProps) {
    const currentTransferSVGs = useMemo(() => getLineSVGs(currentStation.getTransfers()), [currentStation])
    const destinationTransferSVGs = useMemo(() => getLineSVGs(gameState.destinationStation.getTransfers()), [gameState.destinationStation])

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
                                svgPaths={currentTransferSVGs}
                                onTransferSelect={(index) => {
                                    handleLineClick(index)
                                }}
                                notDim
                            />
                        </Station>
                    </div>
                    <div className={`action-buttons-container`} id='starting-station'>
                        <ActionButton
                            imageSrc={darkMode ? TRANSFER_WHITE : TRANSFER_BLACK}
                            label='Transfer lines'
                            onClick={handleTransferClick}
                        />
                        <ActionButton
                            imageSrc={darkMode ? C_DIRECTION_WHITE : C_DIRECTION_BLACK}
                            label='Change direction'
                            onClick={handleChangeDirectionClick}
                        />
                        <ActionButton
                            imageSrc={darkMode ? R_ARROW_WHITE : R_ARROW_BLACK}
                            label={`Advance station${numAdvanceStations > 1 ? 's' : ''}`}
                            onClick={handleAdvanceClick}
                            additionalInput={<AdvanceNStationsInput />}
                            disabled={isNullDirection}
                        />
                    </div>
                </div>

                <div className={`station-box ${gameState.isWon ? 'win-state' : ''}`} id='destination-station'>
                    <Header text='Destination station' />
                    <div className='station-item'>
                        <Station name={gameState.destinationStation.getName()}>
                            <LineSVGs svgPaths={destinationTransferSVGs} disabled />
                        </Station>
                    </div>
                    <div className='action-buttons-container' id='destination-station'>
                        <ActionButton imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK} label='Reset game' onClick={handleResetClick} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default React.memo(ConductorModeUI)
