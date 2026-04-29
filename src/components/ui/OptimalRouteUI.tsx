import './OptimalRouteUI.css' // shared with GameOverUI component
import { useState } from 'react'

import ActionButton from '../common/ActionButton'
import LoadingSpinner from '../common/LoadingSpinner'
import LineSVGs from '../common/LineSVGs'

import { useJourneyContext } from '../../contexts/JourneyContext'
import { useSettingsContext } from '../../contexts/SettingsContext'

import useGame from '../../hooks/useGame'
import { useOptimalRoute } from '../../hooks/useOptimalRoute'

import { LineName } from '../../logic/LineManager'
import { getLineType, LineType } from '../../logic/LineManager'
import { lineToLineColor } from '../../logic/LineSVGsMap'
import { getTransferIndices, StationData } from '../../logic/RouteUtils'

import REFRESH_BLACK from '../../assets/images/refresh-icon-b.svg'
import REFRESH_WHITE from '../../assets/images/refresh-icon-w.svg'
import INFO_ICON_W from '../../assets/images/info-icon-white.svg'
import SUBWAY_ICON_BLACK from '../../assets/images/subway-b.svg'
import SUBWAY_ICON_WHITE from '../../assets/images/subway-w.svg'
import GameOverUI from './GameOverUI'

const hasMultiColoredLines = (lines: LineName[]): boolean => {
    return new Set(lines.map(lineToLineColor)).size > 1
}

const getDotColor = (line: LineName) => {
    return getLineType(line) === LineType.EXPRESS ? '#fff' : '#222'
}

const getMutliColorLineDivider = (lines: LineName[]): string => {
    const uniqueColors = Array.from(new Set(lines.map(lineToLineColor))) // use Set object to get unique colors

    if (uniqueColors.length === 1) {
        return uniqueColors[0]
    }

    if (uniqueColors.length === 2) {
        return `linear-gradient(to bottom, 
                ${uniqueColors[0]} 0%, 
                ${uniqueColors[0]} 50%, 
                ${uniqueColors[1]} 50%, 
                ${uniqueColors[1]} 100%)`
    }

    if (uniqueColors.length === 3) {
        return `linear-gradient(to bottom, 
                ${uniqueColors[0]} 0%, ${uniqueColors[0]} 33.33%,
                ${uniqueColors[1]} 33.33%, ${uniqueColors[1]} 66.66%,
                ${uniqueColors[2]} 66.66%, ${uniqueColors[2]} 100%)`
    }

    return `linear-gradient(to bottom, ${uniqueColors.join(', ')})` // fallback to actual gradient if > 3, but pretty rare if not impossible
}

interface OptimalRouteUIProps {
    isDailyChallenge: boolean
    setIsDailyChallenge: React.Dispatch<React.SetStateAction<boolean>>
}

