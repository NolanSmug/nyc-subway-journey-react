import './TrainInfo.css'
import { useMemo } from 'react'

import { useTrainContext } from '../../contexts/TrainContext'
import { useLineStyles } from '../../hooks/useCSSProperties'

import { Direction, getLineType } from '../../logic/LineManager'
import { getLineSVG } from '../../logic/LineSVGsMap'
import { findDirectionLabel } from '../../logic/directionLabels'

function TrainInfo({ direction, reverseButton }: { direction: Direction; reverseButton?: boolean }) {
    const changeDirection = useTrainContext((state) => state.actions.changeDirection)
    const line = useTrainContext((state) => state.train.getLine())
    const borough = useTrainContext((state) => state.train.getCurrentStation().getBorough())

    const lineType = useMemo(() => getLineType(line), [line])
    const lineSVG = useMemo(() => getLineSVG(line), [line])
    const directionLabel = findDirectionLabel(direction, line, borough)

    const isNullDirection: boolean = direction === Direction.NULL_DIRECTION
    const shrinkDirectionLabel: boolean = directionLabel.length >= 20

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
            >
                <span
                    key={directionLabel}
                    className={`${!isNullDirection ? 'rollsign-animate' : ''} ${shrinkDirectionLabel ? 'small-label' : ''}`}
                    id='direction-rollsign'
                >
                    {isNullDirection ? 'TOGGLE DIRECTION' : directionLabel}
                </span>
            </h2>
            <div className='train-car-line line-svgs-container not-dim'>
                <img src={lineSVG} alt={line} className='line-svg-image disabled rollsign-animate' />
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
