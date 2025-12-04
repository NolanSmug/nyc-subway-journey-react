import './SamePlatformTransfers.css'
import React from 'react'

import LineSVGs from '../common/LineSVGs'

import { LineName } from '../../logic/LineManager'
import { getLineSVGs } from '../../logic/LineSVGsMap'
import { useTrainContext } from '../../contexts/TrainContext'

interface SamePlatformTransfersProps {
    lines: LineName[]
    hidden: boolean
}

function SamePlatformTransfers({ lines, hidden }: SamePlatformTransfersProps) {
    const { transfer } = useTrainContext((state) => state.actions)

    return (
        <div className={`accordion-wrapper ${hidden ? 'hidden' : ''}`}>
            <h3 style={{ margin: 0 }}>Same platform transfer</h3>
            <div className={`accordion-svgs-container`}>
                <LineSVGs
                    svgPaths={getLineSVGs(lines)}
                    onTransferSelect={(index) => {
                        transfer(lines[index])
                    }}
                    numLines={lines.length}
                ></LineSVGs>
            </div>
        </div>
    )
}

export default React.memo(SamePlatformTransfers)
