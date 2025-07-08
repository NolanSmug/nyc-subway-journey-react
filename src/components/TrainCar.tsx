import { useEffect, useMemo } from 'react'

import Door from './Door'
import Header from './Header'
import TrainInfo from '../components/TrainInfo'
import DirectionSwitch from './DirectionSwitch'

import './TrainCar.css'
import { useGameContext } from '../contexts/GameContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import { useUIContext } from '../contexts/UIContext'

import { Direction, LineType, LineName, getLineType } from '../logic/LineManager'
import { getLineSVG, lineToLineColor } from '../logic/LineSVGsMap'

import R_ARROW_BLACK from '../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../images/right-arrow-w.svg'

export interface TrainLineInfo {
    direction: Direction
    directionLabel: string
    line: LineName
    lineSVG: string
    lineType: LineType
    reverseButton?: boolean
}

function TrainCar() {
    const { isHorizontalLayout, isVerticalLayout, darkMode } = useUIContext()
    const { train } = useGameContext()
    const { conductorMode, defaultDirectionToggle, setDefaultDirectionToggle } = useSettingsContext()

    let ARROW: string = darkMode ? R_ARROW_WHITE : R_ARROW_BLACK
    let arrowDirection: string = ''

    // useMemo on functions that get from maps to mitigate re-rendering
    const line = useMemo(() => train.getLine(), [train])
    const lineType = useMemo(() => getLineType(line), [line])
    const lineSVG = useMemo(() => getLineSVG(line), [line])[0]

    const trainInfo: TrainLineInfo = {
        direction: train.getDirection(),
        directionLabel: train.getDirectionLabel(),
        line: line,
        lineSVG: lineSVG,
        lineType: lineType,
        reverseButton: true,
    }

    useEffect(() => {
        document.documentElement.style.setProperty('--line-color', lineToLineColor(line))
        document.documentElement.style.setProperty('--dot-color', lineType === LineType.LOCAL ? '#222' : '#fff')
    }, [line, lineType])

    function updateArrowDirection(): void {
        if (isVerticalLayout()) {
            arrowDirection = train.getDirection() === Direction.DOWNTOWN ? 'down' : 'up'
        } else {
            arrowDirection = train.getDirection() === Direction.DOWNTOWN ? 'left' : 'right'
        }
    }

    useEffect(() => {
        updateArrowDirection()
    }, [updateArrowDirection])

    if (arrowDirection === '') {
        updateArrowDirection()
    }

    return (
        <>
            <Header text='Current Line'></Header>
            <div className='train-container'>
                <img
                    src={ARROW}
                    className={`arrow arrow-${arrowDirection} ${
                        train.getDirection() === Direction.DOWNTOWN && isHorizontalLayout() ? 'show' : 'hide'
                    }`}
                    alt='Left Arrow'
                />

                <div className='train-car'>
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
                        <TrainInfo {...trainInfo} />
                    </div>

                    <div className='doors'>
                        <Door isLeft />
                        <Door />
                    </div>

                    <div className='windows'>
                        <div className='front-window'> </div>
                    </div>
                </div>

                {isHorizontalLayout() && !train.isNullDirection() && (
                    <img
                        src={ARROW}
                        className={`arrow arrow-${arrowDirection} ${
                            train.getDirection() === Direction.UPTOWN && isHorizontalLayout() ? 'show' : 'hide'
                        }`}
                        alt='Right Arrow'
                    />
                )}
                {isVerticalLayout() && !train.isNullDirection() && (
                    <img src={ARROW} className={`arrow arrow-${arrowDirection}`} alt='Up/Down Arrow' />
                )}
            </div>
        </>
    )
}

export default TrainCar
