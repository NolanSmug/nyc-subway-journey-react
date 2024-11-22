import './App.css'
import React, { useEffect, useMemo } from 'react'
import UpcomingStations from './components/UpcomingStations'
import Header from './components/Header'
import TrainCar from './components/TrainCar'
import GameStateUI from './components/GameStateUI'
import UmbrellaButton from './components/UmbrellaButton'
import SettingsMenu from './components/SettingsMenu'
import UpcomingStationsVertical from './components/UpcomingStationsVertical'
import { default as Line } from './components/TransferLines'

import { getTransferImageSvg } from './logic/TransferImageMap'
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

    const line = train?.getLine()
    const currentLineSvg = useMemo(() => getTransferImageSvg(line), [line])

    if (train.isLineNull() || gameState.isEmpty()) return <>Error</>

    return (
        <>
            <div
                className="Game"
                style={{
                    transform: upcomingStationsVertical ? 'translateY(-8em)' : '',
                }}
            >
                <div className={`dimmed-overlay ${isTransferMode ? 'active' : ''}`} onClick={handleClickAway} />

                {!upcomingStationsVertical && <UpcomingStations />}

                <Header text="Current Line:"></Header>
                <div className={`train ${gameState.isWon ? 'win-state' : ''}`}>
                    <TrainCar>
                        <Line transfers={currentLineSvg} notDim />
                    </TrainCar>
                </div>

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
                        umbrellaContent={
                            <>
                                <kbd>c</kbd>
                                <kbd>d</kbd>
                            </>
                        }
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
