import './App.css'
import React, { useEffect } from 'react'

import LandingScreen from './components/ui/LandingScreen'
import OptimalRouteUI from './components/ui/OptimalRouteUI'
import ConductorMode from './components/modes/ConductorMode'
import RiderMode from './components/modes/RiderMode'
import UmbrellaButton from './components/common/UmbrellaButton'
import SettingsMenu from './components/common/SettingsMenu'
import UpcomingStationsHorizontal from './components/common/UpcomingStationsHorizontal'
import UpcomingStationsVertical from './components/common/UpcomingStationsVertical'
import KeyShortcutMenu from './components/static/KeyShortcutMenuContent'
// import SubwayMap from './components/SubwayMap'

import { useUIContext } from './contexts/UIContext'
import { useTrainContext } from './contexts/TrainContext'
import { useGameStateContext } from './contexts/GameStateContext'
import { useSettingsContext, GameMode, UpcomingStationsLayout } from './contexts/SettingsContext'

import { useGame } from './hooks/useGame'
import { useUITheme } from './hooks/useCSSProperties'
import { useLineFavicon } from './hooks/useLineFavicon'

import GEAR_BLACK from './assets/images/settings-icon-b.svg'
import GEAR_WHITE from './assets/images/settings-icon-w.svg'
import KEYBOARD_BLACK from './assets/images/shortcut-icon-black.svg'
import KEYBOARD_WHITE from './assets/images/shortcut-icon-white.svg'
import SUBWAY_ICON_BLACK from './assets/images/subway-b.svg'
import SUBWAY_ICON_WHITE from './assets/images/subway-w.svg'
import DAILY_CHALLENGE_WHITE from './assets/images/daily-challenge-w.svg'
import DAILY_CHALLENGE_BLACK from './assets/images/daily-challenge-b.svg'
import DAILY_CHALLENGE_COMPLETE from './assets/images/daily-challenge-complete-g.svg'

import WelcomeScreenContent from './components/static/WelcomeScreenContent'
import ActionButton from './components/common/ActionButton'
import DailyChallengeScreenContent from './components/static/DailyChallengeScreenContent'

const settingsMenu: JSX.Element = <SettingsMenu />
const keyShortcutMenu: JSX.Element = <KeyShortcutMenu />
const settingsButtons: string[] = [GEAR_WHITE, GEAR_BLACK]
const keyShortcutButtons: string[] = [KEYBOARD_WHITE, KEYBOARD_BLACK]

function Game() {
    const { initializeGame } = useGame()
    const isWon = useGameStateContext().gameState.isWon
    const isDailyChallengeCompleted = useGameStateContext().gameState.isDailyChallengeCompleted
    const isLineNull = useTrainContext((state) => state.train.isLineNull())

    const isTransferMode = useUIContext((state) => state.isTransferMode)
    const isLandingPage = useUIContext((state) => state.isLandingPage)
    const setIsLandingPage = useUIContext((state) => state.setIsLandingPage)
    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)

    const darkMode = useSettingsContext((state) => state.darkMode)
    const gameMode = useSettingsContext((state) => state.gameMode)
    const isDailyChallenge = useSettingsContext((state) => state.isDailyChallenge)
    const setIsDailyChallenge = useSettingsContext((state) => state.setIsDailyChallenge)
    const upcomingStationsVisible = useSettingsContext((state) => state.upcomingStationsVisible) && !isDailyChallenge

    const isHorizontalLayout = useSettingsContext((state) => state.upcomingStationsLayout === UpcomingStationsLayout.HORIZONTAL)
    const isVerticalLayout: boolean = !isHorizontalLayout

    const handleClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.line-svgs-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            setIsTransferMode(false)
        }
    }

    const getChallengeIcon = () => {
        if (isDailyChallenge) return darkMode ? SUBWAY_ICON_WHITE : SUBWAY_ICON_BLACK
        if (isDailyChallengeCompleted) return DAILY_CHALLENGE_COMPLETE
        return darkMode ? DAILY_CHALLENGE_WHITE : DAILY_CHALLENGE_BLACK
    }

    const renderGameControls = () => (
        <div className='top-page-umbrellas'>
            <UmbrellaButton openingButtonsW_B={settingsButtons} below visible>
                {settingsMenu}
            </UmbrellaButton>

            <ActionButton
                wrapperClassName={isDailyChallengeCompleted && !isDailyChallenge ? 'success-border' : ''}
                label={isDailyChallenge ? 'Exit challenge' : 'Daily challenge'}
                imageSrc={getChallengeIcon()}
                onClick={() => {
                    setIsDailyChallenge((prev) => !prev)
                    setIsLandingPage(!isDailyChallenge)
                }}
            />
        </div>
    )

    useEffect(() => {
        initializeGame()
    }, [initializeGame, isDailyChallenge])

    useLineFavicon()
    useUITheme(darkMode)

    if (isLineNull) return <>Sorry, something went wrong on our end and we can't display the page right now. Try again later?</>

    if (isWon) {
        return (
            <div className='Game'>
                <OptimalRouteUI isDailyChallenge={isDailyChallenge} setIsDailyChallenge={setIsDailyChallenge} />
                {renderGameControls()}
            </div>
        )
    }

    return (
        <>
            <div
                className={`dimmed-overlay ${isTransferMode ? 'active' : ''} ${isLandingPage ? 'landing' : ''}`}
                onMouseDown={handleClickAway}
            />

            {isLandingPage && !isDailyChallenge && (
                <LandingScreen closeLabel='Start journey'>
                    <WelcomeScreenContent />
                </LandingScreen>
            )}
            {isDailyChallenge && (
                <LandingScreen closeLabel={`${isDailyChallengeCompleted ? 'Replay journey' : 'Start journey'}`}>
                    <DailyChallengeScreenContent />
                </LandingScreen>
            )}

            <div className={`Game ${gameMode}-mode ${!upcomingStationsVisible ? 'upcoming-stations-disabled' : ''}`}>
                {upcomingStationsVisible && isHorizontalLayout && <UpcomingStationsHorizontal />}

                <div className={`game-state-ui ${isVerticalLayout && upcomingStationsVisible ? 'is-vertical-layout' : ''}`}>
                    {gameMode === GameMode.CONDUCTOR && <ConductorMode />}
                    {gameMode === GameMode.RIDER && <RiderMode />}
                </div>
            </div>

            <div className='umbrella-menus'>
                {renderGameControls()}
                <div className='bottom-page-umbrellas'>
                    <UmbrellaButton openingButtonsW_B={keyShortcutButtons} visible>
                        {keyShortcutMenu}
                    </UmbrellaButton>
                    {/* <UmbrellaButton openingButtonsW_B={[GEAR_WHITE, GEAR_BLACK]} visible>
                        <SubwayMap />
                    </UmbrellaButton> */}
                </div>
            </div>

            {upcomingStationsVisible && isVerticalLayout && (
                <div className='upcoming-stations-vertical'>
                    <UpcomingStationsVertical />
                </div>
            )}
        </>
    )
}

function App() {
    return <Game />
}

export default App
