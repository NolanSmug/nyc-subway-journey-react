import React, { useEffect, useRef } from 'react'

import './DirectionSwitch.css'
import { Direction } from '../../logic/LineManager'
import { useUIContext } from '../../contexts/UIContext'

import INFO_ICON_B from '../../images/info-icon-black.svg'
import INFO_ICON_W from '../../images/info-icon-white.svg'

interface DirectionSwitchProps {
    state: Direction
    onChange: (newState: Direction) => void
    visible?: boolean
}

export function DirectionSwitch({ state, onChange, visible }: DirectionSwitchProps) {
    const labelRef = useRef<HTMLSpanElement | null>(null)

    const { darkMode } = useUIContext()
    const infoIcon = darkMode ? INFO_ICON_W : INFO_ICON_B

    useEffect(() => {
        const timer = setTimeout(() => {
            if (labelRef.current) {
                labelRef.current.classList.add('direction-label-hidden')
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [state, visible]) // want to run on initial render too

    const handleClick = () => {
        let newState = Direction.NULL_DIRECTION
        if (state === Direction.UPTOWN) newState = Direction.NULL_DIRECTION
        else if (state === Direction.NULL_DIRECTION) newState = Direction.DOWNTOWN
        else if (state === Direction.DOWNTOWN) newState = Direction.UPTOWN
        onChange(newState)
    }

    if (!visible) return null

    return (
        <div className='direction-switch-container'>
            <button
                className='tri-state-toggle'
                data-state={state}
                onMouseDown={handleClick}
                role='switch'
                aria-label='Direction toggle'
                aria-checked={state !== Direction.NULL_DIRECTION}
            >
                <span
                    className={`direction-label ${
                        state === Direction.UPTOWN ? 'Uptown' : state === Direction.DOWNTOWN ? 'Downtown' : 'Null'
                    }`}
                    ref={labelRef}
                >
                    {state === Direction.UPTOWN ? 'Uptown' : state === Direction.DOWNTOWN ? 'Downtown' : 'Choose direction'}
                </span>
            </button>
            <div className='info-icon-container'>
                <img src={infoIcon} alt='Information' className='info-icon' />
                <div className='tooltip'>
                    Configure the default starting direction{' '}
                    <i>
                        <u>after transferring lines</u>
                    </i>
                </div>
            </div>
        </div>
    )
}

export default DirectionSwitch
