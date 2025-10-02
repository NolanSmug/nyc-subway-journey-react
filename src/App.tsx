import React, { useEffect } from 'react'
import ConductorMode from './components/modes/ConductorMode'
import RiderMode from './components/modes/RiderMode'
import OptimalRouteUI from './components/ui/OptimalRouteUI'
import LandingScreen from './components/ui/LandingScreen'
import UmbrellaButton from './components/common/UmbrellaButton'
import SettingsMenu from './components/common/SettingsMenu'
import UpcomingStationsVertical from './components/common/UpcomingStationsVertical'
import UpcomingStationsHorizontal from './components/common/UpcomingStationsHorizontal'
import KeyShortcutMenu from './components/keyboard/KeyShortcutMenu'
// import SubwayMap from './components/SubwayMap'

import './App.css'
import { useUIContext } from './contexts/UIContext'
import { useTrainContext } from './contexts/TrainContext'
import { useGameStateContext } from './contexts/GameStateContext'
import { useSettingsContext } from './contexts/SettingsContext'
import { useGame } from './hooks/useGame'

import GEAR_BLACK from './images/settings-icon-b.svg'
import GEAR_WHITE from './images/settings-icon-w.svg'
import KEYBOARD_BLACK from './images/shortcut-icon-black.svg'
import KEYBOARD_WHITE from './images/shortcut-icon-white.svg'

function App() {
    const { initializeGame } = useGame()
    const { gameState } = useGameStateContext()

    const isLineNull = useTrainContext((state) => state.train.isLineNull())

    const isTransferMode = useUIContext((state) => state.isTransferMode)
    const upcomingStationsVisible = useUIContext((state) => state.upcomingStationsVisible)
    const isLandingPage = useUIContext((state) => state.isLandingPage)
    const setIsTransferMode = useUIContext((state) => state.setIsTransferMode)
    const isHorizontalLayout = useUIContext((state) => state.isHorizontalLayout)
    const isVerticalLayout = useUIContext((state) => state.isVerticalLayout)

    const conductorMode = useSettingsContext((state) => state.conductorMode)

    // useUITheme(darkMode)

    const handleClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.line-svgs-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            setIsTransferMode(false)
        }
    }

    useEffect(() => {
        initializeGame()
    }, [initializeGame])

    if (isLineNull || gameState.isEmpty())
        return <>Sorry, something went wrong on our end and we can't display the page right now. Try again later?</>

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

            <div className='Game' style={conductorMode ? {} : { paddingBottom: '0' }}>
                {upcomingStationsVisible && isHorizontalLayout() && <UpcomingStationsHorizontal />}
                <div className={`game-state-ui ${isVerticalLayout() && upcomingStationsVisible ? 'is-vertical-layout' : ''}`}>
                    {conductorMode && <ConductorMode />}
                    {!conductorMode && <RiderMode />}
                </div>
            </div>

            <div className='umbrella-menus'>
                <div className='settings-umbrella'>
                    <UmbrellaButton openingButtonsW_B={[GEAR_WHITE, GEAR_BLACK]} umbrellaContent={<SettingsMenu />} below visible />
                </div>
                <div className='shortcuts-umbrella'>
                    <UmbrellaButton
                        openingButtonsW_B={[KEYBOARD_WHITE, KEYBOARD_BLACK]}
                        umbrellaContent={<KeyShortcutMenu />}
                        visible={conductorMode}
                    />
                    {/* <UmbrellaButton
                        openingButtonsW_B={[GEAR_WHITE, GEAR_BLACK]}
                        umbrellaContent={<SubwayMap />}
                        visible={!conductorMode}
                    /> */}
                </div>
            </div>

            {upcomingStationsVisible && isVerticalLayout() && (
                <div className='upcoming-stations-vertical'>
                    <UpcomingStationsVertical />
                </div>
            )}
        </>
    )
}

export default App
