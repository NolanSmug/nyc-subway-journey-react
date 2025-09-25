import React, { useMemo, useState } from 'react'
import './RiderModeUI.css'

import TrainCarCustom from '../train/TrainCarCustom'
import Staircase from '../station/Staircase'
import SamePlatformTransfers from '../navigation/SamePlatformTransfers'
import ActionButton from '../common/ActionButton'
import Station from '../station/Station'
import LineSVGs from '../LineSVGs'
import Passenger from '../Passenger'

import usePassengerActions, { PassengerAction, PassengerState } from '../../hooks/usePassengerActions'

import { Train } from '../../logic/TrainManager'
import { GameState } from '../../logic/GameState'
import { Direction, LineName } from '../../logic/LineManager'
import { groupLines, getCorrespondingGroup, getLineSVGs } from '../../logic/LineSVGsMap'
import { useUIContext } from '../../contexts/UIContext'

interface RiderModeUIProps {
    train: Train
    gameState: GameState
    advanceStation: (n: number) => void
    transfer: (input: number | LineName) => Promise<void>
    changeDirection: (direction?: Direction) => void
}

function RiderModeUI({ train, gameState, advanceStation, transfer, changeDirection }: RiderModeUIProps) {
    const { passengerState, setPassengerState, setPassengerPosition } = useUIContext()

    const [inTransferTunnel, setInTransferTunnel] = useState<boolean>(false)
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0)

    const stationID: string = useMemo(() => train.getCurrentStation().getId(), [train.getCurrentStation().getId()])
    const transfers: LineName[] = useMemo(() => train.getCurrentStation().getTransfers(), [train.getCurrentStation().getTransfers()])
    const currentLine = useMemo(() => train.getLine(), [train.getLine()])

    const groupedTransfers: LineName[][] = useMemo(() => groupLines(transfers, stationID), [stationID]) // sort transfers array into proper line groupings
    const currentPlatformGroup: LineName[] = useMemo(
        // lines that share the current train line's platform
        () => getCorrespondingGroup(currentLine, groupedTransfers),
        [currentLine, groupedTransfers]
    )
    const otherPlatformGroups: LineName[][] = useMemo(
        // all other lines at the station
        () => groupedTransfers.filter((g) => !g.includes(currentLine)),
        [groupedTransfers, currentLine]
    )
    const hasSamePlatformTransfers: boolean = useMemo(() => currentPlatformGroup.length > 1, [currentPlatformGroup])
    const hasOtherPlatformTransfers: boolean = useMemo(() => otherPlatformGroups.length > 0, [otherPlatformGroups])
    const hideTransferButton: boolean = useMemo(
        () =>
            passengerState === PassengerState.WALKING ||
            passengerState === PassengerState.TRANSFER_PLATFORM ||
            transfers.length === 1 ||
            inTransferTunnel,
        [transfers, passengerState, inTransferTunnel]
    )
    const passengerIsWalking = passengerState === PassengerState.WALKING

    const { walkPassenger } = usePassengerActions({ setPassengerPosition, setPassengerState })

    function selectStaircaseLine(line: LineName, index: number): void {
        setSelectedGroupIndex(index)

        if (inTransferTunnel && line) {
            transfer(line)
            // need to do this to fix a state race condition
            setTimeout(() => {
                setInTransferTunnel(false)
            }, 25)
            train.setDirection(Direction.NULL_DIRECTION)
        } else {
            // staircase isn't open yet
            setInTransferTunnel(true)
        }
    }

    return (
        <div className='platform-wrapper'>
            <div
                className={`transfer-tunnels ${hasSamePlatformTransfers ? 'platform-transfers' : ''} ${hasOtherPlatformTransfers ? 'other-platform-transfers' : ''} ${train.getDirection()} `}
            >
                {hasSamePlatformTransfers && (
                    <SamePlatformTransfers
                        lines={currentPlatformGroup.filter((line) => line !== train.getLine())}
                        hidden={inTransferTunnel}
                        passengerIsWalking={passengerIsWalking}
                        onSelection={transfer}
                    />
                )}
                {otherPlatformGroups.map((transfers, index) => (
                    <Staircase
                        key={index}
                        lines={transfers}
                        onSelection={(line: LineName) => {
                            selectStaircaseLine(line, index)
                        }}
                        isSelected={!inTransferTunnel && selectedGroupIndex === index}
                        tunnelLayout={inTransferTunnel && selectedGroupIndex === index}
                        hidden={inTransferTunnel && selectedGroupIndex !== index}
                    />
                ))}
            </div>

            <div className='platform-container'>
                <Passenger />

                <Station name={train.getCurrentStation().getName()} hidden={train.getDirection() === Direction.DOWNTOWN} noLines />
                <TrainCarCustom
                    line={train.getLine()}
                    direction={Direction.UPTOWN}
                    active={train.getDirection() === Direction.UPTOWN}
                    hidden={inTransferTunnel}
                    advanceStation={advanceStation}
                />
                <ActionButton
                    label='board uptown train'
                    noImage
                    onMouseDown={() => changeDirection(Direction.UPTOWN)}
                    hidden={inTransferTunnel || train.getDirection() === Direction.UPTOWN}
                    wrapperClassName='uptown-button-offset'
                />

                <div className='platform'>
                    <ActionButton
                        label={hasSamePlatformTransfers && !hasOtherPlatformTransfers && !train.isNullDirection() ? 'deboard' : 'transfer'}
                        noImage
                        onMouseDown={() => (
                            walkPassenger(PassengerAction.DEBOARD_TRAIN, PassengerState.TRANSFER_PLATFORM),
                            train.setDirection(Direction.NULL_DIRECTION)
                        )}
                        hidden={hideTransferButton}
                    />
                </div>

                <ActionButton
                    label='board downtown train'
                    noImage
                    onMouseDown={() => changeDirection(Direction.DOWNTOWN)}
                    hidden={inTransferTunnel || train.getDirection() === Direction.DOWNTOWN}
                    wrapperClassName='downtown-button-offset'
                />
                <TrainCarCustom
                    line={train.getLine()}
                    direction={Direction.DOWNTOWN}
                    active={train.getDirection() === Direction.DOWNTOWN}
                    hidden={inTransferTunnel}
                    advanceStation={advanceStation}
                />
                <Station
                    name={train.getCurrentStation().getName()}
                    hidden={train.isNullDirection() || train.getDirection() === Direction.UPTOWN}
                    noLines
                />
            </div>
            <div className='destination-station-rider-mode' id='destination-station'>
                <h2>Destination Station</h2>
                <Station name={gameState.destinationStation.getName()} noLines isDestination>
                    <LineSVGs svgPaths={getLineSVGs(gameState.destinationStation.getTransfers())} />
                </Station>
            </div>
        </div>
    )
}

export default React.memo(RiderModeUI)
