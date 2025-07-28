import React, { useMemo, useState } from 'react'
import './PassengerPlatformView.css'

import TrainCarCustom from './TrainCarCustom'
import Staircase from './Staircase'
import SamePlatformTransfers from './SamePlatformTransfers'
import ActionButton from './ActionButton'
import Station from './Station'
import LineSVGs from './LineSVGs'

import useTrainActions from '../hooks/useTrainActions'
import { useSettingsContext } from '../contexts/SettingsContext'
import { useGameContext } from '../contexts/GameContext'
import { Direction, LineName } from '../logic/LineManager'
import { groupLines, getCorrespondingGroup, getLineSVGs } from '../logic/LineSVGsMap'

function PassengerPlatformView() {
    const { train, gameState, setGameState, updateTrainObject } = useGameContext()
    const { conductorMode } = useSettingsContext()

    const [inTransferTunnel, setInTransferTunnel] = useState<boolean>(false)
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0)

    const stationID: string = train.getCurrentStation().getId()
    const transfers: LineName[] = train.getCurrentStation().getTransfers()
    const currentLine = useMemo(() => train.getLine(), [train])

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

    const { transfer } = useTrainActions({ train, gameState, conductorMode, updateTrainObject, setGameState })

    function selectTransferInTunnel(line: LineName): void {
        if (inTransferTunnel && line) {
            transfer(line)
            setTimeout(() => {
                // need to do this to fix a state race condition
                setInTransferTunnel(false)
            }, 25)
            train.setDirection(Direction.NULL_DIRECTION)
        } else {
            setInTransferTunnel(true)
        }
    }

    return (
        <>
            <div className='platform-wrapper'>
                <div
                    className={`transfer-tunnels ${hasSamePlatformTransfers ? 'platform-transfers' : ''} ${otherPlatformGroups.length > 0 ? 'has-other-platform-transfers' : ''} ${train.getDirection().toLowerCase()} `}
                >
                    {hasSamePlatformTransfers && (
                        <SamePlatformTransfers
                            lines={currentPlatformGroup.filter((line) => line !== train.getLine())}
                            hidden={inTransferTunnel}
                            onSelection={(line) => transfer(line)}
                        />
                    )}
                    {otherPlatformGroups.map((transfers, index) => (
                        <Staircase
                            key={index}
                            lines={transfers}
                            onSelection={(line: LineName) => {
                                selectTransferInTunnel(line)
                                setSelectedGroupIndex(index)
                            }}
                            tunnelLayout={inTransferTunnel && selectedGroupIndex === index}
                            hidden={inTransferTunnel && selectedGroupIndex !== index}
                        />
                    ))}
                </div>

                <div className='platform-container'>
                    <Station name={train.getCurrentStation().getName()} hidden={train.getDirection() === Direction.DOWNTOWN} noLines />
                    <TrainCarCustom
                        line={train.getLine()}
                        direction={Direction.UPTOWN}
                        active={train.getDirection() === Direction.UPTOWN}
                        hidden={inTransferTunnel}
                    />
                    <ActionButton
                        label='board uptown train'
                        noImage
                        onMouseDown={() => updateTrainObject({ ...train.setDirection(Direction.UPTOWN) })}
                        hidden={inTransferTunnel || train.getDirection() === Direction.UPTOWN}
                        wrapperClassName='uptown-button-offset'
                    />

                    <div className='platform'></div>

                    <ActionButton
                        label='board downtown train'
                        noImage
                        onMouseDown={() => updateTrainObject({ ...train.setDirection(Direction.DOWNTOWN) })}
                        hidden={inTransferTunnel || train.getDirection() === Direction.DOWNTOWN}
                        wrapperClassName='downtown-button-offset'
                    />
                    <TrainCarCustom
                        line={train.getLine()}
                        direction={Direction.DOWNTOWN}
                        active={train.getDirection() === Direction.DOWNTOWN}
                        hidden={inTransferTunnel}
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
        </>
    )
}

export default PassengerPlatformView
