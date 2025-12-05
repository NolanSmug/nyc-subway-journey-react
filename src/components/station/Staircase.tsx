import './Staircase.css'
import React, { forwardRef, useEffect, useState } from 'react'

import LineSVGs from '../common/LineSVGs'
import ActionButton from '../common/ActionButton'

import { useSettingsContext } from '../../contexts/SettingsContext'

import { PASSENGER_WALK_DURATIONS, PassengerAction } from '../../hooks/usePassenger'

import { LineName } from '../../logic/LineManager'
import { useUIContext } from '../../contexts/UIContext'
import { getLineSVGs } from '../../logic/LineSVGsMap'

import RIGHT_ARROW_BLACK from '../../images/right-arrow-b.svg'
import RIGHT_ARROW_WHITE from '../../images/right-arrow-w.svg'

interface StaircaseProps {
    lines: LineName[]

    isTunnelLayout: boolean
    isWalking: boolean
    isHidden: boolean
    isDisabled: boolean

    onStairSelect: () => void
    onStairDeselect: () => void
    onTransferSelect: (line: LineName) => void
}

const Staircase = forwardRef<HTMLDivElement, StaircaseProps>(
    ({ lines, isTunnelLayout, isWalking, isHidden, isDisabled, onStairSelect, onTransferSelect, onStairDeselect: exitStaircase }, ref) => {
        if (lines.length === 0) return null

        const darkMode = useSettingsContext((state) => state.darkMode)
        const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)

        const [tunnelLinesVisible, setTunnelLinesVisible] = useState(false)

        // DELAY LINE SVGs VISIBILITY DURING TUNNEL EXPANSION TRANSITION
        useEffect(() => {
            if (isTunnelLayout) {
                setTunnelLinesVisible(false)

                const timeout = setTimeout(() => {
                    setTunnelLinesVisible(true)
                    setIsTransferMode(lines.length > 1) // if we have a line selection, enable transfer dim
                }, PASSENGER_WALK_DURATIONS[PassengerAction.DOWN_STAIRCASE])
                return () => clearTimeout(timeout)
            } else {
                setTunnelLinesVisible(false)
                setIsTransferMode(false)
            }
        }, [isTunnelLayout])

        return (
            <div
                className={`staircase-container ${isTunnelLayout ? 'tunnel-expanded' : ''} ${isHidden ? 'hidden' : ''} ${isWalking ? 'passenger-walk-tunnel' : ''} ${!isDisabled ? 'selectable' : ''}`}
                onClick={isTunnelLayout || isDisabled ? undefined : onStairSelect}
                style={{
                    transition: `opacity 1s ease, transform 0.5s ease, left ${PASSENGER_WALK_DURATIONS[PassengerAction.UP_STAIRCASE]}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                }}
            >
                <LineSVGs
                    svgPaths={getLineSVGs(lines)}
                    grouped
                    numLines={lines.length}
                    onTransferSelect={isTunnelLayout ? (index: number) => onTransferSelect(lines[index]) : undefined}
                    className={tunnelLinesVisible ? 'show-flipped' : ''}
                    disabled={(isDisabled && !isTunnelLayout) || isWalking}
                    notDim={isTunnelLayout}
                />
                <div ref={ref} className={`staircase ${isTunnelLayout ? 'tunnel-expanded' : ''}`}>
                    <div className='steps'>
                        <div className='step first'></div>
                        <div className='step'></div>
                        <div className='step'></div>
                        <div className='step middle'></div>
                        <div className='step middle'></div>
                        <div className='step smaller'></div>
                        <div className='step smaller'></div>
                        <div className='step last'></div>
                    </div>
                </div>
                <ActionButton
                    onClick={exitStaircase}
                    imageSrc={darkMode ? RIGHT_ARROW_WHITE : RIGHT_ARROW_BLACK}
                    small
                    rotateDegrees={135}
                    hidden={!isTunnelLayout || !tunnelLinesVisible}
                ></ActionButton>
            </div>
        )
    }
)

export default React.memo(Staircase)
