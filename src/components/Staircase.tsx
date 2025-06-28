import { useEffect, useState } from 'react'
import { LineName } from '../logic/LineManager'
import { getLineSVGs } from '../logic/LineSVGsMap'
import LineSVGs from './LineSVGs'

import './Statircase.css'

export interface StaircaseProps {
    lines: LineName[]
    tunnelLayout?: boolean
    hidden?: boolean
    onSelection?: (index: number) => void | undefined
}

function Staircase({ lines, tunnelLayout, onSelection, hidden }: StaircaseProps) {
    if (lines.length === 0) return null

    const [tunnelLinesVisible, setTunnelLinesVisible] = useState(false)

    // DELAY LINE SVGs VISIBILITY DURING TRANSITION
    useEffect(() => {
        if (tunnelLayout) {
            setTunnelLinesVisible(false)

            const timeout = setTimeout(() => {
                setTunnelLinesVisible(true)
            }, 1000)
            return () => clearTimeout(timeout)
        } else {
            setTunnelLinesVisible(false)
        }
    }, [tunnelLayout])

    return (
        <div className={`staircase-container ${tunnelLayout ? 'mirrored' : ''} ${hidden ? 'hidden' : ''}`}>
            <LineSVGs
                svgPaths={getLineSVGs(lines)}
                grouped
                numLines={lines.length}
                onTransferSelect={onSelection}
                className={tunnelLinesVisible ? 'show-flipped' : ''}
            />
            <div className={`staircase ${tunnelLayout ? 'mirrored' : ''}`}>
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
