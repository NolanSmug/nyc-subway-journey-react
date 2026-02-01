import './DailyChallengeScreenContent.css'

import Header from '../common/Header'
import Station from '../station/Station'
import LineSVGs from '../common/LineSVGs'

import { useGameStateContext } from '../../contexts/GameStateContext'
import { useSettingsContext } from '../../contexts/SettingsContext'

import { Station as StationObject } from '../../logic/StationManager'

import R_ARROW_WHITE from '../../assets/images/right-arrow-w.svg'
import R_ARROW_BLACK from '../../assets/images/right-arrow-b.svg'

const DailyChallengeScreenContent = () => {
    const darkMode = useSettingsContext((state) => state.darkMode)
    const startingStation: StationObject = useGameStateContext().gameState.startingStation
    const destinationStation: StationObject = useGameStateContext().gameState.destinationStation
    const hasCompletedToday: boolean = useGameStateContext().gameState.isDailyChallengeCompleted

    const TODAY: Date = new Date()

    return (
        <div className='daily-challenge-wrapper'>
            <Header
                text={`Daily Challenge - ${TODAY.getMonth() + 1}/${TODAY.getDate()}/${TODAY.getFullYear()}`}
                colorHex={`${hasCompletedToday && '#228B22'}`}
            />
            <div className='daily-challenge-station-container'>
                <Station name={startingStation.getName()}>
                    <LineSVGs lines={startingStation.getTransfers()} disabled />
                </Station>
                <img className='daily-challenge-arrow' src={darkMode ? R_ARROW_WHITE : R_ARROW_BLACK} />
                <Station name={destinationStation.getName()}>
                    <LineSVGs lines={destinationStation.getTransfers()} disabled />
                </Station>
            </div>
        </div>
    )
}

export default DailyChallengeScreenContent
