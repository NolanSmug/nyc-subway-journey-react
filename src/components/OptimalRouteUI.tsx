import React, { useEffect, useState } from 'react'

import './OptimalRouteUI.css'

import ActionButton from './ActionButton'
import LoadingSpinner from './LoadingSpinner'

import { useGameContext } from '../contexts/GameContext'
import { useUIContext } from '../contexts/UIContext'
import { LineName, lineArrayEquals } from '../logic/LineManager'
import { getLineSVGs, lineToLineColor } from '../logic/LineSVGsMap'
import { getLineType, LineType } from '../logic/LineManager'

import REFRESH_BLACK from '../images/refresh-icon-b.svg'
import REFRESH_WHITE from '../images/refresh-icon-w.svg'
import OPTIMAL_BLACK from '../images/optimal-route-icon-b.svg'
import OPTIMAL_WHITE from '../images/optimal-route-icon-w.svg'
import LineSVGs from './LineSVGs'
import Header from './Header'
import TrainCar from './TrainCar'
import Station from './Station'

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

function getTransfersIndexes(stationData: StationData[]): number[] {
    let indexes_with_transfer: number[] = []
    let prev_lines: LineName[] = [LineName.NULL_TRAIN]

    // Don't check last station, which always has a Null_train
    for (let i = 0; i < stationData.length - 1; i++) {
        if (!lineArrayEquals(stationData[i].lines, prev_lines)) {
            // if lines changed...
            indexes_with_transfer.push(i)
            prev_lines = stationData[i].lines
        }
    }

    return indexes_with_transfer
}

function hasMultiColoredLines(lines: LineName[]): boolean {
    for (let i = 0; i < lines.length; i++) {
        if (lineToLineColor(lines[i]) !== lineToLineColor(lines[0])) {
            return true
        }
    }

    return false
}

function OptimalRouteUI() {
    const { gameState, initializeGame } = useGameContext()
    const { darkMode } = useUIContext()

    const [stationData, setStationData] = useState<StationData[]>([])
    const [transferIndexes, setTransferIndexes] = useState<number[]>([])
    const [loadingVisible, setLoadingVisible] = useState(false)
    const [isRequested, setIsRequested] = useState(false)

    const getDotColor = (line: LineName) => {
        return getLineType(line) === LineType.EXPRESS ? '#fff' : '#222'
    }

    function getMutliColorLineDivider(lines: LineName[]): string {
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

    useEffect(() => {
        if (!gameState.isWon || stationData.length > 0) return
        ;(async () => {
            setLoadingVisible(true)
            try {
                const [startID, destID] = await gameState.getStartDestStationIDs()
                const data = await fetchShortestPath(startID, destID)

                const stationsData: StationData[] = data.map((station: StationData) => ({
                    id: station.id,
                    name: station.name,
                    lines: station.lines,
                    color: station.color,
                }))

                setStationData(stationsData)
            } catch (error) {
                console.error('Error fetching optimal route:', error)
            } finally {
                setLoadingVisible(false)
            }
        })()
    }, [gameState.isWon])

    useEffect(() => {
        if (stationData.length > 0 && transferIndexes.length === 0) {
            const indexes = getTransfersIndexes(stationData)
            setTransferIndexes(indexes)
        }
    }, [stationData])

    if (!isRequested) {
        return (
            <>
                <Header text='You win!' />
                <Station name={gameState.destinationStation.getName()}>
                    <LineSVGs svgPaths={getLineSVGs(gameState.destinationStation.getTransfers())} notDim />
                </Station>
                <TrainCar forWinDisplay />
                <div className='optimal-route-request-container'>
                    <ActionButton
                        imageSrc={darkMode ? OPTIMAL_WHITE : OPTIMAL_BLACK}
                        label='Show optimal route'
                        onMouseDown={() => setIsRequested(true)}
                    />
                    <ActionButton
                        imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK}
                        label='Reset game'
                        onMouseDown={() => {
                            initializeGame()
                        }}
                    />
                </div>
            </>
        )
    }

    return (
        <>
            <h1>Optimal route</h1>
            <div className='optimal-route-window-container'>
                <LoadingSpinner
                    visible={loadingVisible}
                    text='Fetching the optimal route for the first time in your session may take
                    longer than expected. Subsequent optimal route displays will be faster. Please
                    contact the developer if any other issues occur.'
                    textDelaySecs={5}
                />
                <div className='optimal-stations-horizontal'>
                    {stationData.map((station, index) => (
                        <div key={index} className='optimal-station-container'>
                            <div className='transfer-lines-wrapper'>
                                {transferIndexes.includes(index) ? (
                                    <LineSVGs svgPaths={getLineSVGs(station.lines)} wide={station.lines.length > 3} />
                                ) : (
                                    <div className='transfer-placeholder' /> // we need a placeholder for dots with no transfer svg
                                )}
                            </div>

                            <div className='station-with-line'>
                                <div
                                    // dynamically setting the coloring of station dots depending on if current line is express/local
                                    className={`optimal-station-dot`}
                                    style={{
                                        backgroundColor: station.lines.includes(LineName.NULL_TRAIN)
                                            ? getDotColor(stationData[index - 1].lines[0]) // if is the last station's dot, set dot color to prev dot color
                                            : getDotColor(station.lines[0]), // else set dot color properly
                                        borderColor: station.lines.includes(LineName.NULL_TRAIN)
                                            ? stationData[index - 1].color // same logic here as in backgroundColor
                                            : station.color,
                                    }}
                                />
                                <div
                                    className='line-divider-custom'
                                    style={{
                                        width: `${station.name.length * 12}px`,
                                        background: hasMultiColoredLines(station.lines)
                                            ? getMutliColorLineDivider(station.lines)
                                            : station.color,
                                        height: `${hasMultiColoredLines(station.lines) ? '0.7rem' : '0.5rem'}`,
                                    }}
                                />
                            </div>

                            <div className='optimal-station-name'>{station.name}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='optimal-route-action-buttons'>
                <ActionButton
                    imageSrc={darkMode ? REFRESH_WHITE : REFRESH_BLACK}
                    label='Reset game'
                    onMouseDown={() => {
                        initializeGame()
                    }}
                />
            </div>
        </>
    )
}

export default OptimalRouteUI
