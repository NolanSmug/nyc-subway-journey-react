import React, { useCallback, useMemo } from 'react'
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

    const { advanceStation, transfer, changeDirection } = useTrainContext((state) => state.actions)
    const currentStation: StationObject = useTrainContext((state) => state.train.getCurrentStation())
    const isNullDirection: boolean = useTrainContext((state) => state.train.getDirection()) === Direction.NULL_DIRECTION

    const darkMode = useSettingsContext((state) => state.darkMode)
    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)

    const numAdvanceStations = useSettingsContext((state) => state.numAdvanceStations)

    const currentTransferSVGs = useMemo(() => getLineSVGs(currentStation.getTransfers()), [currentStation.getTransfers()])
    const destinationTransferSVGs = useMemo(
        () => getLineSVGs(gameState.destinationStation.getTransfers()),
        [gameState.destinationStation.getTransfers()]
    )

    const handleLineClick = useCallback(
        (index: number) => {
            setIsTransferMode(false)
            transfer(index)
        },
        [setIsTransferMode, transfer]
    )

    const handleTransferClick = useCallback(() => {
        setIsTransferMode((prev) => (prev ? false : true))
    }, [setIsTransferMode])

    const handleAdvanceClick = useCallback(() => {
        setIsTransferMode(false)
        advanceStation(numAdvanceStations)
    }, [setIsTransferMode, advanceStation, numAdvanceStations])

    const handleChangeDirectionClick = useCallback(() => {
        setIsTransferMode(false)
        changeDirection()
    }, [setIsTransferMode, changeDirection])

    const handleResetClick = useCallback(() => {
        setIsTransferMode(false)
        initializeGame()
    }, [setIsTransferMode, initializeGame])

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
