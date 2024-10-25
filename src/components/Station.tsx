// Station.tsx
import { ReactNode } from 'react'
import './Station.css'

export interface StationProps {
    name: string
    header?: ReactNode
    children?: ReactNode
}

function Station({ name, header, children }: StationProps) {
    return (
        <>
            {header}
            <div className="station-container">
                <h2 className="station-name">{name}</h2>
                {children}
            </div>
        </>
    )
}

export default Station
