import { useEffect, useMemo } from 'react'

import Door from './Door'
import Header from '../common/Header'
import TrainInfo from './TrainInfo'
import DirectionSwitch from '../navigation/DirectionSwitch'

import './TrainCar.css'
import { useGameContext } from '../../contexts/GameContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useUIContext } from '../../contexts/UIContext'

import { useLineStyles } from '../../hooks/useCSSProperties'

import { Direction, LineType, LineName, getLineType } from '../../logic/LineManager'
import { getLineSVG } from '../../logic/LineSVGsMap'

import R_ARROW_BLACK from '../../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../../images/right-arrow-w.svg'

export interface TrainLineInfo {
    direction: Direction
    directionLabel: string
    line: LineName
    lineSVG: string
    lineType: LineType
    reverseButton?: boolean
}

function TrainCar({ forWinDisplay }: { forWinDisplay?: boolean }) {
    const { isHorizontalLayout, isVerticalLayout, darkMode } = useUIContext()
    const { train } = useGameContext()
    const { conductorMode, defaultDirectionToggle, setDefaultDirectionToggle } = useSettingsContext()

    const direction = train.getDirection()

    const line = useMemo(() => train.getLine(), [train])
    const lineType = useMemo(() => getLineType(line), [line])
    const lineSVG = useMemo(() => getLineSVG(line), [line])

    // arrow direction logic (yes I am using one image for it and rotating with css classes. who cares it's cool to save a few KBs when you can)
    let ARROW_SVG: string = darkMode ? R_ARROW_WHITE : R_ARROW_BLACK
    const arrowDirection = useMemo(() => {
        if (isVerticalLayout()) {
            return direction === Direction.DOWNTOWN ? 'down' : 'up'
        } else {
            return direction === Direction.DOWNTOWN ? 'left' : 'right'
        }
    }, [direction, isVerticalLayout])

    const trainInfo: TrainLineInfo = {
        direction: direction,
        directionLabel: train.getDirectionLabel(),
        line: line,
        lineSVG: lineSVG,
        lineType: lineType,
        reverseButton: true,
    }

    useLineStyles(line, lineType)

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
                    <DirectionSwitch
                        state={defaultDirectionToggle}
                        onChange={(newDirection: Direction) => {
                            setDefaultDirectionToggle(newDirection)
                        }}
                        visible={conductorMode}
                    />
                    <div className='doors'>
                        <Door isLeft />
                        <Door />
                    </div>

                    <div className='windows' id='train-info'>
                        <TrainInfo {...trainInfo} reverseButton={!forWinDisplay} />
                    </div>

                    <div className='doors'>
                        <Door isLeft />
                        <Door />
                    </div>

                    <div className='windows'>
                        <div className='front-window'> </div>
                    </div>
                </div>

                {isHorizontalLayout() && !train.isNullDirection() && !forWinDisplay && (
                    <img
                        src={ARROW_SVG}
                        className={`arrow arrow-${arrowDirection} ${
                            direction === Direction.UPTOWN && isHorizontalLayout() ? 'show' : 'hide'
                        }`}
                        alt='Right Arrow'
                    />
                )}
                {isVerticalLayout() && !train.isNullDirection() && !forWinDisplay && (
                    <img src={ARROW_SVG} className={`arrow arrow-${arrowDirection}`} alt='Up/Down Arrow' />
                )}
            </div>
        </>
    )
}

export default TrainCar
