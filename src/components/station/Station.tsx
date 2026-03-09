import './Station.css'
import React, { ReactNode } from 'react'

interface StationProps {
    name: string
    header?: ReactNode
    noLines?: boolean
    hidden?: boolean
    across?: boolean
    isDestination?: boolean
    children?: ReactNode
}

function Station({ name, header, noLines, hidden, across, isDestination, children }: StationProps) {
    const shrinkName: boolean = name.length > 20 && children !== undefined && !across

    return (
        <div className={`station-wrapper ${hidden ? 'hidden' : ''} ${noLines && !isDestination ? 'no-lines' : ''}`}>
            {header}
            <div className={`station-container ${across ? 'across' : ''}`}>
                <h2 className={`station-name ${shrinkName ? 'shrink-station-name' : undefined}`}>{name}</h2>
                {children && children}
            </div>
        </div>
    )
}

export default React.memo(Station)
