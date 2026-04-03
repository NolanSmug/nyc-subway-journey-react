import './Header.css'
import { memo } from 'react'

interface HeaderProps {
    text: string
    colorHex?: string
}

const Header = memo(({ text, colorHex }: HeaderProps) => {
    return (
        <div className='header not-dim'>
            <h1 style={colorHex ? { color: colorHex } : {}}>{text}</h1>
        </div>
    )
})

export default Header
