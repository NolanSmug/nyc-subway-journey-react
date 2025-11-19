import './Staircase.css'
import React, { forwardRef, useEffect, useState } from 'react'

import LineSVGs from '../common/LineSVGs'

import { LineName } from '../../logic/LineManager'
import { useUIContext } from '../../contexts/UIContext'
import { getLineSVGs } from '../../logic/LineSVGsMap'

interface StaircaseProps {
    lines: LineName[]
    tunnelLayout?: boolean
    hidden?: boolean
    selectable?: boolean
    isSelected?: boolean
    onSelection?: (line: LineName) => void | undefined
}

const Staircase = forwardRef<HTMLDivElement, StaircaseProps>(
    ({ lines, tunnelLayout, selectable, isSelected, onSelection, hidden }, staircaseRef) => {
        if (lines.length === 0) return null

        const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)

        const [tunnelLinesVisible, setTunnelLinesVisible] = useState(false)

        // DELAY LINE SVGs VISIBILITY DURING TRANSITION
        useEffect(() => {
            if (tunnelLayout) {
                setTunnelLinesVisible(false)

                const timeout = setTimeout(() => {
                    setTunnelLinesVisible(true)
                    setIsTransferMode(lines.length > 1) // if we have a line selection, enable transfer UI overlay
                }, 1000)
                return () => clearTimeout(timeout)
            } else {
                setTunnelLinesVisible(false)
            }
        }, [tunnelLayout])

        // useEffect(() => {
        //     if (isSelected && staircaseRef.current) {
        //         walkPassenger(PassengerAction.TO_STAIRCASE, PassengerState.TRANSFER_TUNNEL, staircaseRef.current)
        //     }
        // }, [isSelected])

        return (
            <div className={`staircase-container ${tunnelLayout ? 'tunnel-expanded' : ''} ${hidden ? 'hidden' : ''}`}>
                <LineSVGs
                    svgPaths={getLineSVGs(lines)}
                    grouped
                    numLines={lines.length}
                    onTransferSelect={(index: number) => (onSelection && onSelection(lines[index])) || setIsTransferMode(false)}
                    className={tunnelLinesVisible ? 'show-flipped' : ''}
                    disabled={!selectable}
                    notDim
                />
                <div ref={isSelected ? staircaseRef : null} className={`staircase ${tunnelLayout ? 'tunnel-expanded' : ''}`}>
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
            </div>
        )
    }
)

export default React.memo(Staircase)
