import ActionButton from './ActionButton'
import './SettingsButton.css'

export interface SettingsButtonProps {
    label: string
    imgSrc: string
    onClick: () => void
}

function SettingsButton({ imgSrc, label, onClick }: SettingsButtonProps) {
    return (
        <div className="settings-row">
            <span id="setting-label">{label}</span>
            <ActionButton imageSrc={imgSrc} onClick={onClick} small></ActionButton>
        </div>
    )
}

export default SettingsButton
