import { useEffect, useMemo } from 'react'
import Header from './Header'
import Door from './Door'
import TrainInfo from '../components/TrainInfo'

import './TrainCar.css'
import { Direction, LineType, LineName } from '../logic/EnumManager'
import { getTransferImageSvg, lineToLineColor } from '../logic/TransferImageMap'
import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'

import R_ARROW_BLACK from '../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../images/right-arrow-w.svg'
import L_ARROW_BLACK from '../images/left-arrow-b.svg'
import L_ARROW_WHITE from '../images/left-arrow-w.svg'
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
    const { upcomingStationsVertical, darkMode } = useUIContext()
    const { train } = useGameContext()
    const { conductorMode, defaultDirectionToggle, setDefaultDirectionToggle } = useSettingsContext()

    const UPTOWN_DIRECTION_ICON = darkMode ? R_ARROW_WHITE : R_ARROW_BLACK
    const DOWNTOWN_DIRECTION_ICON = darkMode ? L_ARROW_WHITE : L_ARROW_BLACK

    // useMemo on functions that get from maps to mitigate re-rendering
    const currentLine = useMemo(() => train.getLine(), [train])
    const currentLineType = useMemo(() => train.getLineType(), [train])
    const currentLineSvg = useMemo(() => getTransferImageSvg(currentLine), [currentLine])[0]

    const trainInfo: TrainLineInfo = {
        direction: train.getDirection(),
        directionLabel: train.getDirectionLabel(),
        currentLine: currentLine,
        currentLineSVG: currentLineSvg,
        lineType: currentLineType,
    }

    useEffect(() => {
        // Are you procedurally generating css rn? Dude either use classes or put in the react dom.
        //
        // I would not guess to look here
        document.documentElement.style.setProperty('--line-color', lineToLineColor(currentLine))
        document.documentElement.style.setProperty('--dot-color', currentLineType === LineType.LOCAL ? '#222' : '#fff')
    }, [currentLine, currentLineType])

    return (
        <>
            <Header text="Current Line"></Header>
            <div className="train-container">
                <img
                    src={DOWNTOWN_DIRECTION_ICON}
                    className={`arrow ${
                        train.getDirection() === Direction.DOWNTOWN && !upcomingStationsVertical ? 'show' : 'hide'
                    }`}
                    alt="Left Arrow"
                />

                <div className="train-car">
                    <DirectionSwitch
                        state={defaultDirectionToggle}
                        onChange={(newDirection: Direction) => {
                            setDefaultDirectionToggle(newDirection)
                        }}
                        visible={conductorMode}
                    />
                    <div className="doors">
                        <Door isLeft />
                        <Door />
                    </div>

                    <div className="windows" id="train-info">
                        <TrainInfo {...trainInfo} />
                    </div>

                    <div className="doors">
                        <Door isLeft />
                        <Door />
                    </div>

                    <div className="windows">
                        <div className="front-window"> </div>
                    </div>
                </div>
                <img
                    src={UPTOWN_DIRECTION_ICON}
                    className={`arrow ${
                        train.getDirection() === Direction.UPTOWN && !upcomingStationsVertical ? 'show' : 'hide'
                    }`}
                    alt="Right Arrow"
                />
                {upcomingStationsVertical && !train.isNullDirection() && (
                    <img
                        src={train.getDirection() === Direction.UPTOWN ? UPTOWN_DIRECTION_ICON : DOWNTOWN_DIRECTION_ICON}
                        className="arrow-vertical"
                        alt="Up/Down Arrow"
                    />
                )}
            </div>
        </>
    )
}

export default TrainCar
