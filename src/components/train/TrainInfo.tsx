import './TrainInfo.css'
import { useMemo } from 'react'

import { useTrainContext } from '../../contexts/TrainContext'

import { Direction, getLineType } from '../../logic/LineManager'
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

    useLineStyles(line, lineType)

    return (
        <>
            <h2
                className={`train-direction not-dim ${isNullDirection ? 'is-null-direction' : ''} ${reverseButton ? '' : 'no-reverse-action'}`}
                {...(reverseButton
                    ? {
                          onMouseUp: () => {
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
                <span key={directionLabel} className={`${!isNullDirection ? 'rollsign-animate' : ''}`} id='direction-rollsign'>
                    {isNullDirection ? 'TOGGLE DIRECTION' : directionLabel}
                </span>
            </h2>
            <div className='train-car-line line-svgs-container not-dim'>
                <img src={lineSVG} alt={line} className='line-svg-image disabled rollsign-animate' style={{ padding: '0.15em' }} />
            </div>
            <h2 className='train-type not-dim'>
                <span key={lineType} className={`${!isNullDirection ? 'rollsign-animate' : ''}`} id='type-rollsign'>
                    {lineType + ' train'}
                </span>
            </h2>
        </>
    )
}

export default TrainInfo
