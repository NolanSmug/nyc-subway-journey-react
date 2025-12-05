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
import KeyShortcutMenu from './components/keyboard/KeyShortcutMenu'
// import SubwayMap from './components/SubwayMap'

import { useUIContext } from './contexts/UIContext'
import { useTrainContext } from './contexts/TrainContext'
import { useGameStateContext } from './contexts/GameStateContext'
import { useSettingsContext, GameMode, UpcomingStationsLayout } from './contexts/SettingsContext'
import { useGame } from './hooks/useGame'

import { useLineFavicon } from './hooks/useLineFavicon'

import GEAR_BLACK from './images/settings-icon-b.svg'
import GEAR_WHITE from './images/settings-icon-w.svg'
import KEYBOARD_BLACK from './images/shortcut-icon-black.svg'
import KEYBOARD_WHITE from './images/shortcut-icon-white.svg'

const settingsMenu = <SettingsMenu />
const keyShortcutMenu = <KeyShortcutMenu />
const settingsButtons = [GEAR_WHITE, GEAR_BLACK]
const keyShortcutButtons = [KEYBOARD_WHITE, KEYBOARD_BLACK]

function Game() {
    const { initializeGame } = useGame()
    const { gameState } = useGameStateContext()
    const isLineNull = useTrainContext((state) => state.train.isLineNull())

    const isTransferMode = useUIContext((state) => state.isTransferMode)
    const isLandingPage = useUIContext((state) => state.isLandingPage)
    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)

    const gameMode = useSettingsContext((state) => state.gameMode)
    const upcomingStationsVisible = useSettingsContext((state) => state.upcomingStationsVisible)
    const isHorizontalLayout = useSettingsContext((state) => state.upcomingStationsLayout === UpcomingStationsLayout.HORIZONTAL)
    const isVerticalLayout = !isHorizontalLayout

    const handleClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.line-svgs-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            setIsTransferMode(false)
        }
    }

    useEffect(() => {
        initializeGame()
    }, [initializeGame])

    useLineFavicon()

    if (isLineNull) return <>Sorry, something went wrong on our end and we can't display the page right now. Try again later?</>

    if (gameState.isWon) {
        return (
            <div className='Game'>
                <OptimalRouteUI />
            </div>
        )
    }

    return (
        <>
            <div
                className={`dimmed-overlay ${isTransferMode ? 'active' : ''}`}
                style={isLandingPage ? { opacity: '20%' } : {}}
                onMouseDown={handleClickAway}
            />

            {isLandingPage && <LandingScreen />}

            <div className={`Game ${gameMode}-mode`}>
                {upcomingStationsVisible && isHorizontalLayout && <UpcomingStationsHorizontal />}
                <div className={`game-state-ui ${isVerticalLayout && upcomingStationsVisible ? 'is-vertical-layout' : ''}`}>
                    {gameMode === GameMode.CONDUCTOR && <ConductorMode />}
                    {gameMode === GameMode.RIDER && <RiderMode />}
                </div>
            </div>

            <div className='umbrella-menus'>
                <div className='settings-umbrella'>
                    <UmbrellaButton openingButtonsW_B={settingsButtons} below visible>
                        {settingsMenu}
                    </UmbrellaButton>
                </div>
                <div className='shortcuts-umbrella'>
                    <UmbrellaButton openingButtonsW_B={keyShortcutButtons} visible>
                        {keyShortcutMenu}
                    </UmbrellaButton>
                    {/* <UmbrellaButton
                        openingButtonsW_B={[GEAR_WHITE, GEAR_BLACK]}
                        umbrellaContent={<SubwayMap />}
                        visible={!gameMode}
                    /> */}
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