function OptimalRouteUI({ isDailyChallenge, setIsDailyChallenge }: OptimalRouteUIProps) {
    const { initializeGame } = useGame()
    const journey = useJourneyContext((state) => state.journey)
    const darkMode = useSettingsContext((state) => state.darkMode)

    const [isRouteRequested, setIsRouteRequested] = useState(false)
    const [isHeuristic, setIsHeuristic] = useState(false)

    const [startId, destId] = journey.getStartDestStationIDs()

    const { routeData, isLoading } = useOptimalRoute(startId, destId, isHeuristic, journey.isWon && isRouteRequested)

    const transferIndexes = getTransferIndices(routeData)

    if (!isRouteRequested) {
        return (
            <GameOverUI
                destinationStationName={journey.destinationStation.getName()}
                destinationStationTransfers={journey.destinationStation.getTransfers()}
                darkMode={darkMode}
                setIsRouteRequested={setIsRouteRequested}
                initializeGame={initializeGame}
                isDailyChallenge={isDailyChallenge}
            />
        )
    }

    return (
        <>
            <h1 id='optimal-route-title'>
                <span>{isHeuristic ? 'Heuristic' : 'Mathematical'}</span> optimal route
            </h1>

            <div className='route-metrics'>
                <p>
                    Advanced {routeData.length - 1} {routeData.length - 1 === 1 ? 'station' /* edge edge case */ : 'stations'}
                </p>
                <p>
                    Transferred {transferIndexes.length - 1} {transferIndexes.length - 1 === 1 ? 'time' : 'times'}
                </p>
            </div>

            <div className='optimal-route-window-container'>
                <div className='optimal-route-info-container'>
                    <ActionButton
                        label={isHeuristic ? 'Show mathematical route' : 'Show heuristic route'}
                        onClick={() => setIsHeuristic(!isHeuristic)}
                    />

                    <div className='info-wrapper'>
                        <img src={INFO_ICON_W} alt='info' className='info-icon' />
                        <div className='tooltip'>
                            <span className='tooltip-item'>
                                <strong>Mathematical:</strong> true shortest path
                            </span>
                            <span className='tooltip-item'>
                                <strong>Heuristic:</strong> realistic path (transfer costs)
                            </span>
                        </div>
                    </div>
                </div>
                <LoadingSpinner
                    visible={isLoading}
                    text='Fetching the optimal route for the first time in your session may take
                    longer than expected. Subsequent optimal route displays will be faster. Please
                    contact the developer if any other issues occur.'
                    textDelaySecs={5}
                />
                {routeData.length === 0 && !isLoading && <h3>Failed to load optimal route. Please try again later.</h3>}
                {routeData.length > 0 && (
                    <div className='optimal-stations-horizontal'>
                        {routeData.map((station, index) => (
                            <OptimalStationFragment
                                key={`${isHeuristic ? 'h' : 'r'}-${index}`}
                                station={station}
                                prevStation={routeData[index - 1]}
                                isTransfer={transferIndexes.includes(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className='optimal-route-action-buttons'>
                <ActionButton
                    imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK}
                    label={`${isDailyChallenge ? 'Replay challenge' : 'Reset game'}`}
                    onClick={() => {
                        initializeGame()
                    }}
                />
                {isDailyChallenge && (
                    <ActionButton
                        imageSrc={darkMode ? SUBWAY_ICON_WHITE : SUBWAY_ICON_BLACK}
                        label='Open play'
                        onClick={() => {
                            setIsDailyChallenge(false)
                        }}
                    />
                )}
            </div>
        </>
    )
}

type OptimalStationFragmentProps = {
    station: StationData
    prevStation?: StationData
    isTransfer: boolean
}

const OptimalStationFragment = ({ station, prevStation, isTransfer }: OptimalStationFragmentProps) => {
    const isLastStation: boolean = station.lines.includes(LineName.NULL_TRAIN)
    const isMultiColor: boolean = hasMultiColoredLines(station.lines)

    const dotStyle: React.CSSProperties /* why do we use tsx again? */ = {
        backgroundColor: isLastStation && prevStation ? getDotColor(prevStation.lines[0]) : getDotColor(station.lines[0]),
        borderColor: isLastStation && prevStation ? prevStation.color : station.color,
    }
    const lineStyle: React.CSSProperties = {
        width: `${station.name.length * 12}px`,
        background: isMultiColor ? getMutliColorLineDivider(station.lines) : station.color,
        height: `${isMultiColor ? '0.7rem' : '0.5rem'}`,
    }

    return (
        <div className='optimal-station-container'>
            <div className='transfer-lines-wrapper'>
                {isTransfer ? <LineSVGs lines={station.lines} wide={station.lines.length > 3} /> : <div className='transfer-placeholder' />}
            </div>
            <div className='station-with-line'>
                <div className='optimal-station-dot' style={dotStyle} />
                <div className='line-divider-custom' style={lineStyle} />
            </div>
            <div className='optimal-station-name'>{station.name}</div>
        </div>
    )
}

export default OptimalRouteUI
