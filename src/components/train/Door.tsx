import './Door.css'
import React from 'react'

interface DoorProps {
    ref?: React.Ref<HTMLDivElement>
    isLeft?: boolean
}

const Door = ({ ref, isLeft }: DoorProps) => {
    return <div ref={ref} className={`door ${isLeft ? 'door-left' : ''} `}></div>
}

export default React.memo(Door)
