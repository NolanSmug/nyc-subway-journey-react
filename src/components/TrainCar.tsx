import { ReactNode } from 'react'
import './TrainCar.css'
import Door from './Door'
import { lineToLineColor } from '../components/UpcomingStations'
import { useUIContext } from '../contexts/UIContext'
import { Direction, Train } from '../logic/TrainManager'

import R_ARROW_BLACK from '../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../images/right-arrow-w.svg'
import L_ARROW_BLACK from '../images/left-arrow-b.svg'
import L_ARROW_WHITE from '../images/left-arrow-w.svg'

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
    const { forceRenderRefresh, darkMode } = useUIContext()
    return (
        <div className="train-container">
            <img
                src={darkMode ? L_ARROW_WHITE : L_ARROW_BLACK}
                className={`arrow ${train.getDirection() === Direction.DOWNTOWN ? 'show' : 'hide'}`}
                alt="Left Arrow"
            />
            {header}
            <div className="train-car">
                <div className="doors">
                    <Door isLeft />
                    <Door />
                </div>

                <div className="windows" id="train-info">
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
                    <div className="train-car-line not-dim">{children}</div>
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
            <img
                src={darkMode ? R_ARROW_WHITE : R_ARROW_BLACK}
                className={`arrow ${train.getDirection() === Direction.UPTOWN ? 'show' : 'hide'}`}
                alt="Right Arrow"
            />
        </div>
    )
}

export default TrainCar
