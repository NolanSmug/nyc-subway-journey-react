import { ReactNode } from 'react'
import './TrainCar.css'
import Door from './Door'
import { lineToLineColor } from '../components/UpcomingStations'
import { useUIContext } from '../contexts/UIContext'
import { Direction, Train } from '../logic/TrainManager'

export interface TrainCarProps {
    flipDirection: () => Promise<void>
    train: Train
    transfers?: JSX.Element[]
    header?: ReactNode
    children?: ReactNode
}

function TrainCar({ train, flipDirection, transfers, header, children }: TrainCarProps) {
    const isNullDirection: string = train.getDirection() === Direction.NULL_DIRECTION ? 'is-null-direction' : ''
    const lineColor = train.getLine() ? lineToLineColor(train.getLine()) : 'Null_Train'
    const { forceRenderRefresh } = useUIContext()
    return (
        <div className="train-container">
            {header}
            <div className="train-car">
                <div className="doors">
                    <Door isLeft />
                    <Door />
                </div>

                <div className="windows">
                    <h2
                        onClick={async () => {
                            await flipDirection()
                            forceRenderRefresh()
                        }}
                        className={`train-direction not-dim ${isNullDirection}`}
                        style={
                            isNullDirection
                                ? {
                                      borderColor: lineColor,
                                      textDecoration: 'underline',
                                      textDecorationColor: lineColor,
                                      textUnderlineOffset: '4px',
                                  }
                                : {}
                        }
                    >
                        {isNullDirection ? 'Toggle Direction' : train.getDirectionLabel()}
                    </h2>
                    <div className="line-container not-dim">{transfers}</div>
                    {children}
                    <h2 className="train-type not-dim">{train.getLineType() + ' Train'}</h2>
                </div>

                <div className="doors">
                    <Door isLeft />
                    <Door />
                </div>
                <div className="windows">
                    <div className="front-window"></div>
                </div>
            </div>
        </div>
    )
}

export default TrainCar
