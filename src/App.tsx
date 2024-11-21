import './App.css'
import React, { useEffect, useMemo } from 'react'
import UpcomingStations from './components/UpcomingStations'
import Header from './components/Header'
import TrainCar from './components/TrainCar'
import GameStateUI from './components/GameStateUI'
import SettingsUmbrella from './components/SettingsUmbrella'
import UpcomingStationsVertical from './components/UpcomingStationsVertical'
import { default as Line } from './components/TransferLines'

import { getTransferImageSvg } from './logic/TransferImageMap'
import { useUIContext } from './contexts/UIContext'
import { useGameContext } from './contexts/GameContext'

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
            <div className="Game">
                <div className={`dimmed-overlay ${isTransferMode ? 'active' : ''}`} onClick={handleClickAway} />

                {!upcomingStationsVertical && <UpcomingStations />}

                <Header text="Current Line:"></Header>
                <div className={`train ${gameState.isWon ? 'win-state' : ''}`}>
                    <TrainCar>
                        <Line transfers={currentLineSvg} notDim />
                    </TrainCar>
                </div>

                <GameStateUI />

                <SettingsUmbrella />
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
