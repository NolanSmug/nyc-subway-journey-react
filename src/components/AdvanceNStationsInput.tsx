import { Direction } from '../logic/EnumManager'
import { useGameContext } from '../contexts/GameContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import { useUIContext } from '../contexts/UIContext'

import './AdvanceNStationsInput.css'

import RESET_INPUT_B from '../images/reset-input-black.svg'
import RESET_INPUT_W from '../images/reset-input-white.svg'

function AdvanceNStationsInput() {
    const { darkMode } = useUIContext()
    const { train } = useGameContext()
    const { numAdvanceStations, setNumAdvanceStations, conductorMode: visible } = useSettingsContext()

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

    if (!visible) return null

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
