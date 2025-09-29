import { ReactNode } from 'react'
import './Station.css'

interface StationProps {
    name: string
    header?: ReactNode
    noLines?: boolean
    hidden?: boolean
    isDestination?: boolean
    children?: ReactNode
}

function Station({ name, header, noLines, hidden, isDestination, children }: StationProps) {
    const isGreaterThan20Chars = !noLines && name.length > 18

    return (
        <div className={`station-wrapper ${hidden ? 'hidden' : ''} ${noLines && !isDestination ? 'no-lines' : ''}`}>
            {header}
            <div className={`station-container`}>
                <h2 className={`station-name ${isGreaterThan20Chars ? 'shrink-station-name' : ''}`}>{name}</h2>
                {children && children}
            </div>
        </div>
    )
}

export default Station
