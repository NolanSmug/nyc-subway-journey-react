import React from 'react'
import { LineName } from '../../logic/LineManager'

import { getLineSVGs } from '../../logic/LineSVGsMap'
import LineSVGs from '../LineSVGs'

import './SamePlatformTransfers.css'

interface SamePlatformTransfersProps {
    lines: LineName[]
    hidden: boolean
    passengerIsWalking?: boolean
    onSelection: (line: LineName) => void
}

function SamePlatformTransfers({ lines, hidden, passengerIsWalking, onSelection }: SamePlatformTransfersProps) {
    return (
        <div className={`accordion-wrapper ${hidden ? 'hidden' : ''}`}>
            <h3 style={{ margin: 0 }}>Same platform transfer</h3>
            <div className={`accordion-svgs-container`}>
                <LineSVGs
                    svgPaths={getLineSVGs(lines)}
                    onTransferSelect={(index) => {
                        onSelection(lines[index])
                    }}
                    numLines={lines.length}
                    selectable
                ></LineSVGs>
            </div>
        </div>
    )
}

export default SamePlatformTransfers
