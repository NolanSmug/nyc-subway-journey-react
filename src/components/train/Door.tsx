import './Door.css'
import { Ref, memo } from 'react'

interface DoorProps {
    ref?: Ref<HTMLDivElement>
    isLeft?: boolean
}

const Door = ({ ref, isLeft }: DoorProps) => {
    return <div ref={ref} className={`door ${isLeft ? 'door-left' : ''} `}></div>
}

export default memo(Door)
