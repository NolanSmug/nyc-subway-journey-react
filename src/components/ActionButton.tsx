import React from 'react'
import './ActionButton.css'

export interface ActionButtonProps {
    imageSrc?: string
    className?: string
    wrapperClassName?: string
    label?: string
    onMouseDown?: () => void
    visible?: boolean
    noImage?: boolean
    small?: boolean
    additionalInput?: React.ReactNode
}

function ActionButton({
    imageSrc,
    className,
    wrapperClassName,
    label,
    noImage,
    onMouseDown,
    visible,
    small,
    additionalInput,
}: ActionButtonProps) {
    if (visible !== undefined && visible === false) return null

    return (
        <div className={`action-button-wrapper ${noImage ? 'no-image-wrapper' : ''} ${wrapperClassName || ''}`}>
            <div className='action-button-container'>
                <button className='action-button' type='button' onMouseDown={onMouseDown}>
                    {noImage ? (
                        <span className='button-text'>{label}</span>
                    ) : (
                        <img
                            src={imageSrc}
                            style={className === 'arrow-left' ? { transform: 'rotate(180deg)' } : undefined}
                            className={`icon ${small ? 'small-button' : ''} ${className || ''}`}
                            alt={label}
                        />
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
