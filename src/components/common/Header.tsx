import './Header.css'
import React from 'react'

interface HeaderProps {
    text: string
}

const Header = React.memo(({ text }: HeaderProps) => {
    return (
        <div className='header not-dim'>
            <h1>{text}</h1>
        </div>
    )
})

export default Header
