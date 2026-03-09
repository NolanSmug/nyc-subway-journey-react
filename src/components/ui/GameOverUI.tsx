import './OptimalRouteUI.css' // shared with GameOverUI component

import ActionButton from '../common/ActionButton'
import Header from '../common/Header'
import LineSVGs from '../common/LineSVGs'
import Station from '../station/Station'
import TrainCar from '../train/TrainCar'

import { GameMode, useSettingsContext } from '../../contexts/SettingsContext'

import { LineName } from '../../logic/LineManager'

import OPTIMAL_BLACK from '../../assets/images/optimal-route-icon-b.svg'
import OPTIMAL_WHITE from '../../assets/images/optimal-route-icon-w.svg'
import SUBWAY_ICON_BLACK from '../../assets/images/subway-b.svg'
import SUBWAY_ICON_WHITE from '../../assets/images/subway-w.svg'
import INFO_ICON_W from '../../assets/images/info-icon-white.svg'
import REFRESH_BLACK from '../../assets/images/refresh-icon-b.svg'
import REFRESH_WHITE from '../../assets/images/refresh-icon-w.svg'
import CONDUCTOR_MODE_BLACK from '../../assets/images/conductor-mode-icon-b.svg'
import CONDUCTOR_MODE_WHITE from '../../assets/images/conductor-mode-icon-w.svg'
import RIDER_MODE_BLACK from '../../assets/images/rider-mode-icon-b.svg'
import RIDER_MODE_WHITE from '../../assets/images/rider-mode-icon-w.svg'

type GameOverUIProps = {
    destinationStationName: string
    destinationStationTransfers: LineName[]
    darkMode: boolean
    setIsRouteRequested: React.Dispatch<React.SetStateAction<boolean>>
    initializeGame: () => Promise<void>
    isDailyChallenge: boolean
    setIsDailyChallenge: React.Dispatch<React.SetStateAction<boolean>>
}

function GameOverUI({
    destinationStationName,
    destinationStationTransfers,
    darkMode,
    setIsRouteRequested,
    initializeGame,
    isDailyChallenge,
    setIsDailyChallenge,
}: GameOverUIProps) {
    const setGameMode = useSettingsContext((state) => state.setGameMode)
    const isConductorMode = useSettingsContext((state) => state.gameMode === GameMode.CONDUCTOR)

    return (
        <div className='game-over-wrapper'>
            <Header text='You win!' />
            <Station name={destinationStationName}>
                <LineSVGs lines={destinationStationTransfers} disabled notDim />
            </Station>
            <TrainCar forWinDisplay />
            <div className='optimal-route-request-container'>
                <div className='optimal-route-request-btn'>
                    <ActionButton
                        label='Show optimal route'
                        imageSrc={darkMode ? OPTIMAL_WHITE : OPTIMAL_BLACK}
                        onClick={() => setIsRouteRequested(true)}
                        wrapperClassName='smart-border'
                    />
                    <div>
                        <img src={INFO_ICON_W} alt='info' className='info-icon' />
                        <div className='tooltip'>
                            Calculates the <u>mathematically shortest path</u> (fewest stops visited).
                        </div>
                    </div>
                </div>
                {isDailyChallenge && (
                    <ActionButton
                        label='Open play'
                        imageSrc={darkMode ? SUBWAY_ICON_WHITE : SUBWAY_ICON_BLACK}
                        onClick={() => {
                            setIsDailyChallenge(false)
                        }}
                    />
                )}
                {!isDailyChallenge && (
                    <ActionButton
                        label={isConductorMode ? 'Try rider mode' : 'Try conductor mode'}
                        imageSrc={
                            isConductorMode
                                ? darkMode
                                    ? RIDER_MODE_WHITE
                                    : RIDER_MODE_BLACK
                                : darkMode
                                  ? CONDUCTOR_MODE_WHITE
                                  : CONDUCTOR_MODE_BLACK
                        }
                        onClick={() => {
                            setGameMode(isConductorMode ? GameMode.RIDER : GameMode.CONDUCTOR)
                            initializeGame()
                        }}
                        wrapperClassName='line-color-border'
                        pulse
                    />
                )}
                <ActionButton
                    imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK}
                    label={`${isDailyChallenge ? 'Replay challenge' : 'Reset game'}`}
                    onClick={() => {
                        initializeGame()
                    }}
                />
            </div>
        </div>
    )
}

export default GameOverUI
