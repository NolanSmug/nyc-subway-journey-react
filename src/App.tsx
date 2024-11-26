import './App.css'
import React, { useEffect } from 'react'
import GameStateUI from './components/GameStateUI'
import UmbrellaButton from './components/UmbrellaButton'
import SettingsMenu from './components/SettingsMenu'
import UpcomingStationsVertical from './components/UpcomingStationsVertical'
import UpcomingStationsHorizontal from './components/UpcomingStationsHorizontal'
import KeyShortcutMenu from './components/KeyShortcutMenu'

import { useUIContext } from './contexts/UIContext'
import { useGameContext } from './contexts/GameContext'

import GEAR_BLACK from './images/settings-icon-b.svg'
import GEAR_WHITE from './images/settings-icon-w.svg'
import KEYBOARD_BLACK from './images/keyboard-icon-b.svg'
import KEYBOARD_WHITE from './images/keyboard-icon-w.svg'

function App() {
    const { isTransferMode, setIsTransferMode, upcomingStationsVertical } = useUIContext()
    const { train, gameState, initializeGame } = useGameContext()

    const handleClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.transfer-lines-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            setIsTransferMode(false)
        }
    }

    useEffect(() => {
        initializeGame()
    }, [initializeGame])

    if (train.isLineNull() || gameState.isEmpty()) return <>Error</>

    return (
        <>
            <div className="Game">
                <div className={`dimmed-overlay ${isTransferMode ? 'active' : ''}`} onClick={handleClickAway} />

                {!upcomingStationsVertical && <UpcomingStationsHorizontal />}

                <GameStateUI />
            </div>

            <div className="umbrella-menus">
                <div className="settings-umbrella">
                    <UmbrellaButton
                        openingButtonWhite={GEAR_WHITE}
                        openingButtonBlack={GEAR_BLACK}
                        umbrellaContent={<SettingsMenu />}
                    />
                </div>
                <div className="shortcuts-umbrella">
                    <UmbrellaButton
                        openingButtonWhite={KEYBOARD_WHITE}
                        openingButtonBlack={KEYBOARD_BLACK}
                        umbrellaContent={<KeyShortcutMenu />}
                        below
                    />
                </div>
            </div>

            {upcomingStationsVertical && (
                <div className="upcoming-stations-vertical">
                    <UpcomingStationsVertical />
                </div>
            )}
        </>
    )
}

export default App
