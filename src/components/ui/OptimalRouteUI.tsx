import './OptimalRouteUI.css'
import React, { useEffect, useState } from 'react'

import ActionButton from '../common/ActionButton'
import LoadingSpinner from '../common/LoadingSpinner'
import LineSVGs from '../common/LineSVGs'
import Header from '../common/Header'
import TrainCar from '../train/TrainCar'
import Station from '../station/Station'

import { useGameStateContext } from '../../contexts/GameStateContext'
import { useSettingsContext } from '../../contexts/SettingsContext'

import { useGame } from '../../hooks/useGame'

import { LineName, areLineSetsEqual } from '../../logic/LineManager'
import { getLineSVGs, lineToLineColor } from '../../logic/LineSVGsMap'
import { getLineType, LineType } from '../../logic/LineManager'

import REFRESH_BLACK from '../../images/refresh-icon-b.svg'
import REFRESH_WHITE from '../../images/refresh-icon-w.svg'
import OPTIMAL_BLACK from '../../images/optimal-route-icon-b.svg'
import OPTIMAL_WHITE from '../../images/optimal-route-icon-w.svg'
import INFO_ICON_W from '../../images/info-icon-white.svg'

interface StationData {
    id: string
    name: string
    lines: LineName[]
    color: string
}

async function fetchShortestPath(start: string, dest: string): Promise<StationData[]> {
    const baseURL =
        process.env.REACT_APP_USE_DEV_API === 'true'
            ? process.env.REACT_APP_OPTIMAL_ROUTE_DEV_API
            : process.env.REACT_APP_OPTIMAL_ROUTE_PROD_API
    const endpoint: string = `${baseURL}/${start}/${dest}`

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })

    // console.log(response)

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    const data: StationData[] = await response.json()
    return data
}

// originally implemented in python lol
const getTransfersIndexes = (stationData: StationData[]): number[] => {
    let indexes_with_transfer: number[] = []
    let prev_lines: LineName[] = [LineName.NULL_TRAIN]

    // Don't check last station, which always has a Null_train
    for (let i = 0; i < stationData.length - 1; i++) {
        if (!areLineSetsEqual(stationData[i].lines, prev_lines)) {
            // if lines changed...
            indexes_with_transfer.push(i)
            prev_lines = stationData[i].lines
        }
    }

    return indexes_with_transfer
}

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

type OptimalStationFragmentProps = {
    station: StationData
    prevStation?: StationData
    isTransfer: boolean
}

function OptimalStationFragment({ station, prevStation, isTransfer }: OptimalStationFragmentProps) {
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
                {isTransfer ? (
                    <LineSVGs svgPaths={getLineSVGs(station.lines)} wide={station.lines.length > 3} />
                ) : (
                    <div className='transfer-placeholder' />
                )}
            </div>
            <div className='station-with-line'>
                <div className='optimal-station-dot' style={dotStyle} />
                <div className='line-divider-custom' style={lineStyle} />
            </div>
            <div className='optimal-station-name'>{station.name}</div>
        </div>
    )
}

type GameOverUIProps = {
    destinationStationName: string
    destinationStationTransfers: LineName[]
    darkMode: boolean
    setIsRouteRequested: React.Dispatch<React.SetStateAction<boolean>>
    initializeGame: () => void
}

function GameOverUI({
    destinationStationName,
    destinationStationTransfers,
    darkMode,
    setIsRouteRequested,
    initializeGame,
}: GameOverUIProps) {
    return (
        <div className='game-over-wrapper'>
            <Header text='You win!' />
            <Station name={destinationStationName}>
                <LineSVGs svgPaths={getLineSVGs(destinationStationTransfers)} disabled notDim />
            </Station>
            <TrainCar forWinDisplay />
            <div className='optimal-route-request-container'>
                <div className='optimal-route-request-btn'>
                    <ActionButton
                        imageSrc={darkMode ? OPTIMAL_WHITE : OPTIMAL_BLACK}
                        label='Show optimal route'
                        onClick={() => setIsRouteRequested(true)}
                    />
                    <div>
                        <img src={INFO_ICON_W} alt='info' className='info-icon' />
                        <div className='tooltip'>
                            Calculates the <u>mathematically shortest path</u> (fewest stops visited).
                        </div>
                    </div>
                </div>
                <ActionButton
                    imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK}
                    label='Reset game'
                    onClick={() => {
                        initializeGame()
                    }}
                />
            </div>
        </div>
    )
}

function OptimalRouteUI() {
    const { gameState } = useGameStateContext()
    const { initializeGame } = useGame()
    const darkMode = useSettingsContext((state) => state.darkMode)

    const [stationData, setStationData] = useState<StationData[]>([])
    const [transferIndexes, setTransferIndexes] = useState<number[]>([])
    const [loadingVisible, setLoadingVisible] = useState(false)
    const [isRouteRequested, setIsRouteRequested] = useState(false)

    useEffect(() => {
        let isMounted = true

        ;(async () => {
            setLoadingVisible(true)
            try {
                const [startID, destID] = await gameState.getStartDestStationIDs()
                const data = await fetchShortestPath(startID, destID)

                if (isMounted) {
                    const stationsData: StationData[] = data.map((station: StationData) => ({
                        id: station.id,
                        name: station.name,
                        lines: station.lines,
                        color: station.color,
                    }))

                    setStationData(stationsData)
                }
            } catch (error) {
                console.error('Error fetching optimal route:', error)
            } finally {
                isMounted && setLoadingVisible(false)
            }
        })()

        return () => {
            isMounted = false
        }
    }, [gameState.isWon])

    useEffect(() => {
        if (stationData.length > 0 && transferIndexes.length === 0) {
            const indexes = getTransfersIndexes(stationData)
            setTransferIndexes(indexes)
        }
    }, [stationData])

    if (!isRouteRequested) {
        return (
            <GameOverUI
                destinationStationName={gameState.destinationStation.getName()}
                destinationStationTransfers={gameState.destinationStation.getTransfers()}
                darkMode={darkMode}
                setIsRouteRequested={setIsRouteRequested}
                initializeGame={initializeGame}
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
                {stationData.length === 0 && !loadingVisible && (
                    <h3 style={{ alignSelf: 'center' }}>Failed to load optimal route. Please try again later.</h3>
                )}
                {stationData.length > 0 && (
                    <div className='optimal-stations-horizontal'>
                        {stationData.map((station, index) => (
                            <OptimalStationFragment
                                key={index}
                                station={station}
                                prevStation={stationData[index - 1]}
                                isTransfer={transferIndexes.includes(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className='optimal-route-action-buttons'>
                <ActionButton
                    imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK}
                    label='Reset game'
                    onClick={() => {
                        initializeGame()
                    }}
                />
            </div>
        </>
    )
}

export default OptimalRouteUI
