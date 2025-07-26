import './TrainCar.css'
import './TrainCarCustom.css'

import { useEffect, useMemo } from 'react'
import TrainInfo from './TrainInfo'
import Door from './Door'
import ActionButton from './ActionButton'

import R_ARROW_BLACK from '../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../images/right-arrow-w.svg'
import { Direction, LineName } from '../logic/LineManager'

import useTrainActions from '../hooks/useTrainActions'
import { configureLineStyles } from '../hooks/useCSSProperties'
import { TrainLineInfo } from './TrainCar'
import { getLineType } from '../logic/LineManager'
import { getLineSVG } from '../logic/LineSVGsMap'
import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'
import { useSettingsContext } from '../contexts/SettingsContext'

interface TrainCarStaticProps {
    line: LineName
    direction: Direction
    active: boolean
    hidden?: boolean
}

function TrainCarCustom({ line, direction, active, hidden }: TrainCarStaticProps) {
    const { darkMode } = useUIContext()
    const { numAdvanceStations, conductorMode } = useSettingsContext()
    const { train, updateTrainObject, setGameState, gameState } = useGameContext()

    const { advanceStation } = useTrainActions({
        train,
        gameState,
        conductorMode,
        updateTrainObject,
        setGameState,
    })

    // if we were to call just train.getDirectionLabel()
    const directionLabel = useMemo(
        () => train.findDirectionLabel(direction, train.getLine(), train.getCurrentStation().getBorough()),
        [direction, train, train.getLine(), train.getCurrentStation().getBorough()]
    )

    // build TrainLineInfo object
    const lineType = useMemo(() => getLineType(line), [line])
    const lineSVG = useMemo(() => getLineSVG(line), [line])
    const trainInfo: TrainLineInfo = {
        direction: direction,
        directionLabel: directionLabel,
        line: line,
        lineSVG: lineSVG,
        lineType: lineType,
        reverseButton: false,
    }

    let ARROW = darkMode ? R_ARROW_WHITE : R_ARROW_BLACK

    const isDowntown = useMemo(() => direction === Direction.DOWNTOWN, [direction])
    const isUptown = useMemo(() => direction === Direction.UPTOWN, [direction])

    configureLineStyles(line, lineType)

    return (
        <div className={`train-wrapper ${isDowntown ? 'downtown' : 'uptown'} ${active ? '' : 'inactive'} ${hidden ? 'hidden' : ''}`}>
            <div className={`train-container `}>
                <div className='train-advance-button'>
                    {isDowntown && active && (
                        <ActionButton
                            imageSrc={ARROW}
                            imageClassName='arrow-left'
                            label='Advance'
                            onMouseDown={() => advanceStation(numAdvanceStations)}
                        />
                    )}
                </div>

                <div className={`train-car ${isDowntown ? 'flipped-layout' : ''}`}>
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

                <div className='train-advance-button'>
                    {isUptown && active && (
                        <ActionButton
                            imageSrc={ARROW}
                            imageClassName='arrow-right'
                            label='Advance'
                            onMouseDown={() => advanceStation(numAdvanceStations)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default TrainCarCustom
