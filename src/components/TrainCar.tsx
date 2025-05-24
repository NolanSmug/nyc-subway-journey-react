import { useEffect, useMemo } from 'react'
import Header from './Header'
import Door from './Door'
import TrainInfo from '../components/TrainInfo'

import './TrainCar.css'
import { Direction, LineType, LineName, getLineType } from '../logic/EnumManager'
import { getLineSVG, lineToLineColor } from '../logic/LineSVGsMap'
import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'

import R_ARROW_BLACK from '../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../images/right-arrow-w.svg'
import { useSettingsContext } from '../contexts/SettingsContext'
import DirectionSwitch from './DirectionSwitch'

export interface TrainLineInfo {
    direction: Direction
    directionLabel: string
    currentLine: LineName
    currentLineSVG: string
    lineType: LineType
}

function TrainCar() {
    const { isHorizontalLayout, isVerticalLayout, darkMode } = useUIContext()
    const { train } = useGameContext()
    const { conductorMode, defaultDirectionToggle, setDefaultDirectionToggle } = useSettingsContext()

    let ARROW = darkMode ? R_ARROW_WHITE : R_ARROW_BLACK

    // useMemo on functions that get from maps to mitigate re-rendering
    const currentLine = useMemo(() => train.getLine(), [train])
    const currentLineType = useMemo(() => getLineType(currentLine), [currentLine])
    const currentLineSvg = useMemo(() => getLineSVG(currentLine), [currentLine])[0]

    const trainInfo: TrainLineInfo = {
        direction: train.getDirection(),
        directionLabel: train.getDirectionLabel(),
        currentLine: currentLine,
        currentLineSVG: currentLineSvg,
        lineType: currentLineType,
    }

    useEffect(() => {
        document.documentElement.style.setProperty('--line-color', lineToLineColor(currentLine))
        document.documentElement.style.setProperty('--dot-color', currentLineType === LineType.LOCAL ? '#222' : '#fff')
    }, [currentLine, currentLineType])

    let arrowDirection: string = ''

    function updateArrowDirection(): void {
        // debugger
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
                        train.getDirection() === Direction.DOWNTOWN &&
                        isHorizontalLayout()
                            ? 'show'
                            : 'hide'
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
                            train.getDirection() === Direction.UPTOWN &&
                            isHorizontalLayout()
                                ? 'show'
                                : 'hide'
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
