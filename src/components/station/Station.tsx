import './Station.css'
import { ReactNode, memo } from 'react'

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
    const long: boolean = name.length > 20 && children !== undefined && !across

    return (
        <div className={`station-wrapper ${hidden ? 'hidden' : ''} ${noLines && !isDestination ? 'no-lines' : ''}`}>
            {header}
            <div className={`station-container ${across ? 'across' : ''}`}>
                <h2 className={`station-name ${long ? 'long' : ''}`}>{name}</h2>
                {children && children}
            </div>
        </div>
    )
}

export default memo(Station)
