import './TrainCarFront.css'

import { memo, useMemo } from 'react'
import { Direction, getLineType } from '../../../logic/LineManager'
import { useTrainContext } from '../../../contexts/TrainContext'
import { getLineSVG } from '../../../logic/LineSVGsMap'
import { findDirectionLabel } from '../../../utility/directionLabels'
import { useLineStyles } from '../../../hooks/useCSSProperties'

interface TrainCarFrontProps {
    changeDirection?: () => void
    forWinDisplay?: boolean
}

function TrainCarFront({ changeDirection, forWinDisplay = false }: TrainCarFrontProps) {
    const direction = useTrainContext((state) => state.train.getDirection())
    const line = useTrainContext((state) => state.train.getLine())
    const borough = useTrainContext((state) => state.train.getCurrentStation().getBorough())
    const lineSVG = useMemo(() => getLineSVG(line), [line])
    const lineType = useMemo(() => getLineType(line), [line])
    const directionLabel = findDirectionLabel(direction, line, borough)
    const isNullDirection: boolean = direction === Direction.NULL_DIRECTION
    const shrinkDirectionLabel: boolean = directionLabel.length >= 18

    useLineStyles(line, lineType)

    return (
        <div className='train-car-front-wrapper'>
            <div className={`train-car-front-container ${forWinDisplay ? 'win-display' : ''}`}>
                <div className='front-windows-row'>
                    <div className='window window-l'></div>
                    <div className='center-door'>
                        <div className='window window-c'></div>
                    </div>
                    <div className='window window-r'>
                        <img src={lineSVG} alt={line} className='front-line-svg-image rollsign-animate not-dim' draggable={false} />
                    </div>
                </div>

                <div className='front-lights-row'>
                    <div className='light-cluster'>
                        <div className='marker-light red'></div>
                        <div className='marker-light white'></div>
                    </div>
                    <div className='light-cluster'>
                        <div className='marker-light red'></div>
                        <div className='marker-light white'></div>
                    </div>
                </div>

                <div className='front-train-info' onPointerDown={() => changeDirection && changeDirection()} style={{ cursor: 'pointer' }}>
                    <span
                        key={directionLabel}
                        className={`front-direction-label ${!isNullDirection ? 'rollsign-animate' : ''} ${shrinkDirectionLabel || isNullDirection ? 'front-label-small' : ''} ${isNullDirection ? 'is-null-direction' : ''}`}
                    >
                        {isNullDirection && !forWinDisplay ? 'TOGGLE DIRECTION' : directionLabel}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default memo(TrainCarFront)
