// Train.tsx
import { ReactNode } from 'react'
import './TrainCar.css'
import Door from './Door'

export interface TrainCarProps {
    name?: string
    altName: string
    transfers?: JSX.Element[]
    header?: ReactNode
    children?: ReactNode
}

function TrainCar({ name, transfers, header, children, altName }: TrainCarProps) {
    return (
        <div className="train-container">
            {header}
            <div className="train-car">
                <div className="doors">
                    <Door isLeft />
                    <Door />
                </div>
                <div className="windows">
                    <h2 className="station-name">{name}</h2>
                    <div className="transfers-container">{transfers}</div>
                    {children}
                    <h2 className="station-alt-name">{altName}</h2>
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
