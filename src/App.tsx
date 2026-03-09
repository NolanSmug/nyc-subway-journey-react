import './App.css'
import React, { useCallback, useEffect, useRef } from 'react'

import ModalScreen from './components/ui/ModalScreen'
import OptimalRouteUI from './components/ui/OptimalRouteUI'
import ConductorMode from './components/modes/ConductorMode'
import RiderMode, { RiderModeHandle } from './components/modes/RiderMode'
import UmbrellaButton from './components/common/UmbrellaButton'
import SettingsMenu from './components/common/SettingsMenu'
import UpcomingStationsHorizontal from './components/navigation/UpcomingStationsHorizontal'
import UpcomingStationsVertical from './components/navigation/UpcomingStationsVertical'
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
import LoadingSpinner from './components/common/LoadingSpinner'

const settingsMenu: React.JSX.Element = <SettingsMenu />
const keyShortcutMenu: React.JSX.Element = <KeyShortcutMenu />
const settingsButtons: string[] = [GEAR_WHITE, GEAR_BLACK]
const keyShortcutButtons: string[] = [KEYBOARD_WHITE, KEYBOARD_BLACK]

function Game() {
    const { initializeGame } = useGame()
    const isWon = useGameStateContext().gameState.isWon
    const isDailyChallengeCompleted = useGameStateContext().gameState.isDailyChallengeCompleted
    const isLineNull = useTrainContext((state) => state.train.isLineNull())

    const isTransferMode = useUIContext((state) => state.isTransferMode)
    const isModalOpen = useUIContext((state) => state.isModalOpen)
    const setIsModalOpen = useUIContext((state) => state.setIsModalOpen)
    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)

    const darkMode = useSettingsContext((state) => state.darkMode)
    const gameMode = useSettingsContext((state) => state.gameMode)
    const isDailyChallenge = useSettingsContext((state) => state.isDailyChallenge)
    const setIsDailyChallenge = useSettingsContext((state) => state.setIsDailyChallenge)
    const upcomingStationsVisible = useSettingsContext((state) => state.upcomingStationsVisible) && !isDailyChallenge

    const isHorizontalLayout = useSettingsContext((state) => state.upcomingStationsLayout === UpcomingStationsLayout.HORIZONTAL)
    const isVerticalLayout: boolean = !isHorizontalLayout

    const riderModePassengerRef = useRef<RiderModeHandle>(null)

    const closeTransferMode = () => setIsTransferMode(false)
    const handleTransferClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.line-svgs-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            closeTransferMode()
        }
    }

    const handleStartJourneyClick = useCallback(async () => {
        if (!riderModePassengerRef.current) {
            setIsModalOpen(false)
            return
        }

        await riderModePassengerRef.current.gameLandingTurnstileSwipe()

        setIsModalOpen(false)
    }, [setIsModalOpen])

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
                    setIsModalOpen(!isDailyChallenge)
                }}
            />
        </div>
    )

    useEffect(() => {
        initializeGame()
    }, [initializeGame, isDailyChallenge])

    useLineFavicon()
    useUITheme(darkMode)

    if (isLineNull) return <LoadingSpinner visible />

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
                className={`dimmed-overlay ${isTransferMode ? 'active' : ''} ${isModalOpen ? 'landing' : ''}`}
                onMouseDown={handleTransferClickAway}
            />

            {isModalOpen && !isDailyChallenge && (
                <ModalScreen closeLabel='Start journey' closeAction={handleStartJourneyClick}>
                    <WelcomeScreenContent />
                </ModalScreen>
            )}
            {isModalOpen && isDailyChallenge && (
                <ModalScreen
                    closeLabel={isDailyChallengeCompleted ? 'Replay journey' : 'Start journey'}
                    closeAction={handleStartJourneyClick}
                >
                    <DailyChallengeScreenContent />
                </ModalScreen>
            )}

            <div className={`Game ${gameMode}-mode ${!upcomingStationsVisible ? 'upcoming-stations-disabled' : ''}`}>
                {upcomingStationsVisible && isHorizontalLayout && <UpcomingStationsHorizontal />}

                <div className={`game-state-ui ${isVerticalLayout && upcomingStationsVisible ? 'is-vertical-layout' : ''}`}>
                    {gameMode === GameMode.CONDUCTOR && <ConductorMode />}
                    {gameMode === GameMode.RIDER && <RiderMode ref={riderModePassengerRef} />}
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
