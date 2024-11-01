import ActionButton from './ActionButton'
import './SettingsButton.css'

export interface SettingsButtonProps {
    imgSrc: string
    label: string
    onClick: () => void
}

function SettingsButton({ imgSrc, label, onClick }: SettingsButtonProps) {
    return (
        <div className="settings-row">
            <span>{label}</span>
            <ActionButton imageSrc={imgSrc} onClick={onClick} small></ActionButton>
        </div>
    )
}

export default SettingsButton