import React from 'react'
import './ActionButton.css'

export interface ActionButtonProps {
    imageSrc?: string
    label?: string
    onMouseDown?: () => void
    noImage?: boolean
    small?: boolean
    additionalInput?: React.ReactNode
}

function ActionButton({ imageSrc, label, noImage, onMouseDown, small, additionalInput }: ActionButtonProps) {
    return (
        <div className={`action-button-wrapper ${noImage ? 'no-image-wrapper' : ''}`}>
            <div className='action-button-container'>
                <button className='action-button' type='button' onMouseDown={onMouseDown}>
                    {noImage ? (
                        <span className='button-text'>{label}</span>
                    ) : (
                        <img src={imageSrc} className={`icon ${small ? 'small-button' : ''}`} alt={label} />
                    )}
                </button>

                {/* Only render label below if it's an image button */}
                {!noImage && label && <p className='label'>{label}</p>}
            </div>
            {additionalInput}
        </div>
    )
}

export default ActionButton
