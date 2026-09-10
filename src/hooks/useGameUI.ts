import { useUIContext } from '../contexts/UIContext'
import { useSettingsContext, UpcomingStationsLayout, UIMode, GameMode } from '../contexts/SettingsContext'

export function useGameUI() {
    const isMobile = useUIContext((state) => state.isMobile)
    const isDailyChallenge = useSettingsContext((state) => state.gameMode) === GameMode.DAILY_CHALLENGE

    const configuredLayout = useSettingsContext((state) => state.upcomingStationsLayout)
    const configuredUIMode = useSettingsContext((state) => state.uiMode)
    const configuredUpcomingStationsVisible = useSettingsContext((state) => state.upcomingStationsVisible)

    const uiMode = isMobile ? UIMode.CONDUCTOR : configuredUIMode

    const upcomingStationsLayout = isMobile
        ? UpcomingStationsLayout.VERTICAL
        : uiMode === UIMode.RIDER
          ? UpcomingStationsLayout.HORIZONTAL
          : configuredLayout

    return {
        uiMode,
        upcomingStationsVisible: !isDailyChallenge && configuredUpcomingStationsVisible,
        isVerticalLayout: upcomingStationsLayout === UpcomingStationsLayout.VERTICAL,
        isHorizontalLayout: upcomingStationsLayout === UpcomingStationsLayout.HORIZONTAL,
        isMobile,
    }
}
