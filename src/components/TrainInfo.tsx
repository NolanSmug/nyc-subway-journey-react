import { default as Line } from '../components/TransferLines'

import './TrainInfo.css'
import { useSettingsContext } from '../contexts/SettingsContext'
import { useGameContext } from '../contexts/GameContext'
import { TrainLineInfo } from './TrainCar'
import { Direction } from '../logic/EnumManager'

export interface TrainInfoProps extends TrainLineInfo {}

export function TrainInfo({ direction, directionLabel, currentLineSVG, lineType }: TrainInfoProps) {
    const { train, updateTrainObject } = useGameContext()
    const { defaultDirectionToggle } = useSettingsContext()

    const isNullDirection: boolean = direction === Direction.NULL_DIRECTION

    return (
        <>
            <h2
                onClick={() => {
                    defaultDirectionToggle
                        ? updateTrainObject(train.setDirection(defaultDirectionToggle))
                        : updateTrainObject({ ...train.reverseDirection() })
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
                {isNullDirection ? 'Toggle Direction' : directionLabel}
            </h2>
            <div className="train-car-line">
                <Line transfers={[currentLineSVG]} notDim />
            </div>
            <h2 className="train-type not-dim">{lineType + ' Train'}</h2>
        </>
    )
}

export default TrainInfo
