import './ActionButton.css'
import AdvanceNStationsInput from './AdvanceNStationsInput'

export interface ActionButtonProps {
    imageSrc: string
    label?: string
    onClick?: () => void
    className?: string
    small?: boolean
    additionalInput?: boolean
}

function ActionButton({ imageSrc, label, onClick, className, small, additionalInput }: ActionButtonProps) {
    return (
        <div className="action-button">
            <button className={`action-button-container ${className}`} onClick={onClick} type="button">
                <img src={imageSrc} className={`icon ${small ? 'small-button' : ''}`} alt={label} />
                <p className="label">{label}</p>
            </button>
            {additionalInput && <AdvanceNStationsInput />}
        </div>
    )
}

export default ActionButton
