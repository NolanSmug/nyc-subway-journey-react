import { Direction } from '../../logic/LineManager'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useTrainContext } from '../../contexts/TrainContext'

import './AdvanceNStationsInput.css'

import RESET_INPUT_B from '../../images/reset-input-black.svg'
import RESET_INPUT_W from '../../images/reset-input-white.svg'

function AdvanceNStationsInput() {
    const darkMode = useSettingsContext((state) => state.darkMode)
    const numAdvanceStations = useSettingsContext((state) => state.numAdvanceStations)
    const setNumAdvanceStations = useSettingsContext((state) => state.setNumAdvanceStations)

    const trainDirection = useTrainContext((state) => state.train.getDirection())
    const stationIndex = useTrainContext((state) => state.train.getCurrentStationIndex())
    const scheduledStopsCount = useTrainContext((state) => state.train.getScheduledStops().length)

    let currentMaxNumber: number = trainDirection === Direction.DOWNTOWN ? stationIndex : scheduledStopsCount - stationIndex - 1

    if (trainDirection === Direction.NULL_DIRECTION) currentMaxNumber = 1

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
        <div className='additional-input-container'>
            <input
                type='number'
                value={numAdvanceStations || ''}
                onChange={handleInputChange}
                className='additional-input'
                placeholder='1'
                min={1}
                max={currentMaxNumber}
            />
            <img
                src={darkMode ? RESET_INPUT_W : RESET_INPUT_B}
                alt='Reset Input'
                className='reset-input-button'
                onMouseDown={() => setNumAdvanceStations(1)}
                style={{ opacity: numAdvanceStations == 1 ? 0 : 1 }}
            />
        </div>
    )
}

export default AdvanceNStationsInput
