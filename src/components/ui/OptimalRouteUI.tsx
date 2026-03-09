import './OptimalRouteUI.css' // shared with GameOverUI component
import React, { useEffect, useState } from 'react'

import ActionButton from '../common/ActionButton'
import LoadingSpinner from '../common/LoadingSpinner'
import LineSVGs from '../common/LineSVGs'

import { useGameStateContext } from '../../contexts/GameStateContext'
import { useSettingsContext } from '../../contexts/SettingsContext'

import { useGame } from '../../hooks/useGame'

import { LineName } from '../../logic/LineManager'
import { getLineType, LineType } from '../../logic/LineManager'
import { lineToLineColor } from '../../logic/LineSVGsMap'
import { fetchShortestPath, getTransferIndices, StationData } from '../../logic/RouteUtils'

import REFRESH_BLACK from '../../assets/images/refresh-icon-b.svg'
import REFRESH_WHITE from '../../assets/images/refresh-icon-w.svg'
import INFO_ICON_W from '../../assets/images/info-icon-white.svg'
import SUBWAY_ICON_BLACK from '../../assets/images/subway-b.svg'
import SUBWAY_ICON_WHITE from '../../assets/images/subway-w.svg'
import GameOverUI from './GameOverUI'

const hasMultiColoredLines = (lines: LineName[]): boolean => {
    for (let i = 0; i < lines.length; i++) {
        if (lineToLineColor(lines[i]) !== lineToLineColor(lines[0])) {
            return true
        }
    }
    return false
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
    const { gameState } = useGameStateContext()
    const { initializeGame } = useGame()
    const darkMode = useSettingsContext((state) => state.darkMode)

    const [routeData, setRouteData] = useState<StationData[]>([])
    const [transferIndexes, setTransferIndexes] = useState<number[]>([])
    const [loadingVisible, setLoadingVisible] = useState(false)
    const [isRouteRequested, setIsRouteRequested] = useState(false)

    useEffect(() => {
        if (!gameState.isWon || !isRouteRequested) return

        const controller = new AbortController()

        const loadRoute = async () => {
            setLoadingVisible(true)

            try {
                const [startId, destId] = gameState.getStartDestStationIDs()
                const data = await fetchShortestPath(startId, destId, controller.signal)
                setRouteData(data)
            } catch (e: unknown) {
                if (e instanceof Error && e.name === 'AbortError') return // why am I using typescript again?
                console.error('Failed to load optimal route', e)
            } finally {
                setLoadingVisible(false)
            }
        }

        loadRoute()
        return () => controller.abort()
    }, [gameState, isRouteRequested])

    useEffect(() => {
        if (routeData.length > 0 && transferIndexes.length === 0) {
            const indexes: number[] = getTransferIndices(routeData)
            setTransferIndexes(indexes)
        }
    }, [routeData, transferIndexes.length])

    if (!isRouteRequested) {
        return (
            <GameOverUI
                destinationStationName={gameState.destinationStation.getName()}
                destinationStationTransfers={gameState.destinationStation.getTransfers()}
                darkMode={darkMode}
                setIsRouteRequested={setIsRouteRequested}
                initializeGame={initializeGame}
                isDailyChallenge={isDailyChallenge}
                setIsDailyChallenge={setIsDailyChallenge}
            />
        )
    }

    return (
        <>
            <h1>Optimal route</h1>
            <div>
                <img src={INFO_ICON_W} alt='info' className='info-icon' />
                <div className='tooltip'>
                    This is the <u>mathematically shortest path</u> from the starting station to the destination.
                </div>
            </div>
            <div className='optimal-route-window-container'>
                <LoadingSpinner
                    visible={loadingVisible}
                    text='Fetching the optimal route for the first time in your session may take
                    longer than expected. Subsequent optimal route displays will be faster. Please
                    contact the developer if any other issues occur.'
                    textDelaySecs={5}
                />
                {routeData.length === 0 && !loadingVisible && (
                    <h3 style={{ alignSelf: 'center' }}>Failed to load optimal route. Please try again later.</h3>
                )}
                {routeData.length > 0 && (
                    <div className='optimal-stations-horizontal'>
                        {routeData.map((station, index) => (
                            <OptimalStationFragment
                                key={index}
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
