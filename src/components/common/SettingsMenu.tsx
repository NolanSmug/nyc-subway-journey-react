import * as React from 'react'
import SettingsButton from './SettingsButton'

import { useSettingsContext } from '../../contexts/SettingsContext'
import { useUIContext } from '../../contexts/UIContext'

import L_MODE from '../../images/light-mode-icon.svg'
import D_MODE from '../../images/dark-mode-icon.svg'
import UPCOMING_STATIONS_BLACK from '../../images/upcoming-stations-icon-b.svg'
import UPCOMING_STATIONS_WHITE from '../../images/upcoming-stations-icon-w.svg'
import UPCOMING_STATIONS_VERTICAL_BLACK from '../../images/upcoming-stations-vertical-icon-b.svg'
import UPCOMING_STATIONS_VERTICAL_WHITE from '../../images/upcoming-stations-vertical-icon-w.svg'
import UPCOMING_STATIONS_HORIZONTAL_BLACK from '../../images/upcoming-stations-horizontal-icon-b.svg'
import UPCOMING_STATIONS_HORIZONTAL_WHITE from '../../images/upcoming-stations-horizontal-icon-w.svg'
import CONDUCTOR_MODE_BLACK from '../../images/conductor-mode-icon-b.svg'
import CONDUCTOR_MODE_WHITE from '../../images/conductor-mode-icon-w.svg'
import RIDER_MODE_BLACK from '../../images/rider-mode-icon-b.svg'
import RIDER_MODE_WHITE from '../../images/rider-mode-icon-w.svg'

const SettingsMenu = () => {
    const darkMode = useUIContext((state) => state.darkMode)
    const setDarkMode = useUIContext((state) => state.setDarkMode)
    const isHorizontalLayout = useUIContext((state) => state.isHorizontalLayout)
    const toggleUpcomingStationsLayout = useUIContext((state) => state.toggleUpcomingStationsLayout)
    const setUpcomingStationsVisible = useUIContext((state) => state.setUpcomingStationsVisible)

    const conductorMode = useSettingsContext((state) => state.conductorMode)
    const setConductorMode = useSettingsContext((state) => state.setConductorMode)

    return (
        <>
            <SettingsButton label='Theme' imgSrc={darkMode ? L_MODE : D_MODE} onClick={() => setDarkMode((prev) => !prev)} />
            <SettingsButton
                label='Upcoming stations'
                imgSrc={darkMode ? UPCOMING_STATIONS_WHITE : UPCOMING_STATIONS_BLACK}
                onClick={() => setUpcomingStationsVisible((prev) => !prev)}
            />
            <SettingsButton
                label='Upcoming stations layout'
                imgSrc={
                    isHorizontalLayout()
                        ? darkMode
                            ? UPCOMING_STATIONS_VERTICAL_WHITE
                            : UPCOMING_STATIONS_VERTICAL_BLACK
                        : darkMode
                          ? UPCOMING_STATIONS_HORIZONTAL_WHITE
                          : UPCOMING_STATIONS_HORIZONTAL_BLACK
                }
                onClick={() => conductorMode && toggleUpcomingStationsLayout()}
                disabled={!conductorMode}
            />
            <SettingsButton
                label={!conductorMode ? 'Conductor mode' : 'Rider mode'}
                imgSrc={
                    conductorMode
                        ? darkMode
                            ? RIDER_MODE_WHITE
                            : RIDER_MODE_BLACK
                        : darkMode
                          ? CONDUCTOR_MODE_WHITE
                          : CONDUCTOR_MODE_BLACK
                }
                onClick={() => {
                    setConductorMode((prev) => !prev)
                }}
            />
        </>
    )
}

export default SettingsMenu
