import './RiderModeUI.css'
import React, { useMemo } from 'react'

import TrainCarStatic from '../train/TrainCarStatic'
import Station from '../station/Station'
import Staircase from '../station/Staircase'
import LineSVGs from '../common/LineSVGs'
import SamePlatformTransfers from '../navigation/SamePlatformTransfers'
import ActionButton from '../common/ActionButton'

import { useTrainContext } from '../../contexts/TrainContext'
import { useGameStateContext } from '../../contexts/GameStateContext'

import { PassengerState } from '../../hooks/usePassenger'
import { usePlatformTransferGroups } from '../../hooks/usePlatformTransferGroups'

import { Direction, LineName } from '../../logic/LineManager'
import { getLineSVGs } from '../../logic/LineSVGsMap'
import { Station as StationObject } from '../../logic/StationManager'

import REFRESH_BLACK from '../../assets/images/refresh-icon-b.svg'
import REFRESH_WHITE from '../../assets/images/refresh-icon-w.svg'

interface RiderModeUIProps {
    handleBoardUptown: () => void
    handleBoardDowntown: () => void
    handleDeboard: () => void
    handleReset: () => void

    onStaircaseSelect: (index: number) => void
    onStaircaseDeselect: () => void
    onTransferSelect: (line: LineName) => void

    uptownTrainDoorRef: React.RefObject<HTMLDivElement>
    downtownTrainDoorRef: React.RefObject<HTMLDivElement>
    staircaseRefs: React.MutableRefObject<(HTMLDivElement | null)[]>

    passengerState: PassengerState
    children: React.ReactNode // <Passenger>

    darkMode: boolean
    inTransferTunnel: boolean
    isPassengerTransferring: boolean
    selectedGroupIndex: number
}

function RiderModeUI({
    handleBoardUptown,
    handleBoardDowntown,
    handleDeboard,
    handleReset,

    onStaircaseSelect,
    onStaircaseDeselect,
    onTransferSelect,

    uptownTrainDoorRef,
    downtownTrainDoorRef,
    staircaseRefs,

    darkMode,
    inTransferTunnel,
    isPassengerTransferring,
    selectedGroupIndex,
    passengerState,
    children: passengerComponent,
}: RiderModeUIProps) {
    const { gameState } = useGameStateContext()

    const currentStation: StationObject = useTrainContext((state) => state.train.getCurrentStation())
    const currentLine: LineName = useTrainContext((state) => state.train.getLine())
    const currentDirection: Direction = useTrainContext((state) => state.train.getDirection())

    const { otherPlatformGroups, samePlatformLines, hasSamePlatformTransfers, hasOtherPlatformTransfers, transfers } =
        usePlatformTransferGroups({ currentStation, currentLine })

    const hideTransferButton: boolean =
        passengerState === PassengerState.WALKING ||
        passengerState === PassengerState.TRANSFER_PLATFORM ||
        !hasOtherPlatformTransfers ||
        transfers.length === 0 ||
        inTransferTunnel

    const destinationStationChildren: JSX.Element = useMemo(
        () => <LineSVGs svgPaths={getLineSVGs(gameState.destinationStation.getTransfers())} disabled />,
        [gameState.destinationStation.getId()]
    )

    return (
        <div className='platform-wrapper'>
            <div
                className={`transfer-tunnels ${hasSamePlatformTransfers ? 'platform-transfers' : ''} ${hasOtherPlatformTransfers ? 'other-platform-transfers' : ''} ${currentDirection} `}
            >
                {hasSamePlatformTransfers && <SamePlatformTransfers lines={samePlatformLines} hidden={inTransferTunnel} />}
                {otherPlatformGroups.map((transfers: LineName[], index: number) => {
                    const isGroupSelected: boolean = selectedGroupIndex === index
                    return (
                        <Staircase
                            key={index} // UNINTENTIONAL FEATURE: forces DOM reuse which creates a visual "slide-out/in" after transfer.
                            ref={(el) => (staircaseRefs.current[index] = el)}
                            lines={transfers}
                            onStairSelect={() => onStaircaseSelect(index)}
                            onStairDeselect={onStaircaseDeselect}
                            onTransferSelect={onTransferSelect}
                            isTunnelLayout={inTransferTunnel && isGroupSelected}
                            isWalking={isPassengerTransferring && isGroupSelected}
                            isHidden={inTransferTunnel && !isGroupSelected}
                            isDisabled={passengerState !== PassengerState.TRANSFER_PLATFORM || (inTransferTunnel && !isGroupSelected)}
                        />
                    )
                })}
            </div>
            <div className='platform-container'>
                {passengerComponent}

                <Station
                    name={currentStation.getName()}
                    hidden={currentDirection === Direction.DOWNTOWN || isPassengerTransferring}
                    noLines
                />
                <TrainCarStatic
                    direction={Direction.UPTOWN}
                    active={currentDirection === Direction.UPTOWN}
                    hidden={inTransferTunnel}
                    uptownDoorRef={uptownTrainDoorRef}
                />
                <ActionButton
                    label='board uptown train'
                    onClick={handleBoardUptown}
                    hidden={inTransferTunnel || currentDirection === Direction.UPTOWN}
                    wrapperClassName='uptown-button-offset'
                />

                <div className='platform'>
                    <ActionButton
                        label={
                            hasSamePlatformTransfers && !hasOtherPlatformTransfers && currentDirection !== Direction.NULL_DIRECTION
                                ? 'deboard'
                                : 'transfer'
                        }
                        onClick={handleDeboard}
                        hidden={hideTransferButton}
                    />
                </div>

                <ActionButton
                    label='board downtown train'
                    onClick={handleBoardDowntown}
                    hidden={inTransferTunnel || currentDirection === Direction.DOWNTOWN}
                    wrapperClassName='downtown-button-offset'
                />
                <TrainCarStatic
                    direction={Direction.DOWNTOWN}
                    active={currentDirection === Direction.DOWNTOWN}
                    hidden={inTransferTunnel}
                    downtownDoorRef={downtownTrainDoorRef}
                />
                <Station
                    name={currentStation.getName()}
                    hidden={currentDirection === Direction.NULL_DIRECTION || currentDirection === Direction.UPTOWN}
                    noLines
                />
            </div>
            <div className='destination-station-rider-mode' id='destination-station'>
                <h2>Destination Station</h2>
                <Station name={gameState.destinationStation.getName()} noLines isDestination>
                    {destinationStationChildren}
                </Station>
                <ActionButton onClick={handleReset} imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK} /* hidden={inTransferTunnel} */ />
            </div>
        </div>
    )
}

export default React.memo(RiderModeUI)
