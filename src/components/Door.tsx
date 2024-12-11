import React from 'react'
import './Door.css'

interface DoorProps {
    isLeft?: boolean
}

const Door = ({ isLeft }: DoorProps) => {
    return <div className={`door ${isLeft ? 'door-left' : ''}`}></div>
}

export default Door
