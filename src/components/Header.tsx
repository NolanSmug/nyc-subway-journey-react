import './Header.css'

interface HeaderProps {
    text: string
}

function Header({ text }: HeaderProps) {
    return (
        <div className='header not-dim'>
            <h1>{text}</h1>
        </div>
    )
}

export default Header
