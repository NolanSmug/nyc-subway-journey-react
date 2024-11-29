import React from 'react'
import { useUIContext } from '../contexts/UIContext'

import './AdvanceNStationsInput.css'
import { useGameContext } from '../contexts/GameContext'
import { Direction } from '../logic/TrainManager'

function AdvanceNStationsInput() {
    const { setNumAdvanceStations } = useUIContext()
    const { train } = useGameContext()

    const currentMaxNumber: number =
        train.getDirection() === Direction.DOWNTOWN
            ? train.getCurrentStationIndex()
            : train.getScheduledStops().length - train.getCurrentStationIndex() - 1

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
                if (value.toString() == '') {
                    input.style.backgroundColor = '#b71d1d7b'
                } else if (value > currentMaxNumber || value <= 0 || isInt(value)) {
                    input.style.backgroundColor = '#b71d1d7b'
                } else {
                    input.style.backgroundColor = ''
                }
            }}
        />
    )

    function isInt(num: number) {
        if (num.toString() == '') {
            return false
        }
        return num.toString().includes('.')
    }
}

export default AdvanceNStationsInput
