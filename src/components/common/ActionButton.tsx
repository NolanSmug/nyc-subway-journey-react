import './ActionButton.css'
import React from 'react'

interface ActionButtonProps {
    imageSrc?: string
    imageClassName?: string
    wrapperClassName?: string
    label?: string
    onClick?: () => void
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
    onClick,
    hidden,
    small,
    disabled,
    additionalInput,
}: ActionButtonProps) {
    return (
        <div className={`action-button-wrapper ${wrapperClassName || ''} ${hidden ? 'hidden' : ''} ${disabled ? 'disabled' : ''}`}>
            <div className='action-button-container'>
                <button
                    className={`action-button  ${noImage ? 'no-image' : ''}`}
                    type='button'
                    onMouseDown={noImage ? undefined : onClick}
                    onMouseUp={noImage ? onClick : undefined}
                >
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

export default React.memo(ActionButton)
