import { ReactNode } from 'react'
import './TrainCar.css'
import Door from './Door'
import { LineName } from '../logic/Line'
import { lineToLineColor } from '../components/UpcomingStations'

export interface TrainCarProps {
    trainDirection?: string
    flipDirection?: () => Promise<void>
    trainType: string
    trainLine?: LineName
    transfers?: JSX.Element[]
    header?: ReactNode
    children?: ReactNode
}

function TrainCar({ trainDirection, flipDirection, transfers, header, children, trainType, trainLine }: TrainCarProps) {
    const isNullDirection: string = trainDirection == 'Toggle Direction' ? 'is-null-direction' : ''
    const lineColor = trainLine ? lineToLineColor(trainLine) : 'Null_Train'
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
                        onClick={() => {
                            flipDirection && flipDirection()
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
                        {trainDirection}
                    </h2>
                    <div className="line-container not-dim">{transfers}</div>
                    {children}
                    <h2 className="train-type not-dim">{trainType}</h2>
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
