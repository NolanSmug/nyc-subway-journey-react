// Station.tsx
import { ReactNode } from 'react'
import './Station.css'

export interface StationProps {
    name: string
    transfers?: JSX.Element[]
    header?: ReactNode
    children?: ReactNode
}

function Station({ name, transfers, header, children }: StationProps) {
    return (
        <>
            {header}
            <div className="station-container">
                <h2 className="station-name">{name}</h2>
                <div className="transfers-container">{transfers}</div>
                {children}
            </div>
        </>
    )
}

export default Station
