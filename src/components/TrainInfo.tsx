import { default as Line } from './LineSVGs'

import './TrainInfo.css'
import { useSettingsContext } from '../contexts/SettingsContext'
import { useGameContext } from '../contexts/GameContext'
import { TrainLineInfo } from './TrainCar'
import { Direction } from '../logic/LineManager'

export interface TrainInfoProps extends TrainLineInfo {}

export function TrainInfo({ direction, directionLabel, currentLineSVG, lineType }: TrainInfoProps) {
    const { train, updateTrainObject } = useGameContext()

    const isNullDirection: boolean = direction === Direction.NULL_DIRECTION

    return (
        <>
            <h2
                onMouseDown={() => {
                    // defaultDirectionToggle
                    //     ? updateTrainObject(train.setDirection(defaultDirectionToggle))
                    //     : updateTrainObject({ ...train.reverseDirection() })
                    updateTrainObject({ ...train.reverseDirection() })
                }}
                className={`train-direction not-dim ${isNullDirection ? 'is-null-direction' : ''}`}
                style={
                    isNullDirection
                        ? {
                              borderColor: 'var(--line-color)',
                              textDecoration: 'underline',
                              textDecorationColor: 'var(--line-color)',
                              textUnderlineOffset: '4px',
                          }
                        : {}
                }
            >
                {isNullDirection ? 'TOGGLE DIRECTION' : directionLabel}
            </h2>
            <div className='train-car-line'>
                <Line transfers={[currentLineSVG]} notDim />
            </div>
            <h2 className='train-type not-dim'>{lineType + ' train'}</h2>
        </>
    )
}

export default TrainInfo
