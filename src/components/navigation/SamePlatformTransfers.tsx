import './SamePlatformTransfers.css'
import React from 'react'

import LineSVGs from '../LineSVGs'

import { LineName } from '../../logic/LineManager'
import { getLineSVGs } from '../../logic/LineSVGsMap'

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
                ></LineSVGs>
            </div>
        </div>
    )
}

export default React.memo(SamePlatformTransfers)
