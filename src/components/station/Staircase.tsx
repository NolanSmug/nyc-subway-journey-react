import './Staircase.css'
import { useEffect, useRef, useState } from 'react'
import LineSVGs from '../LineSVGs'

import { LineName } from '../../logic/LineManager'
import { useUIContext } from '../../contexts/UIContext'
import { getLineSVGs } from '../../logic/LineSVGsMap'
import usePassengerActions from '../../hooks/usePassengerActions'

interface StaircaseProps {
    lines: LineName[]
    tunnelLayout?: boolean
    hidden?: boolean
    isSelected?: boolean
    onSelection?: (line: LineName) => void | undefined
}

// for use ref position: .getBoundingClientRect()

function Staircase({ lines, tunnelLayout, isSelected, onSelection, hidden }: StaircaseProps) {
    if (lines.length === 0) return null

    const { setIsTransferMode, setPassengerPosition, setPassengerState } = useUIContext()
    const { walkPassenger } = usePassengerActions({ setPassengerPosition, setPassengerState })

    const [tunnelLinesVisible, setTunnelLinesVisible] = useState(false)

    const staircaseRef = useRef<HTMLDivElement | null>(null)

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
                selectable={tunnelLinesVisible}
                notDim
            />
            <div ref={staircaseRef} className={`staircase ${tunnelLayout ? 'tunnel-expanded' : ''}`}>
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

export default Staircase
