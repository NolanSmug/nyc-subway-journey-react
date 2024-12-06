import React from 'react'

import './AdvanceNStationsInput.css'
import { useGameContext } from '../contexts/GameContext'
import { Direction } from '../logic/EnumManager'
import { useSettingsContext } from '../contexts/SettingsContext'

function AdvanceNStationsInput() {
    const { numAdvanceStations, setNumAdvanceStations } = useSettingsContext()
    const { train } = useGameContext()

    let currentMaxNumber: number =
        train.getDirection() === Direction.DOWNTOWN
            ? train.getCurrentStationIndex()
            : train.getScheduledStops().length - train.getCurrentStationIndex() - 1

    if (train.isNullDirection()) currentMaxNumber = NaN

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue: string = e.target.value
        const parsedValue: number = parseInt(rawValue)

        // allow empty and invalid values temporarily (so it's editable)
        if (rawValue === '' || isNaN(parsedValue)) {
            setNumAdvanceStations(0)
        } else {
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
