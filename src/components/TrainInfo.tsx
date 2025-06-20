import { default as Line } from './LineSVGs'

import './TrainInfo.css'
import { useGameContext } from '../contexts/GameContext'
import { TrainLineInfo } from './TrainCar'
import { Direction } from '../logic/LineManager'

export interface TrainInfoProps extends TrainLineInfo {}

export function TrainInfo({ direction, directionLabel, lineSVG, lineType }: TrainInfoProps, noButton?: boolean) {
    const { train, updateTrainObject } = useGameContext()

    const isNullDirection: boolean = direction === Direction.NULL_DIRECTION

    return (
        <>
            <h2
                {...(noButton
                    ? null
                    : {
                          onMouseDown: () => {
                              updateTrainObject({ ...train.reverseDirection() })
                          },
                      })}
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
                <Line svgPaths={[lineSVG]} notDim />
            </div>
            <h2 className='train-type not-dim'>{lineType + ' train'}</h2>
        </>
    )
}

export default TrainInfo
