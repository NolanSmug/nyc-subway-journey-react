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
import { groupLines, getCorrespondingGroup, getLineSVG } from '../logic/LineSVGsMap'

function PassengerPlatformView() {
    const { train, gameState, setGameState, updateTrainObject } = useGameContext()
    const { conductorMode } = useSettingsContext()

    const [inTransferTunnel, setInTransferTunnel] = useState<boolean>(false)
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0)

    const stationID: string = train.getCurrentStation().getId()
    const transfers: LineName[] = train.getCurrentStation().getTransfers()
    const currentLine = useMemo(() => train.getLine(), [train])

    // sort transfers array into proper line groupings
    const groupedTransfers = useMemo(() => groupLines(transfers, stationID), [stationID])

    const currentPlatformGroup = useMemo(
        () => getCorrespondingGroup(currentLine, groupedTransfers),
        [currentLine, groupedTransfers]
    ) // these are the lines that share the current train line's platform

    const otherPlatformGroups = useMemo(
        () => groupedTransfers.filter((g) => !g.includes(currentLine)),
        [groupedTransfers, currentLine]
    ) // all other lines at the station

    const { transfer } = useTrainActions({ train, gameState, conductorMode, updateTrainObject, setGameState })

    function selectTransferInTunnel(line: LineName): void {
        setInTransferTunnel((prev) => !prev)

        if (inTransferTunnel && line) {
            transfer(line)
        }
    }

    return (
        <>
            <div className='platform-wrapper'>
                <div className='transfer-tunnels'>
                    <SamePlatformTransfers
                        lines={currentPlatformGroup.filter((line) => line !== train.getLine())}
                        hidden={inTransferTunnel}
                        onSelection={(line) => transfer(line)}
                    />
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
                    <Station
                        name={train.getCurrentStation().getName()}
                        hidden={train.getDirection() === Direction.DOWNTOWN}
                        noLines
                    />
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
                        <LineSVGs svgPaths={getLineSVG(gameState.destinationStation)} />
                    </Station>
                </div>
            </div>
        </>
    )
}

export default PassengerPlatformView
