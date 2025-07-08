import React from 'react'
import { LineName } from '../logic/LineManager'

import { getLineSVGs } from '../logic/LineSVGsMap'
import LineSVGs from './LineSVGs'

import './SamePlatformTransfers.css'

export interface SamePlatformTransfersProps {
    lines: LineName[]
    hidden: boolean
    onSelection: (line: LineName) => void
}

function SamePlatformTransfers({ lines, hidden, onSelection }: SamePlatformTransfersProps) {
    if (lines.length === 0) return null

    return (
        <div className={`accordion-wrapper ${hidden ? 'hidden' : ''}`}>
            <h3>Same platform transfer</h3>
            <div className={`accordion-svgs-container`}>
                <LineSVGs
                    svgPaths={getLineSVGs(lines)}
                    onTransferSelect={(index) => {
                        onSelection(lines[index])
                    }}
                    selectable
                ></LineSVGs>
            </div>
        </div>
    )
}

export default SamePlatformTransfers
