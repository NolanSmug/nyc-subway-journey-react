import './LandingScreen.css'

import { useUIContext } from '../../contexts/UIContext'
import ActionButton from '../common/ActionButton'

function LandingScreen() {
    const isLandingPage = useUIContext((state) => state.isLandingPage)
    const setIsLandingPage = useUIContext((state) => state.setIsLandingPage)

    if (!isLandingPage) {
        return null
    }

    return (
        <div className='landing-screen-container'>
            <div className='landing-screen-content'>
                <JigglyTitle text='NYC-Subway-Journey' />
                <p>
                    Test your knowledge of the NYC subway network by finding a route between two given stations. Make smart transfers, and
                    avoid getting lost!
                </p>

                <ActionButton label='Start journey' onClick={() => setIsLandingPage(false)}></ActionButton>
            </div>
        </div>
    )
}

function JigglyTitle({ text }: { text: string }) {
    const isWheelLetter = (i: number) => {
        const prev = text[i - 1]
        const next = text[i + 1]
        const current = text[i]

        const isFirstLetter = (prev === '-' && current !== '-') || prev === undefined
        const isLastLetter = (next === '-' && current !== '-') || next === undefined

        return isFirstLetter || isLastLetter
    }

    return (
        <h1 className='jiggly-title'>
            {Array.from(text).map((char, index) => (
                <span
                    key={index}
                    className={`jiggly-letter ${isWheelLetter(index) ? 'wheel' : ''}`}
                    style={{
                        animationDelay: `${index * 0.015}s, ${index * 0.03}s`,
                    }}
                >
                    {char}
                </span>
            ))}
        </h1>
    )
}

export default LandingScreen
