import React from 'react'
import './ActionButton.css'

export interface ActionButtonProps {
    imageSrc: string
    label?: string
    onMouseDown?: () => void
    small?: boolean
    additionalInput?: React.ReactNode
}

function ActionButton({ imageSrc, label, onMouseDown, small, additionalInput }: ActionButtonProps) {
    return (
        <div className='action-button-wrapper'>
            <div className='action-button-container'>
                <button className='action-button' type='button'>
                    <img src={imageSrc} className={`icon ${small ? 'small-button' : ''}`} alt={label} onMouseDown={onMouseDown} />
                </button>
                
                {label && <p className='label'>{label}</p>}
            </div>
            {additionalInput}
        </div>
    )
}

export default ActionButton
