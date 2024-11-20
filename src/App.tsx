import './App.css'
import React, { useEffect, useMemo } from 'react'
import TransferLines from './components/TransferLines'
import UpcomingStations from './components/UpcomingStations'
import Header from './components/Header'
import TrainCar from './components/TrainCar'
import GameStateUI from './components/GameStateUI'
import SettingsUmbrella from './components/SettingsUmbrella'
import UpcomingStationsVertical from './components/UpcomingStationsVertical'

import { getTransferImageUrls } from './logic/TransferImageMap'
import { useUIContext } from './contexts/UIContext'
import { useGameContext } from './contexts/GameContext'
import { LineName } from './logic/Line'

function App() {
    const { isTransferMode, setIsTransferMode, upcomingStationsVisible, upcomingStationsVertical } = useUIContext()
    const { train, gameState, initializeGame } = useGameContext()

    const handleClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.transfer-lines-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            setIsTransferMode(false)
        }
    }

    useEffect(() => {
        initializeGame()
    }, [])

    const line = train?.getLine()
    const transferImages = useMemo(() => getTransferImageUrls(line), [line])

    if (train.getLine() === LineName.NULL_TRAIN || gameState.currentStations.length === 0) return <>Error</>

    return (
        <>
            <div className="Game">
                <div className={`dimmed-overlay ${isTransferMode ? 'active' : ''}`} onClick={handleClickAway} />

                {!upcomingStationsVertical && gameState.currentStations.length > 0 && (
                    <UpcomingStations visible={upcomingStationsVisible} />
                )}

                <Header text="Current Line:"></Header>
                <div className={`train ${gameState.isWon ? 'win-state' : ''}`}>
                    <TrainCar
                        train={train}
                        flipDirection={async () => {
                            await train.reverseDirection()
                        }}
                    >
                        <TransferLines transfers={transferImages} notDim />
                    </TrainCar>
                </div>

                <GameStateUI />

                <SettingsUmbrella />
            </div>
            {upcomingStationsVertical && (
                <div className="upcoming-stations-vertical">
                    <UpcomingStationsVertical visible={upcomingStationsVisible} />
                </div>
            )}
        </>
    )
}

export default App
