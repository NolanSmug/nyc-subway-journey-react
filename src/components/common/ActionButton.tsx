import React from 'react'
import './ActionButton.css'

interface ActionButtonProps {
    imageSrc?: string
    imageClassName?: string
    wrapperClassName?: string
    label?: string
    onMouseDown?: () => void
    hidden?: boolean
    noImage?: boolean
    small?: boolean
    disabled?: boolean
    additionalInput?: React.ReactNode
}

function ActionButton({
    imageSrc,
    imageClassName,
    wrapperClassName,
    label,
    noImage,
    onMouseDown,
    hidden,
    small,
    disabled,
    additionalInput,
}: ActionButtonProps) {
    return (
        <div className={`action-button-wrapper ${noImage ? 'no-image-wrapper' : ''} ${wrapperClassName || ''} ${hidden ? 'hidden' : ''}`}>
            <div className='action-button-container'>
                <button className={`action-button ${disabled ? 'disabled' : ''}`} type='button' onMouseDown={onMouseDown}>
                    {noImage ? (
                        <span className='button-text'>{label}</span>
                    ) : (
                        <img
                            src={imageSrc}
                            style={imageClassName === 'arrow-left' ? { transform: 'rotate(180deg)' } : undefined}
                            className={`icon ${small ? 'small-button' : ''} ${imageClassName || ''}`}
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
