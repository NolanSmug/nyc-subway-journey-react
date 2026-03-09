import { useCallback } from 'react'
import { Gender, useSettingsContext } from '../contexts/SettingsContext'

import HUMAN_MALE_WHITE from '../assets/images/human-male-w.svg'
import HUMAN_MALE_BLACK from '../assets/images/human-male-b.svg'
import HUMAN_FEMALE_WHITE from '../assets/images/human-female-w.svg'
import HUMAN_FEMALE_BLACK from '../assets/images/human-female-b.svg'
import HUMAN_OTHER_WHITE from '../assets/images/human-other-w.svg'
import HUMAN_OTHER_BLACK from '../assets/images/human-other-b.svg'

export function usePassengerSprite() {
    const darkMode = useSettingsContext((state) => state.darkMode)
    const passengerGender = useSettingsContext((state) => state.passengerGender)
    const setPassengerGender = useSettingsContext((state) => state.setPassengerGender)

    const avatarSrc = useCallback(() => {
        if (passengerGender === Gender.MALE) return darkMode ? HUMAN_MALE_WHITE : HUMAN_MALE_BLACK
        if (passengerGender === Gender.FEMALE) return darkMode ? HUMAN_FEMALE_WHITE : HUMAN_FEMALE_BLACK
        return darkMode ? HUMAN_OTHER_WHITE : HUMAN_OTHER_BLACK
    }, [passengerGender, darkMode])

    const cycleGender = useCallback(() => {
        if (passengerGender === Gender.MALE) setPassengerGender(Gender.FEMALE)
        else if (passengerGender === Gender.FEMALE) setPassengerGender(Gender.OTHER)
        else setPassengerGender(Gender.MALE)
    }, [passengerGender, setPassengerGender])

    return { avatarSrc: avatarSrc(), cycleGender }
}
