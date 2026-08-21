import { useUIContext } from '../contexts/UIContext'
import { useSettingsContext, UpcomingStationsLayout, GameMode } from '../contexts/SettingsContext'

export function useGameUI() {
    const isMobile = useUIContext((state) => state.isMobile)
    const isDailyChallenge = useSettingsContext((state) => state.isDailyChallenge)

    const configuredLayout = useSettingsContext((state) => state.upcomingStationsLayout)
    const configuredGameMode = useSettingsContext((state) => state.gameMode)
    const configuredUpcomingStationsVisible = useSettingsContext((state) => state.upcomingStationsVisible)

    const gameMode = isMobile ? GameMode.CONDUCTOR : configuredGameMode

    const upcomingStationsLayout = isMobile
        ? UpcomingStationsLayout.VERTICAL
        : gameMode === GameMode.RIDER
          ? UpcomingStationsLayout.HORIZONTAL
          : configuredLayout

    return {
        gameMode,
        upcomingStationsVisible: !isDailyChallenge && configuredUpcomingStationsVisible,
        isVerticalLayout: upcomingStationsLayout === UpcomingStationsLayout.VERTICAL,
        isHorizontalLayout: upcomingStationsLayout === UpcomingStationsLayout.HORIZONTAL,
        isMobile,
    }
}
