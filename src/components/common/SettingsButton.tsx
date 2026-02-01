import './SettingsButton.css'
import ActionButton from './ActionButton'

interface SettingsButtonProps {
    label: string
    imgSrc: string
    onClick: () => void
    disabled?: boolean
    enableLineColor?: boolean
}

function SettingsButton({ imgSrc, label, onClick, disabled, enableLineColor }: SettingsButtonProps) {
    return (
        <div className='settings-row'>
            <span
                id='setting-label'
                className={`${disabled ? 'disabled' : ''} ${enableLineColor ? 'label-color' : ''}`}
                title={`${disabled ? 'disabled in this mode' : ''}`}
            >
                {label}
            </span>
            <ActionButton disabled={disabled} imageSrc={imgSrc} onClick={onClick} small></ActionButton>
        </div>
    )
}

export default SettingsButton
