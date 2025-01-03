import React from 'react'
import './ActionButton.css'

export interface ActionButtonProps {
    imageSrc: string
    label?: string
    onClick?: () => void
    small?: boolean
    additionalInput?: React.ReactNode
}

function ActionButton({ imageSrc, label, onClick, small, additionalInput }: ActionButtonProps) {
    return (
        <div className="action-button">
            <button className={`action-button-container`} type="button">
                <img src={imageSrc} className={`icon ${small ? 'small-button' : ''}`} alt={label} onClick={onClick} />
                <p className="label">{label}</p>
            </button>
            {additionalInput}
        </div>
    )
}

export default ActionButton
