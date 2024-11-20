import { ReactNode } from 'react'
import './TrainCar.css'
import Door from './Door'
import { useUIContext } from '../contexts/UIContext'
import { Direction, Train } from '../logic/TrainManager'

import R_ARROW_BLACK from '../images/right-arrow-b.svg'
import R_ARROW_WHITE from '../images/right-arrow-w.svg'
import L_ARROW_BLACK from '../images/left-arrow-b.svg'
import L_ARROW_WHITE from '../images/left-arrow-w.svg'

export interface TrainCarProps {
    flipDirection: () => Promise<void>
    train: Train
    header?: ReactNode
    children?: ReactNode
}

function TrainCar({ train, flipDirection, header, children }: TrainCarProps) {
    const isNullDirection: string = train.getDirection() === Direction.NULL_DIRECTION ? 'is-null-direction' : ''
    const { forceRenderRefresh, currentLineColor, upcomingStationsVertical, darkMode } = useUIContext()

    const UPTOWN_DIRECTION_ICON = darkMode ? R_ARROW_WHITE : R_ARROW_BLACK
    const DOWNTOWN_DIRECTION_ICON = darkMode ? L_ARROW_WHITE : L_ARROW_BLACK

    return (
        <div className="train-container">
            <img
                src={DOWNTOWN_DIRECTION_ICON}
                className={`arrow ${train.getDirection() === Direction.DOWNTOWN && !upcomingStationsVertical ? 'show' : 'hide'}`}
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
                                      borderColor: currentLineColor,
                                      textDecoration: 'underline',
                                      textDecorationColor: currentLineColor,
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
                src={UPTOWN_DIRECTION_ICON}
                className={`arrow ${train.getDirection() === Direction.UPTOWN && !upcomingStationsVertical ? 'show' : 'hide'}`}
                alt="Right Arrow"
            />
            {upcomingStationsVertical && !isNullDirection && (
                <img
                    src={train.getDirection() === Direction.UPTOWN ? UPTOWN_DIRECTION_ICON : DOWNTOWN_DIRECTION_ICON}
                    className="arrow-vertical"
                    alt="Up/Down Arrow"
                />
            )}
        </div>
    )
}

export default TrainCar
