// Door.tsx
import React from 'react'
import './Door.css'

interface DoorProps {
    isLeft?: boolean
}

const Door: React.FC<DoorProps> = ({ isLeft }) => {
    return <div className={`door ${isLeft ? 'door-left' : ''}`}></div>
}

export default Door
