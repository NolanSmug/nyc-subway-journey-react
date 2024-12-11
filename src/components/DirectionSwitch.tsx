import React, { useEffect, useRef, useState } from 'react'
import './DirectionSwitch.css'
import { Direction } from '../logic/EnumManager'

import INFO_ICON_B from '../images/info-icon-black.svg'
import INFO_ICON_W from '../images/info-icon-white.svg'
import { useUIContext } from '../contexts/UIContext'

interface DirectionSwitchProps {
    state: Direction
    onChange: (newState: Direction) => void
    visible?: boolean
}

export function DirectionSwitch({ state, onChange, visible }: DirectionSwitchProps) {
    const [tooltipHidden, setTooltipHidden] = useState(true)
    const labelRef = useRef<HTMLSpanElement | null>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    const { darkMode } = useUIContext()
    const infoIcon = darkMode ? INFO_ICON_W : INFO_ICON_B

    useEffect(() => {
        setTimeout(() => {
            if (labelRef.current) {
                labelRef.current.className =
                    'direction-label ' + (state === Direction.NULL_DIRECTION ? 'Null' : state) + ' direction-label-hidden'
            }
        }, 500)
    }, [state])

    const toggleTooltip = () => {
        setTooltipHidden((divv) => !divv)
    }

    const handleClick = () => {
        let newState = Direction.NULL_DIRECTION
        if (state === Direction.UPTOWN) newState = Direction.NULL_DIRECTION
        else if (state === Direction.NULL_DIRECTION) newState = Direction.DOWNTOWN
        else if (state === Direction.DOWNTOWN) newState = Direction.UPTOWN
        onChange(newState)
    }

    return (
        <div className={`direction-switch-container ${!visible ? 'hide-direction-switch' : ''}`}>
            <div
                className="tri-state-toggle"
                data-state={state}
                onClick={handleClick}
                role="switch"
                aria-label="Direction toggle"
            >
                <span
                    className={`direction-label ${
                        state === Direction.UPTOWN ? 'Uptown' : state === Direction.DOWNTOWN ? 'Downtown' : 'Null'
                    }`}
                    ref={labelRef}
                >
                    {state === Direction.UPTOWN ? 'Uptown' : state === Direction.DOWNTOWN ? 'Downtown' : 'Choose Direction'}
                </span>
            </div>
            <div className="info-icon-container">
                <img
                    src={infoIcon}
                    alt="Information"
                    className="info-icon"
                    onClick={toggleTooltip} // Toggle tooltip visibility when clicking the icon
                />
                <div ref={tooltipRef} className={`tooltip ${tooltipHidden ? 'tooltip-hidden' : ''}`}>
                    <div>Configure the default starting direction after transferring lines </div>
                    <div>
                        <u id={tooltipHidden ? '' : 'tooltip-click'} onClick={tooltipHidden ? undefined : toggleTooltip}>
                            Click to hide/show
                        </u>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DirectionSwitch
