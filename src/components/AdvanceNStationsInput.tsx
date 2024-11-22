import React from 'react'
import { useUIContext } from '../contexts/UIContext'

import './AdvanceNStationsInput.css'
import { useGameContext } from '../contexts/GameContext'
import { Direction } from '../logic/TrainManager'

function AdvanceNStationsInput() {
    const { setNumAdvanceStations } = useUIContext()
    const { train, gameState } = useGameContext()

    const currentMaxNumber: number =
        train.getDirection() === Direction.DOWNTOWN
            ? train.getCurrentStationIndex()
            : gameState.currentStations.length - train.getCurrentStationIndex() - 1
    return (
        <input
            type="number"
            defaultValue={1}
            onChange={(e) => {
                setNumAdvanceStations(parseInt(e.target.value))
            }}
            className="additional-input"
            placeholder="1"
            min={1}
            max={currentMaxNumber}
            onInput={(e) => {
                const input = e.currentTarget
                const value = parseInt(input.value)
                if (value > currentMaxNumber) {
                    input.style.backgroundColor = '#b71d1d7b'
                } else {
                    input.style.backgroundColor = ''
                }
            }}
        />
    )
}

export default AdvanceNStationsInput
