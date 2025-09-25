import React, { useState, useEffect } from 'react'

import './LoadingSpinner.css'

export interface LoadingSpinnerProps {
    visible?: boolean
    text?: string
    textDelaySecs?: number
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text, visible = false, textDelaySecs = 0 }) => {
    const [showText, setShowText] = useState(false)

    useEffect(() => {
        if (!visible || !text || textDelaySecs <= 0) {
            setShowText(false)
            return
        }

        const timer = setTimeout(() => setShowText(true), textDelaySecs * 1000)

        return () => clearTimeout(timer)
    }, [visible, text, textDelaySecs])

    return (
        <div id='loading' style={{ display: visible ? 'flex' : 'none' }}>
            <div className='loading-inner'>
                <div className='loading-spinner' />
                {text && showText && <p className={`loading-text ${showText ? 'visible' : ''}`}>{text}</p>}
            </div>
        </div>
    )
}

export default LoadingSpinner
