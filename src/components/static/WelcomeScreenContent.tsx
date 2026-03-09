import './WelcomeScreenContent.css'
import { useTrainContext } from '../../contexts/TrainContext'
import { useGameStateContext } from '../../contexts/GameStateContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import LineSVGs from '../common/LineSVGs'
import Station from '../station/Station'
import WelcomeTurnstile from './WelcomeTurnstile'

import R_ARROW_WHITE from '../../assets/images/right-arrow-w.svg'
import R_ARROW_BLACK from '../../assets/images/right-arrow-b.svg'

const WelcomeScreenContent = () => {
    const currentStation = useTrainContext((state) => state.train.getCurrentStation())
    const currentLine = useTrainContext((state) => state.train.getLine())
    const destinationStation = useGameStateContext().gameState.destinationStation
    const darkMode = useSettingsContext((state) => state.darkMode)

    return (
        <>
            <JigglyTitle text='NYC-Subway-Journey' />

            <div className='welcome-route-container'>
                <Station name={currentStation.getName()}>
                    <LineSVGs lines={currentStation.getTransfers()} focusCurrentLine={currentLine} disabled />
                </Station>

                <img className='route-arrow' src={darkMode ? R_ARROW_WHITE : R_ARROW_BLACK} alt='to' />

                <Station name={destinationStation.getName()} isDestination>
                    <LineSVGs lines={destinationStation.getTransfers()} disabled />
                </Station>
            </div>

            <WelcomeTurnstile />
        </>
    )
}

const JigglyTitle = ({ text }: { text: string }) => {
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

export default WelcomeScreenContent
