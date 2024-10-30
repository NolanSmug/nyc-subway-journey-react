import './ActionButton.css'

export interface ActionButtonProps {
    imageSrc: string
    label?: string
    onClick?: () => void
    className?: string
}

function ActionButton({ imageSrc, label, onClick, className }: ActionButtonProps) {
    return (
        <button className={`action-button-container ${className}`} onClick={onClick} type="button">
            <img src={imageSrc} className="icon" alt={label} />
            <p>{label}</p>
        </button>
    )
}

export default ActionButton
