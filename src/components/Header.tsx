import './Header.css'

interface HeaderProps {
    text: string
    img?: string
    beforeImgText?: string
    afterImgText?: string
}

function Header({ text, img, beforeImgText, afterImgText }: HeaderProps) {
    return (
        <div className="Header">
            <div className="headerText">
                <h1>{text}</h1>
            </div>
            <div className="img-text-container">
                {beforeImgText && <p>{beforeImgText}</p>}
                {img && <img src={img} alt="header image" className="lineImage" />}
                {afterImgText && <p>{afterImgText}</p>}
            </div>
        </div>
    )
}

export default Header
