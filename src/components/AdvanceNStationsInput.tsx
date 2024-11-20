import React from 'react'
import { useUIContext } from '../contexts/UIContext'

import './AdvanceNStationsInput.css'

function AdvanceNStationsInput() {
    const { setNumAdvanceStations } = useUIContext()
    return (
        <input
            type="number"
            defaultValue={1}
            onChange={(e) => setNumAdvanceStations(parseInt(e.target.value))} // update numAdvanceStations
            className="additional-input"
            placeholder="1"
            min={1}
            max={99}
            onInput={(e) => e.currentTarget.validity.valid || (e.currentTarget.value = '')} // ensure input is in range
        />
    )
}

export default AdvanceNStationsInput
