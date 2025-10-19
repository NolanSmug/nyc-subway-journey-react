import { useCallback, useMemo } from 'react'

import Door from './Door'
import Header from '../common/Header'
import TrainInfo from './TrainInfo'
import DirectionSwitch from '../navigation/DirectionSwitch'

import './TrainCar.css'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useUIContext } from '../../contexts/UIContext'
import { useTrainContext } from '../../contexts/TrainContext'

import { Direction } from '../../logic/LineManager'

import R_ARROW_BLACK from '../../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../../images/right-arrow-w.svg'

function TrainCar({ forWinDisplay }: { forWinDisplay?: boolean }) {
    const direction = useTrainContext((state) => state.train.getDirection())
    const darkMode = useUIContext((state) => state.darkMode)
    const isHorizontalLayout = useUIContext((state) => state.isHorizontalLayout)
    const isVerticalLayout = useUIContext((state) => state.isVerticalLayout)

    const defaultDirectionToggle = useSettingsContext((state) => state.defaultDirectionToggle)
    const setDefaultDirectionToggle = useSettingsContext((state) => state.setDefaultDirectionToggle)

    const isNullDirection: boolean = direction === Direction.NULL_DIRECTION

    // arrow direction logic (yes I am using one image for it and rotating with css classes. who cares it's cool to save a few KBs when you can)
    let ARROW_SVG: string = darkMode ? R_ARROW_WHITE : R_ARROW_BLACK
    const arrowDirection = useMemo(() => {
        if (isNullDirection) return

        if (isVerticalLayout()) {
            return direction === Direction.DOWNTOWN ? 'down' : 'up'
        } else {
            return direction === Direction.DOWNTOWN ? 'left' : 'right'
        }
    }, [direction, isVerticalLayout])

    const handleDirectionChange = useCallback(
        (newDirection: Direction) => {
            setDefaultDirectionToggle(newDirection)
        },
        [setDefaultDirectionToggle]
    )

    return (
        <>
            {!forWinDisplay && <Header text={'Current line'}></Header>}
            <div className='train-container'>
                {!forWinDisplay && (
                    <img
                        src={ARROW_SVG}
                        className={`arrow arrow-${arrowDirection} ${
                            direction === Direction.DOWNTOWN && isHorizontalLayout() ? 'show' : 'hide'
                        }`}
                        alt='Left Arrow'
                    />
                )}

                <div className={`train-car ${forWinDisplay ? 'win-display' : ''}`}>
                    <DirectionSwitch state={defaultDirectionToggle} onChange={handleDirectionChange} visible={!forWinDisplay} />
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
                    </div>
                </div>

                {isHorizontalLayout() && !isNullDirection && !forWinDisplay && (
                    <img
                        src={ARROW_SVG}
                        className={`arrow arrow-${arrowDirection} ${
                            direction === Direction.UPTOWN && isHorizontalLayout() ? 'show' : 'hide'
                        }`}
                        alt='Right Arrow'
                    />
                )}
                {isVerticalLayout() && !isNullDirection && !forWinDisplay && (
                    <img src={ARROW_SVG} className={`arrow arrow-${arrowDirection}`} alt='Up/Down Arrow' />
                )}
            </div>
        </>
    )
}

export default TrainCar
