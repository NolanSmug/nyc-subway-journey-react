// Train.tsx
import { ReactNode } from 'react'
import './TrainCar.css'
import Door from './Door'

export interface TrainCarProps {
    trainDirection?: string
    trainType: string
    transfers?: JSX.Element[]
    header?: ReactNode
    children?: ReactNode
}

function TrainCar({ trainDirection, transfers, header, children, trainType }: TrainCarProps) {
    return (
        <div className="train-container">
            {header}
            <div className="train-car">
                <div className="doors">
                    <Door isLeft />
                    <Door />
                </div>
                <div className="windows">
                    <h2 className="train-direction not-dim">{trainDirection}</h2>
                    <div className="transfers-container not-dim">{transfers}</div>
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
