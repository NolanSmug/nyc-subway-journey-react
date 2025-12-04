import './TrainCar.css'
import React, { useMemo } from 'react'

import Door from './Door'
import Header from '../common/Header'
import TrainInfo from './TrainInfo'

import { UpcomingStationsLayout, useSettingsContext } from '../../contexts/SettingsContext'
import { useTrainContext } from '../../contexts/TrainContext'

import { Direction } from '../../logic/LineManager'

import R_ARROW_BLACK from '../../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../../images/right-arrow-w.svg'

function TrainCar({ forWinDisplay }: { forWinDisplay?: boolean }) {
    const direction = useTrainContext((state) => state.train.getDirection())
    const darkMode = useSettingsContext((state) => state.darkMode)
    const isHorizontalLayout = useSettingsContext((state) => state.upcomingStationsLayout === UpcomingStationsLayout.HORIZONTAL)
    const isVerticalLayout = !isHorizontalLayout

    const isNullDirection: boolean = direction === Direction.NULL_DIRECTION

    // arrow direction logic (yes I am using one image for it and rotating with css classes. who cares it's cool to save a few KBs when you can)
    let ARROW_SVG: string = darkMode ? R_ARROW_WHITE : R_ARROW_BLACK
    const arrowDirection = useMemo(() => {
        if (isNullDirection) return

        if (isVerticalLayout) {
            return direction === Direction.DOWNTOWN ? 'down' : 'up'
        } else {
            return direction === Direction.DOWNTOWN ? 'left' : 'right'
        }
    }, [direction, isVerticalLayout])

    return (
        <>
            {!forWinDisplay && <Header text={'Current line'}></Header>}
            <div className='train-container'>
                {!forWinDisplay && (
                    <img
                        src={ARROW_SVG}
                        className={`arrow arrow-${arrowDirection} ${
                            direction === Direction.DOWNTOWN && isHorizontalLayout ? 'show' : 'hide'
                        }`}
                        alt='Left Arrow'
                    />
                )}

                <div className={`train-car ${forWinDisplay ? 'win-display' : ''}`}>
                    <div className='doors'>
                        <Door isLeft />
                        <Door />
                    </div>

                    <div className='windows' id='train-info'>
                        <TrainInfo direction={direction} reverseButton={!forWinDisplay} />
                    </div>

                    <div className='doors'>
                        <Door isLeft />
                        <Door />
                    </div>

                    <div className='windows'>
                        <div className='front-window'> </div>
                        {/* <div className='front-light'></div> */}
                    </div>
                </div>

                {isHorizontalLayout && !isNullDirection && !forWinDisplay && (
                    <img
                        src={ARROW_SVG}
                        className={`arrow arrow-${arrowDirection} ${
                            direction === Direction.UPTOWN && isHorizontalLayout ? 'show' : 'hide'
                        }`}
                        alt='Right Arrow'
                    />
                )}
                {isVerticalLayout && !isNullDirection && !forWinDisplay && (
                    <img src={ARROW_SVG} className={`arrow arrow-${arrowDirection}`} alt='Up/Down Arrow' />
                )}
            </div>
        </>
    )
}

export default React.memo(TrainCar)
