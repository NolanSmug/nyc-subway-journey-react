import { ReactNode } from 'react'
import './Station.css'

export interface StationProps {
    name: string
    header?: ReactNode
    children?: ReactNode
}

function Station({ name, header, children }: StationProps) {
    const isGreaterThan20Chars = name.length > 18 || children!.toString().length > 10

    return (
        <>
            {header}
            <div className='station-container'>
                <h2 className={`station-name ${isGreaterThan20Chars ? 'shrink-station-name' : ''}`}>{name}</h2>
                {children}
            </div>
        </>
    )
}

export default Station
