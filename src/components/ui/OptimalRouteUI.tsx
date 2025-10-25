import React, { useEffect, useState } from 'react'

import './OptimalRouteUI.css'

import ActionButton from '../common/ActionButton'
import LoadingSpinner from '../common/LoadingSpinner'
import LineSVGs from '../LineSVGs'
import Header from '../common/Header'
import TrainCar from '../train/TrainCar'
import Station from '../station/Station'

import { useGameStateContext } from '../../contexts/GameStateContext'
import { useGame } from '../../hooks/useGame'

import { LineName, lineArrayEquals } from '../../logic/LineManager'
import { getLineSVGs, lineToLineColor } from '../../logic/LineSVGsMap'
import { getLineType, LineType } from '../../logic/LineManager'

import REFRESH_BLACK from '../../images/refresh-icon-b.svg'
import REFRESH_WHITE from '../../images/refresh-icon-w.svg'
import OPTIMAL_BLACK from '../../images/optimal-route-icon-b.svg'
import OPTIMAL_WHITE from '../../images/optimal-route-icon-w.svg'
import { useSettingsContext } from '../../contexts/SettingsContext'

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
        if (!lineArrayEquals(stationData[i].lines, prev_lines)) {
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
    const isLastStation = station.lines.includes(LineName.NULL_TRAIN)
    const dotStyle = {
        backgroundColor: isLastStation && prevStation ? getDotColor(prevStation.lines[0]) : getDotColor(station.lines[0]),
        borderColor: isLastStation && prevStation ? prevStation.color : station.color,
    }
    const lineStyle = {
        width: `${station.name.length * 12}px`,
        background: hasMultiColoredLines(station.lines) ? getMutliColorLineDivider(station.lines) : station.color,
        height: `${hasMultiColoredLines(station.lines) ? '0.7rem' : '0.5rem'}`,
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

function OptimalRouteUI() {
    const { gameState } = useGameStateContext()
    const { initializeGame } = useGame()
    const darkMode = useSettingsContext((state) => state.darkMode)

    const [stationData, setStationData] = useState<StationData[]>([])
    const [transferIndexes, setTransferIndexes] = useState<number[]>([])
    const [loadingVisible, setLoadingVisible] = useState(false)
    const [isRouteRequested, setIsRouteRequested] = useState(false)

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

    if (!isRouteRequested) {
        return (
            <div className='game-over-wrapper'>
                <Header text='You win!' />
                <Station name={gameState.destinationStation.getName()}>
                    <LineSVGs svgPaths={getLineSVGs(gameState.destinationStation.getTransfers())} disabled notDim />
                </Station>
                <TrainCar forWinDisplay />
                <div className='optimal-route-request-container'>
                    <ActionButton
                        imageSrc={darkMode ? OPTIMAL_WHITE : OPTIMAL_BLACK}
                        label='Show optimal route'
                        onClick={() => setIsRouteRequested(true)}
                    />
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
                        <OptimalStationFragment
                            key={index}
                            station={station}
                            prevStation={stationData[index - 1]}
                            isTransfer={transferIndexes.includes(index)}
                        />
                    ))}
                </div>
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
