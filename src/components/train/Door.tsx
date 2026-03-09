import './Door.css'
import React from 'react'

interface DoorProps {
    ref?: React.Ref<HTMLDivElement>
    isLeft?: boolean
    hasPassenger?: boolean
}

const Door = ({ ref, isLeft, hasPassenger }: DoorProps) => {
    return <div ref={ref} className={`door ${isLeft ? 'door-left' : ''} ${hasPassenger ? 'door-passenger' : ''}`}></div>
}

export default React.memo(Door)
