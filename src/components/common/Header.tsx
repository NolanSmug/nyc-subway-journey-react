import './Header.css'
import React from 'react'

interface HeaderProps {
    text: string
    colorHex?: string
}

const Header = React.memo(({ text, colorHex }: HeaderProps) => {
    return (
        <div className='header not-dim'>
            <h1 style={colorHex ? { color: colorHex } : {}}>{text}</h1>
        </div>
    )
})

export default Header
