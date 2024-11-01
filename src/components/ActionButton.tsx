import './ActionButton.css'

export interface ActionButtonProps {
    imageSrc: string
    label?: string
    onClick?: () => void
    className?: string
    small?: boolean
}

function ActionButton({ imageSrc, label, onClick, className, small }: ActionButtonProps) {
    return (
        <button className={`action-button-container ${className}`} onClick={onClick} type="button">
            <img src={imageSrc} className={`icon ${small ? 'small-button' : ''}`} alt={label} />
            <p className="label">{label}</p>
        </button>
    )
}

export default ActionButton
