import './LoadingSpinner.css'
import { useState, useEffect } from 'react'

interface LoadingSpinnerProps {
    text?: string
    textDelaySecs?: number
}

const LoadingSpinner = ({ text, textDelaySecs = 0 }: LoadingSpinnerProps) => {
    const [showText, setShowText] = useState(false)

    useEffect(() => {
        if (!text || textDelaySecs <= 0) {
            setShowText(false)
            return
        }

        const timer = setTimeout(() => setShowText(true), textDelaySecs * 1000)

        return () => clearTimeout(timer)
    }, [text, textDelaySecs])

    return (
        <div id='loading'>
            <div className='loading-inner'>
                <div className='loading-spinner' />
                {text && showText && <p className='loading-text visible'>{text}</p>}
            </div>
        </div>
    )
}

export default LoadingSpinner
