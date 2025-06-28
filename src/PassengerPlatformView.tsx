import React, { useState } from 'react'
import { useGameContext } from './contexts/GameContext'
import TrainCarCustom from './components/TrainCarCustom'
import Staircase from './components/Staircase'
import { Direction, LineName } from './logic/LineManager'
import { groupLines, getCorrespondingGroup } from './logic/LineSVGsMap'

import './PassengerPlatformView.css'
import ActionButton from './components/ActionButton'

function PassengerPlatformView() {
    const { train, updateTrainObject } = useGameContext()

    const [inTransferTunnel, setInTransferTunnel] = useState<boolean>(false)
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null)

    const transfers: LineName[] = train
        .getCurrentStation()
        .getTransfers()
        .filter((transfer) => transfer != train.getLine()) // filter out current line from transfer options

    // sort transfers array into proper line groupings
    const groupedTransfers: LineName[][] = groupLines(transfers, train.getCurrentStation().getId(), train.getLine())

    return (
        <>
            <div className='platform-container'>
                <div className='transfer-stairs-left'>
                    {groupedTransfers.map((transfers, index) => (
                        <Staircase
                            key={index}
                            lines={transfers}
                            onSelection={() => {
                                setInTransferTunnel((prev) => !prev)
                                setSelectedGroupIndex(index)
                            }}
                            tunnelLayout={inTransferTunnel && selectedGroupIndex === index}
                            hidden={inTransferTunnel && selectedGroupIndex !== index}
                        />
                    ))}
                </div>

                <div className='train-cars-container'>
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
                </div>
            </div>
        </>
    )
}

export default PassengerPlatformView
