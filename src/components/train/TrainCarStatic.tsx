import React, { useMemo } from 'react'
import './TrainCar.css'
import './TrainCarStatic.css'

import TrainInfo from './TrainInfo'
import Door from './Door'
import ActionButton from '../common/ActionButton'

import R_ARROW_BLACK from '../../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../../images/right-arrow-w.svg'
import { Direction, LineName } from '../../logic/LineManager'

import { useUIContext } from '../../contexts/UIContext'
import { useSettingsContext } from '../../contexts/SettingsContext'

interface TrainCarStaticProps {
    line: LineName
    direction: Direction
    active: boolean
    hidden?: boolean
    uptownDoorRef?: React.RefObject<HTMLDivElement>
    downtownDoorRef?: React.RefObject<HTMLDivElement>
    advanceStation: (n: number) => void
}

function TrainCarStatic({ direction, active, hidden, uptownDoorRef, downtownDoorRef, advanceStation }: TrainCarStaticProps) {
    const darkMode = useUIContext((state) => state.darkMode)
    const numAdvanceStations = useSettingsContext((state) => state.numAdvanceStations)

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
                            imageClassName='arrow-left'
                            label='Advance'
                            onClick={() => advanceStation(numAdvanceStations)}
                        />
                    )}
                </div>

                <div className={`train-car ${isDowntown ? 'flipped-layout' : ''}`}>
                    <div className='doors'>
                        <Door ref={isUptown ? uptownDoorRef : null} isLeft hasPassenger={active} />
                        <Door key='door-lr' />
                    </div>
                    <div className='windows' id='train-info'>
                        <TrainInfo direction={direction} />
                    </div>

                    <div className='doors'>
                        <Door ref={isDowntown ? downtownDoorRef : null} key='door-rl' isLeft hasPassenger={active} />
                        <Door key='door-rr' />
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
                            onClick={() => advanceStation(numAdvanceStations)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default React.memo(TrainCarStatic)
