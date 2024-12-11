import { useGameContext } from '../contexts/GameContext'
import { default as Line } from '../components/TransferLines'

import './TrainInfo.css'
import { useSettingsContext } from '../contexts/SettingsContext'

export interface TrainInfoProps {
    isNullDirection: boolean
    currentLineSvg: string
}

export function TrainInfo({ isNullDirection, currentLineSvg }: TrainInfoProps) {
    const { train, updateTrainObject } = useGameContext()
    const { defaultDirectionToggle } = useSettingsContext()

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
                {isNullDirection ? 'Toggle Direction' : train.getDirectionLabel()}
            </h2>
            <div className="train-car-line">
                <Line transfers={[currentLineSvg]} notDim />
            </div>
            <h2 className="train-type not-dim">{train.getLineType() + ' Train'}</h2>
        </>
    )
}

export default TrainInfo
