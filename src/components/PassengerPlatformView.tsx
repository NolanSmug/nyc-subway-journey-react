import './PassengerPlatformView.css'

import React, { useMemo, useState } from 'react'
import TrainCarCustom from './TrainCarCustom'
import Staircase from './Staircase'
import SamePlatformTransfers from './SamePlatformTransfers'
import ActionButton from './ActionButton'
import Station from './Station'
import LineSVGs from './LineSVGs'
import Header from './Header'

import { useSettingsContext } from '../contexts/SettingsContext'
import { useGameContext } from '../contexts/GameContext'
import { Direction, LineName } from '../logic/LineManager'
import { groupLines, getCorrespondingGroup, getLineSVG } from '../logic/LineSVGsMap'

import useTrainActions from '../hooks/useTrainActions'

function PassengerPlatformView() {
    const { train, gameState, setGameState, updateTrainObject } = useGameContext()
    const { conductorMode } = useSettingsContext()

    const [inTransferTunnel, setInTransferTunnel] = useState<boolean>(false)
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0)

    const transfers: LineName[] = train.getCurrentStation().getTransfers()
    const stationID = useMemo(() => train.getCurrentStation().getId(), [train])
    const currentLine = useMemo(() => train.getLine(), [train])

    // sort transfers array into proper line groupings
    const groupedTransfers = useMemo(() => groupLines(transfers, stationID), [transfers])

    const currentPlatformGroup = useMemo(
        () => getCorrespondingGroup(currentLine, groupedTransfers),
        [currentLine, groupedTransfers]
    ) // these are the lines that share the current train line's platform

    const otherPlatformGroups = useMemo(
        () => groupedTransfers.filter((g) => !g.includes(currentLine)),
        [groupedTransfers, currentLine]
    ) // all other lines at the station

    const { transfer } = useTrainActions({ train, gameState, conductorMode, updateTrainObject, setGameState })

    function selectTransferInTunnel(line: LineName, singleLineSelection: boolean): void {
        setInTransferTunnel((prev) => !prev)

        if (singleLineSelection) {
            setTimeout(() => {
                setInTransferTunnel(false)
                transfer(line)
            }, 1500) // wait for tunnel reveal
        }

        if (inTransferTunnel && line) {
            transfer(line)
        }
    }

    console.log(train.getDirection)

    return (
        <>
            <div className='platform-container'>
                <div className='transfer-stairs-left'>
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
                                setSelectedGroupIndex(index)
                                selectTransferInTunnel(line, transfers.length === 1)
                            }}
                            tunnelLayout={inTransferTunnel && selectedGroupIndex === index}
                            hidden={inTransferTunnel && selectedGroupIndex !== index}
                        />
                    ))}
                </div>

                <div className='train-cars-container'>
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
                <div className='destination-station-right' id='destination-station'>
                    <Station
                        header={<Header text='Destination station' />}
                        name={gameState.destinationStation.getName()}
                        noLines
                        isDestination
                    >
                        <LineSVGs svgPaths={getLineSVG(gameState.destinationStation)} />
                    </Station>
                </div>
            </div>
        </>
    )
}

export default PassengerPlatformView
