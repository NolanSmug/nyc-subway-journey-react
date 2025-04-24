import './Header.css'

interface HeaderProps {
    text: string
    img?: string
    beforeImgText?: string
    afterImgText?: string
}

function Header({ text, img, beforeImgText, afterImgText }: HeaderProps) {
    return (
        <div className='Header not-dim'>
            <div className='headerText'>
                <h1>{text}</h1>
            </div>
            <div className='img-text-container'>
                {beforeImgText && <p>{beforeImgText}</p>}
                {img && <img src={img} alt={text} className='lineImage' />}
                {afterImgText && <p>{afterImgText}</p>}
            </div>
        </div>
    )
}

export default Header
