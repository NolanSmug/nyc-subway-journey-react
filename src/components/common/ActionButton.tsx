import './ActionButton.css'
import React from 'react'

interface ActionButtonProps {
    imageSrc?: string
    rotateDegrees?: number
    wrapperClassName?: string
    label?: string
    onClick?: () => void
    hidden?: boolean
    small?: boolean
    disabled?: boolean
    additionalInput?: React.ReactNode
}

function ActionButton({
    imageSrc,
    rotateDegrees,
    wrapperClassName,
    label,
    onClick,
    hidden,
    small,
    disabled,
    additionalInput,
}: ActionButtonProps) {
    const noImage: boolean = imageSrc === undefined

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
                        <div className={`icon-wrapper ${small ? 'small-button' : ''}`}>
                            <img
                                src={imageSrc}
                                className='icon'
                                style={
                                    rotateDegrees
                                        ? { transform: `rotate(${-rotateDegrees}deg)` /* yes, we use unit circle angle */ }
                                        : undefined
                                }
                                alt={label}
                            />
                        </div>
                    )}
                </button>

                {/* Only render label below if it's an image button */}
                {!noImage && label && <p className='button-label'>{label}</p>}
            </div>
            {additionalInput && additionalInput}
        </div>
    )
}

export default React.memo(ActionButton)
