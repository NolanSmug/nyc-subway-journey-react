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

import { PassengerState } from '../../hooks/usePassengerActions'
import { usePlatformTransferGroups } from '../../hooks/usePlatformTransferGroups'

import { Direction, LineName } from '../../logic/LineManager'
import { getLineSVGs } from '../../logic/LineSVGsMap'
import { Station as StationObject } from '../../logic/StationManager'

interface RiderModeUIProps {
    handleBoardUptown: () => void
    handleBoardDowntown: () => void
    handleDeboard: () => void
    selectStaircaseLine: (index: number, line?: LineName) => void

    uptownTrainDoorRef: React.RefObject<HTMLDivElement>
    downtownTrainDoorRef: React.RefObject<HTMLDivElement>
    staircaseRef: React.RefObject<HTMLDivElement>

    passengerState: PassengerState
    children: React.ReactNode // <Passenger>

    inTransferTunnel: boolean
    selectedGroupIndex: number
}

function RiderModeUI({
    handleBoardUptown,
    handleBoardDowntown,
    handleDeboard,
    selectStaircaseLine,
    uptownTrainDoorRef,
    downtownTrainDoorRef,
    staircaseRef,
    inTransferTunnel,
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

    const hideTransferButton =
        passengerState === PassengerState.WALKING ||
        passengerState === PassengerState.TRANSFER_PLATFORM ||
        transfers.length === 1 ||
        inTransferTunnel

    const destinationStationChildren = useMemo(
        () => <LineSVGs svgPaths={getLineSVGs(gameState.destinationStation.getTransfers())} disabled />,
        [gameState.destinationStation]
    )

    // console.log(selectedGroupIndex)

    return (
        <div className='platform-wrapper'>
            <div
                className={`transfer-tunnels ${hasSamePlatformTransfers ? 'platform-transfers' : ''} ${hasOtherPlatformTransfers ? 'other-platform-transfers' : ''} ${currentDirection} `}
            >
                {hasSamePlatformTransfers && (
                    <SamePlatformTransfers
                        lines={samePlatformLines}
                        hidden={inTransferTunnel}
                        passengerIsWalking={passengerState === PassengerState.WALKING}
                    />
                )}
                {otherPlatformGroups.map((transfers: LineName[], index: number) => (
                    <Staircase
                        key={index}
                        lines={transfers}
                        onSelection={(line: LineName) => {
                            selectStaircaseLine(index, line)
                        }}
                        selectable={passengerState === PassengerState.TRANSFER_PLATFORM}
                        isSelected={!inTransferTunnel && selectedGroupIndex === index}
                        tunnelLayout={inTransferTunnel && selectedGroupIndex === index}
                        hidden={inTransferTunnel && selectedGroupIndex !== index}
                        ref={staircaseRef}
                    />
                ))}
            </div>

            <div className='platform-container'>
                {passengerComponent}

                <Station name={currentStation.getName()} hidden={currentDirection === Direction.DOWNTOWN} noLines />
                <TrainCarStatic
                    direction={Direction.UPTOWN}
                    active={currentDirection === Direction.UPTOWN}
                    hidden={inTransferTunnel}
                    uptownDoorRef={uptownTrainDoorRef}
                />
                <ActionButton
                    label='board uptown train'
                    noImage
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
                        noImage
                        onClick={handleDeboard}
                        hidden={hideTransferButton}
                    />
                </div>

                <ActionButton
                    label='board downtown train'
                    noImage
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
            </div>
        </div>
    )
}

export default React.memo(RiderModeUI)
