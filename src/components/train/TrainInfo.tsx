import { useMemo } from 'react'

import './TrainInfo.css'

import { default as Line } from '../LineSVGs'
import { Direction, getLineType } from '../../logic/LineManager'
import { useTrainContext } from '../../contexts/TrainContext'
import { getLineSVG } from '../../logic/LineSVGsMap'
import { useLineStyles } from '../../hooks/useCSSProperties'

function TrainInfo({ direction, reverseButton }: { direction: Direction; reverseButton?: boolean }) {
    const changeDirection = useTrainContext((state) => state.actions.changeDirection)
    const line = useTrainContext((state) => state.train.getLine())
    const borough = useTrainContext((state) => state.train.getCurrentStation().getBorough())

    const lineType = useMemo(() => getLineType(line), [line])
    const lineSVG = useMemo(() => getLineSVG(line), [line])
    const directionLabel = useTrainContext((state) => state.train.findDirectionLabel(direction, line, borough))

    const isNullDirection: boolean = direction === Direction.NULL_DIRECTION

    useLineStyles(line, lineType) // updates CSS props (--line-color, --dot-color)

    return (
        <>
            <h2
                className={`train-direction not-dim ${isNullDirection ? 'is-null-direction' : ''} ${reverseButton ? '' : 'no-reverse-action'}`}
                {...(reverseButton
                    ? {
                          onMouseDown: () => {
                              changeDirection()
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
                <Line svgPaths={[lineSVG]} notDim disabled />
            </div>
            <h2 className='train-type not-dim'>{lineType + ' train'}</h2>
        </>
    )
}

export default TrainInfo
