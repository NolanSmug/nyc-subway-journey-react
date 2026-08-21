import './ConductorModeUI.css'
import { memo } from 'react'

import ActionButton from '../common/ActionButton'
import Station from '../station/Station'
import LineSVGs from '../common/LineSVGs'
import TrainCar from '../train/TrainCar'
import TrainCarFront from '../train/mobile/TrainCarFront'
import Header from '../common/Header'
import ConductorModeControls from './ConductorModeControls'

import { Station as StationObject } from '../../logic/StationManager'
import { Journey } from '../../logic/Journey'
import { Direction } from '../../logic/LineManager'

import REFRESH_BLACK from '../../assets/images/refresh-icon-b.svg'
import REFRESH_WHITE from '../../assets/images/refresh-icon-w.svg'

interface ConductorModeUIProps {
    handleLineClick: (index: number) => void
    handleTransferClick: () => void
    handleAdvanceClick: () => void
    handleChangeDirectionClick: () => void
    handleResetClick: () => void

    journey: Journey
    currentStation: StationObject
    direction: Direction
    darkMode: boolean
    numAdvanceStations: number
    isVerticalLayout: boolean
    isMobile: boolean
}

function ConductorModeUI({
    journey,
    currentStation,
    direction,
    darkMode,
    numAdvanceStations,
    handleLineClick,
    handleTransferClick,
    handleAdvanceClick,
    handleChangeDirectionClick,
    handleResetClick,
    isVerticalLayout,
    isMobile,
}: ConductorModeUIProps) {
    return (
        <div className='conductor-layout-wrapper'>
            <div className={`desktop-train-wrapper ${journey.isWon ? 'win-state' : ''}`}>
                <TrainCar />
            </div>

            <div className='stations-container'>
                <div className={`station-box current-station-box ${journey.isWon ? 'win-state' : ''}`} id='current-station'>
                    {!isMobile && <Header text='Current station' />}
                    <div className='station-item'>
                        <Station name={currentStation.getName()}>
                            <LineSVGs lines={currentStation.getTransfers()} onTransferSelect={handleLineClick} notDim />
                        </Station>
                    </div>
                    {!isMobile && (
                        <ConductorModeControls
                            handleTransferClick={handleTransferClick}
                            handleAdvanceClick={handleAdvanceClick}
                            handleChangeDirectionClick={handleChangeDirectionClick}
                            numAdvanceStations={numAdvanceStations}
                            direction={direction}
                            isVerticalLayout={isVerticalLayout}
                        />
                    )}
                </div>

                <div className={`station-box destination-station-box ${journey.isWon ? 'win-state' : ''}`} id='destination-station'>
                    <Header text='Destination' />
                    <div className='station-item'>
                        <Station name={journey.destinationStation.getName()}>
                            <LineSVGs lines={journey.destinationStation.getTransfers()} disabled />
                        </Station>
                    </div>
                    <div className='action-buttons-container dest-actions' id='destination-station'>
                        <ActionButton imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK} label='Reset game' onClick={handleResetClick} />
                    </div>
                </div>
            </div>

            <div className={`mobile-train-wrapper ${journey.isWon ? 'win-state' : ''}`}>
                <TrainCarFront changeDirection={handleChangeDirectionClick} />
            </div>
        </div>
    )
}

export default memo(ConductorModeUI)
