import React, { useEffect } from 'react'
import ConductorModeUI from './components/ConductorModeUI'
import UmbrellaButton from './components/UmbrellaButton'
import SettingsMenu from './components/SettingsMenu'
import UpcomingStationsVertical from './components/UpcomingStationsVertical'
import UpcomingStationsHorizontal from './components/UpcomingStationsHorizontal'
import KeyShortcutMenu from './components/KeyShortcutMenu'
import OptimalRouteUI from './components/OptimalRouteUI'
// import SubwayMap from './components/SubwayMap'

import './App.css'
import { useUIContext } from './contexts/UIContext'
import { useGameContext } from './contexts/GameContext'
import { useSettingsContext } from './contexts/SettingsContext'

import GEAR_BLACK from './images/settings-icon-b.svg'
import GEAR_WHITE from './images/settings-icon-w.svg'
import KEYBOARD_BLACK from './images/shortcut-icon-black.svg'
import KEYBOARD_WHITE from './images/shortcut-icon-white.svg'
import LandingScreen from './components/LandingScreen'
import RiderModeUI from './components/RiderModeUI'

function App() {
    const { isTransferMode, setIsTransferMode, upcomingStationsVisible, isHorizontalLayout, isVerticalLayout, isLandingPage } =
        useUIContext()
    const { conductorMode } = useSettingsContext()
    const { train, gameState, initializeGame } = useGameContext()

    const handleClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.line-svgs-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            setIsTransferMode(false)
        }
    }

    useEffect(() => {
        initializeGame()
    }, [initializeGame])

    if (train.isLineNull() || gameState.isEmpty())
        return <>Sorry, something went wrong on our end and we can't display the page right now. Try again later?</>

    if (gameState.isWon)
        return (
            <div className='Game'>
                <OptimalRouteUI />
            </div>
        )

    return (
        <>
            <div
                className={`dimmed-overlay ${isTransferMode ? 'active' : ''}`}
                style={isLandingPage ? { opacity: '20%' } : {}}
                onMouseDown={handleClickAway}
            />

            {isLandingPage && <LandingScreen />}

            <div className='Game' style={conductorMode ? {} : { paddingBottom: '0' }}>
                {upcomingStationsVisible && isHorizontalLayout() && (
                    <UpcomingStationsHorizontal
                        stations={train.getScheduledStops()}
                        currentStationID={train.getCurrentStation().getId()}
                        currentStationIndex={train.getCurrentStationIndex()}
                    />
                )}
                <div className={`game-state-ui ${isVerticalLayout() && upcomingStationsVisible ? 'is-vertical-layout' : ''}`}>
                    {conductorMode && <ConductorModeUI />}
                    {!conductorMode && <RiderModeUI />}
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
                    <UpcomingStationsVertical
                        stations={train.getScheduledStops()}
                        currentStationID={train.getCurrentStation().getId()}
                        currentStationIndex={train.getCurrentStationIndex()}
                    />
                </div>
            )}
        </>
    )
}

export default App
