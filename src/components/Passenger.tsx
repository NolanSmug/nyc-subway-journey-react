import HUMAN_MALE_WHITE from '../images/human-male-w.svg'
import HUMAN_MALE_BLACK from '../images/human-male-b.svg'
import HUMAN_FEMALE_WHITE from '../images/human-female-w.svg'
import HUMAN_FEMALE_BLACK from '../images/human-female-b.svg'
import HUMAN_OTHER_WHITE from '../images/human-other-w.svg'
import HUMAN_OTHER_BLACK from '../images/human-other-b.svg'

import './Passenger.css'
import { Gender, useSettingsContext } from '../contexts/SettingsContext'
import { useUIContext } from '../contexts/UIContext'
import { PassengerState } from '../hooks/usePassengerActions'

const Passenger = () => {
    const { darkMode } = useUIContext()
    const { passengerGender, setPassengerGender, conductorMode } = useSettingsContext()

    const { passengerState, passengerPosition } = useUIContext()

    if (conductorMode) return null

    function getGenderSVG() {
        if (passengerGender === Gender.MALE) {
            return darkMode ? HUMAN_MALE_WHITE : HUMAN_MALE_BLACK
        } else if (passengerGender === Gender.FEMALE) {
            return darkMode ? HUMAN_FEMALE_WHITE : HUMAN_FEMALE_BLACK
        } else {
            return darkMode ? HUMAN_OTHER_WHITE : HUMAN_OTHER_BLACK
        }
    }

    const selectNewGender = () => {
        if (passengerGender === Gender.MALE) {
            setPassengerGender(Gender.FEMALE)
        } else if (passengerGender === Gender.FEMALE) {
            setPassengerGender(Gender.OTHER)
        } else {
            setPassengerGender(Gender.MALE)
        }
    }

    return (
        <img
            src={getGenderSVG()}
            className={`passenger ${passengerState === PassengerState.WALKING ? 'walking' : ''}`}
            style={{
                transform: `translate(${passengerPosition?.x || 0}px, ${passengerPosition?.y || 0}px) translate(-50%, -50%)`,
            }}
            onMouseDown={selectNewGender}
        />
    )
}

export default Passenger
