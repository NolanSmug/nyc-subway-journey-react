import React from 'react'
import { useUIContext } from '../contexts/UIContext'

import './AdvanceNStationsInput.css'
import { useGameContext } from '../contexts/GameContext'
import { Direction } from '../logic/TrainManager'

function AdvanceNStationsInput() {
    const { numAdvanceStations, setNumAdvanceStations } = useUIContext()
    const { train } = useGameContext()

    const currentMaxNumber: number =
        train.getDirection() === Direction.DOWNTOWN
            ? train.getCurrentStationIndex()
            : train.getScheduledStops().length - train.getCurrentStationIndex() - 1

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value
        const parsedValue = parseInt(rawValue)

        // allow empty and invalid values temporarily (so it's editable)
        if (rawValue === '' || isNaN(parsedValue)) {
            setNumAdvanceStations(0)
            return
        }
        if (parsedValue >= 1 && parsedValue <= currentMaxNumber) {
            setNumAdvanceStations(parsedValue)
        }
    }

    return (
        <input
            type="number"
            value={numAdvanceStations || ''}
            onChange={handleInputChange}
            className="additional-input"
            placeholder="1"
            min={1}
            max={currentMaxNumber}
        />
    )
}

export default AdvanceNStationsInput
