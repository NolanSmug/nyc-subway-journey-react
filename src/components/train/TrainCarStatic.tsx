import './TrainCarStatic.css'
import React, { useMemo } from 'react'

import TrainInfo from './TrainInfo'
import Door from './Door'
import ActionButton from '../common/ActionButton'

import { useSettingsContext } from '../../contexts/SettingsContext'
import { useTrainContext } from '../../contexts/TrainContext'

import { Direction } from '../../logic/LineManager'

import R_ARROW_BLACK from '../../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../../images/right-arrow-w.svg'

interface TrainCarStaticProps {
    direction: Direction
    active: boolean
    hidden?: boolean
    uptownDoorRef?: React.RefObject<HTMLDivElement>
    downtownDoorRef?: React.RefObject<HTMLDivElement>
}

function TrainCarStatic({ direction, active, hidden, uptownDoorRef, downtownDoorRef }: TrainCarStaticProps) {
    const darkMode = useSettingsContext((state) => state.darkMode)
    const numAdvanceStations = useSettingsContext((state) => state.numAdvanceStations)
    const { advanceStation } = useTrainContext((state) => state.actions)

    const isDowntown = useMemo(() => direction === Direction.DOWNTOWN, [direction])
    const isUptown = useMemo(() => direction === Direction.UPTOWN, [direction])

    let ARROW = darkMode ? R_ARROW_WHITE : R_ARROW_BLACK

    return (
        <div className={`train-wrapper ${isDowntown ? 'downtown' : 'uptown'} ${active ? '' : 'inactive'} ${hidden ? 'hidden' : ''}`}>
            <div className={`train-container `}>
                <div className='train-advance-button'>
                    {isDowntown && active && (
                        <ActionButton
                            imageSrc={ARROW}
                            rotateDegrees={180} // left arrow
                            label='Advance'
                            onClick={() => advanceStation(numAdvanceStations)}
                        />
                    )}
                </div>

                <div className={`train-car ${isDowntown ? 'flipped-layout' : ''}`}>
                    <div className='doors'>
                        <Door key='door-ll' ref={isUptown ? uptownDoorRef : downtownDoorRef} isLeft hasPassenger={active} />
                        <Door key='door-lr' />
                    </div>
                    <div className='windows' id='train-info'>
                        <TrainInfo direction={direction} />
                    </div>

                    <div className='doors'>
                        <Door key='door-rl' isLeft />
                        <Door key='door-rr' />
                    </div>

                    <div className='windows'>
                        <div className='front-window'> </div>
                    </div>
                </div>

                <div className='train-advance-button'>
                    {isUptown && active && (
                        <ActionButton imageSrc={ARROW} label='Advance' onClick={() => advanceStation(numAdvanceStations)} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default React.memo(TrainCarStatic)
