import React from 'react'
import SettingsButton from './SettingsButton'

import { GameMode, UpcomingStationsLayout, useSettingsContext } from '../../contexts/SettingsContext'

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
    const darkMode = useSettingsContext((state) => state.darkMode)
    const setDarkMode = useSettingsContext((state) => state.setDarkMode)

    const gameMode = useSettingsContext((state) => state.gameMode)
    const setGameMode = useSettingsContext((state) => state.setGameMode)
    const setUpcomingStationsVisible = useSettingsContext((state) => state.setUpcomingStationsVisible)
    const toggleUpcomingStationsLayout = useSettingsContext((state) => state.toggleUpcomingStationsLayout)
    const isHorizontalLayout = useSettingsContext((state) => state.upcomingStationsLayout === UpcomingStationsLayout.HORIZONTAL)

    const isConductorMode = gameMode === GameMode.CONDUCTOR

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
                    isHorizontalLayout
                        ? darkMode
                            ? UPCOMING_STATIONS_VERTICAL_WHITE
                            : UPCOMING_STATIONS_VERTICAL_BLACK
                        : darkMode
                          ? UPCOMING_STATIONS_HORIZONTAL_WHITE
                          : UPCOMING_STATIONS_HORIZONTAL_BLACK
                }
                onClick={() => isConductorMode && toggleUpcomingStationsLayout()}
                disabled={!isConductorMode}
            />
            <SettingsButton
                label={isConductorMode ? 'Rider mode' : 'Conductor mode'}
                imgSrc={
                    isConductorMode
                        ? darkMode
                            ? RIDER_MODE_WHITE
                            : RIDER_MODE_BLACK
                        : darkMode
                          ? CONDUCTOR_MODE_WHITE
                          : CONDUCTOR_MODE_BLACK
                }
                onClick={() => {
                    setGameMode(isConductorMode ? GameMode.RIDER : GameMode.CONDUCTOR)
                }}
            />
        </>
    )
}

export default React.memo(SettingsMenu)
