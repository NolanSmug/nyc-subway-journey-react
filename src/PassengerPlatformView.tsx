import React from 'react'
import { useGameContext } from './contexts/GameContext'
import TrainCarCustom from './components/TrainCarCustom'
import Staircase from './components/Staircase'
import { Direction, LineName } from './logic/LineManager'
import { groupLines } from './logic/LineSVGsMap'

import './PassengerPlatformView.css'
import ActionButton from './components/ActionButton'

function PassengerPlatformView() {
    const { train, updateTrainObject } = useGameContext()

    const transfers: LineName[] = train
        .getCurrentStation()
        .getTransfers()
        .filter((transfer) => transfer != train.getLine()) // filter out current line from transfer options

    const groupedTransfers = groupLines(transfers, train.getCurrentStation().getId(), train.getLine())

    return (
        <>
            <div className='platform-container'>
                <div className='transfer-stairs-left'>
                    {groupedTransfers.map((transfers, index) => (
                        <Staircase key={index} lines={transfers} />
                    ))}
                </div>

                <div className='train-cars-container'>
                    <TrainCarCustom
                        line={train.getLine()}
                        direction={Direction.UPTOWN}
                        active={train.getDirection() === Direction.UPTOWN}
                    />
                    <ActionButton
                        label='board uptown train'
                        noImage
                        onMouseDown={() => updateTrainObject({ ...train.setDirection(Direction.UPTOWN) })}
                        visible={train.getDirection() === Direction.DOWNTOWN || train.isNullDirection()}
                        wrapperClassName='uptown-button-offset'
                    />

                    <div className='platform'></div>

                    <ActionButton
                        label='board downtown train'
                        noImage
                        onMouseDown={() => updateTrainObject({ ...train.setDirection(Direction.DOWNTOWN) })}
                        visible={train.getDirection() === Direction.UPTOWN || train.isNullDirection()}
                        wrapperClassName='downtown-button-offset'
                    />
                    <TrainCarCustom
                        line={train.getLine()}
                        direction={Direction.DOWNTOWN}
                        active={train.getDirection() === Direction.DOWNTOWN}
                    />
                </div>
            </div>
        </>
    )
}

export default PassengerPlatformView
