import React, { useCallback, useMemo, useState } from 'react'
import './RiderModeUI.css'

import TrainCarStatic from '../train/TrainCarStatic'
import Station from '../station/Station'
import Staircase from '../station/Staircase'
import LineSVGs from '../LineSVGs'
import Passenger from '../Passenger'
import SamePlatformTransfers from '../navigation/SamePlatformTransfers'
import ActionButton from '../common/ActionButton'

import { PassengerState } from '../../hooks/usePassengerActions'

import { Direction, LineName } from '../../logic/LineManager'
import { groupLines, getCorrespondingGroup, getLineSVGs } from '../../logic/LineSVGsMap'
import { useUIContext } from '../../contexts/UIContext'
import { useTrainContext } from '../../contexts/TrainContext'
import { useGameStateContext } from '../../contexts/GameStateContext'
import { Station as StationObject } from '../../logic/StationManager'

interface RiderModeUIProps {
    handleBoardUptown: () => void
    handleBoardDowntown: () => void
    handleDeboard: () => void
    uptownTrainDoorRef: React.RefObject<HTMLDivElement>
    downtownTrainDoorRef: React.RefObject<HTMLDivElement>
}

function RiderModeUI({
    handleBoardUptown,
    handleBoardDowntown,
    handleDeboard,
    uptownTrainDoorRef,
    downtownTrainDoorRef,
}: RiderModeUIProps) {
    const { gameState } = useGameStateContext()

    const { advanceStation, transfer, changeDirection } = useTrainContext((state) => state.actions)
    const currentStation: StationObject = useTrainContext((state) => state.train.getCurrentStation())
    const currentLine: LineName = useTrainContext((state) => state.train.getLine())
    const currentDirection: Direction = useTrainContext((state) => state.train.getDirection())

    const passengerState: PassengerState = useUIContext((state) => state.passengerState)

    const [inTransferTunnel, setInTransferTunnel] = useState<boolean>(false)
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0)

    const stationID = currentStation.getId()
    const transfers = currentStation.getTransfers()

    const groupedTransfers: LineName[][] = useMemo(() => groupLines(transfers, stationID), [transfers, stationID])
    const currentPlatformGroup: LineName[] = useMemo(
        () => getCorrespondingGroup(currentLine, groupedTransfers),
        [currentLine, groupedTransfers]
    )
    const otherPlatformGroups = useMemo(() => groupedTransfers.filter((g) => !g.includes(currentLine)), [groupedTransfers, currentLine])

    const samePlatformLines = useMemo(
        () => currentPlatformGroup.filter((line) => line !== currentLine),
        [currentPlatformGroup, currentLine]
    )

    const hasSamePlatformTransfers = currentPlatformGroup.length > 1
    const hasOtherPlatformTransfers = otherPlatformGroups.length > 0
    const hideTransferButton =
        passengerState === PassengerState.WALKING ||
        passengerState === PassengerState.TRANSFER_PLATFORM ||
        transfers.length === 1 ||
        inTransferTunnel
    const passengerIsWalking = passengerState === PassengerState.WALKING

    const selectStaircaseLine = useCallback(
        (index: number, line?: LineName): void => {
            if (passengerState !== PassengerState.TRANSFER_PLATFORM) return
            setSelectedGroupIndex(index)

            if (inTransferTunnel && line) {
                transfer(line)
                // need to do this to fix a state race condition
                setTimeout(() => setInTransferTunnel(false), 25)
                changeDirection(Direction.NULL_DIRECTION)
            } else {
                // staircase isn't open yet
                setInTransferTunnel(true)
            }
        },
        [passengerState, inTransferTunnel, transfer, changeDirection]
    )

    return (
        <div className='platform-wrapper'>
            <div
                className={`transfer-tunnels ${hasSamePlatformTransfers ? 'platform-transfers' : ''} ${hasOtherPlatformTransfers ? 'other-platform-transfers' : ''} ${currentDirection} `}
            >
                {hasSamePlatformTransfers && (
                    <SamePlatformTransfers
                        lines={samePlatformLines}
                        hidden={inTransferTunnel}
                        passengerIsWalking={passengerIsWalking}
                        onSelection={transfer}
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
                    />
                ))}
            </div>

            <div className='platform-container'>
                <Passenger />

                <Station name={currentStation.getName()} hidden={currentDirection === Direction.DOWNTOWN} noLines />
                <TrainCarStatic
                    line={currentLine}
                    direction={Direction.UPTOWN}
                    active={currentDirection === Direction.UPTOWN}
                    hidden={inTransferTunnel}
                    uptownDoorRef={uptownTrainDoorRef}
                    advanceStation={advanceStation}
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
                    line={currentLine}
                    direction={Direction.DOWNTOWN}
                    active={currentDirection === Direction.DOWNTOWN}
                    hidden={inTransferTunnel}
                    downtownDoorRef={downtownTrainDoorRef}
                    advanceStation={advanceStation}
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
                    <LineSVGs svgPaths={getLineSVGs(gameState.destinationStation.getTransfers())} disabled />
                </Station>
            </div>
        </div>
    )
}

export default React.memo(RiderModeUI)
