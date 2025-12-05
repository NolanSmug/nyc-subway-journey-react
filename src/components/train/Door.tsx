import './Door.css'
import React, { forwardRef } from 'react'

interface DoorProps {
    isLeft?: boolean
    hasPassenger?: boolean
}

const Door = forwardRef<HTMLDivElement, DoorProps>(({ isLeft, hasPassenger }, ref) => {
    return <div ref={ref} className={`door ${isLeft ? 'door-left' : ''} ${hasPassenger ? 'door-passenger' : ''}`}></div>
})

export default React.memo(Door)
