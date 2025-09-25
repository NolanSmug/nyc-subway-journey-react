import './TrainInfo.css'

import { TrainLineInfo } from './TrainCar'

import { default as Line } from '../LineSVGs'
import { Direction } from '../../logic/LineManager'
import { useGameContext } from '../../contexts/GameContext'

export interface TrainInfoProps extends TrainLineInfo {}

export function TrainInfo({ direction, directionLabel, lineSVG, lineType, reverseButton }: TrainInfoProps) {
    const { train, updateTrainObject } = useGameContext()

    const isNullDirection: boolean = direction === Direction.NULL_DIRECTION

    return (
        <>
            <h2
                className={`train-direction not-dim ${isNullDirection ? 'is-null-direction' : ''} ${reverseButton ? '' : 'no-reverse-action'}`}
                {...(reverseButton
                    ? {
                          onMouseDown: () => {
                              updateTrainObject({ ...train.reverseDirection() })
                          },
                      }
                    : null)}
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
