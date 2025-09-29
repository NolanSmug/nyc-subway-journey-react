import ActionButton from './ActionButton'
import './SettingsButton.css'

interface SettingsButtonProps {
    label: string
    imgSrc: string
    onClick: () => void
    disabled?: boolean
}

function SettingsButton({ imgSrc, label, onClick, disabled }: SettingsButtonProps) {
    return (
        <div className='settings-row'>
            <span id='setting-label' className={`${disabled ? 'disabled' : ''}`} title={`${disabled ? 'disabled in this mode' : ''}`}>
                {label}
            </span>
            <ActionButton disabled={disabled} imageSrc={imgSrc} onMouseDown={onClick} small></ActionButton>
        </div>
    )
}

export default SettingsButton
