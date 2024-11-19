import { useUIContext } from '../contexts/UIContext'
import './ActionButton.css'

export interface ActionButtonProps {
    imageSrc: string
    label?: string
    onClick?: () => void
    className?: string
    small?: boolean
    additionalInput?: boolean
}

function ActionButton({ imageSrc, label, onClick, className, small, additionalInput }: ActionButtonProps) {
    const { setNumAdvanceStations } = useUIContext()
    return (
        <div className="action-button">
            <button className={`action-button-container ${className}`} onClick={onClick} type="button">
                <img src={imageSrc} className={`icon ${small ? 'small-button' : ''}`} alt={label} />
                <p className="label">{label}</p>
            </button>
            {additionalInput && (
                <input
                    type="number"
                    defaultValue={1}
                    onChange={(e) => setNumAdvanceStations(parseInt(e.target.value))}
                    className="additional-input"
                    placeholder="1"
                    min={1}
                    max={99}
                    onInput={(e) => e.currentTarget.validity.valid || (e.currentTarget.value = '')} // ensure input is in range
                />
            )}
        </div>
    )
}

export default ActionButton
