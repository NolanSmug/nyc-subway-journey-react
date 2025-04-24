import React, { useEffect, useState } from 'react'

import ActionButton from './ActionButton'
import LoadingSpinner from './LoadingSpinner'

import './OptimalRouteUI.css'
import { useGameContext } from '../contexts/GameContext'
import { useUIContext } from '../contexts/UIContext'
import { LineName } from '../logic/EnumManager'
import { getTransferImageSvg } from '../logic/TransferImageMap'
import { getLineType, LineType } from '../logic/EnumManager'

import REFRESH_BLACK from '../images/refresh-icon-b.svg'
import REFRESH_WHITE from '../images/refresh-icon-w.svg'

interface StationData {
    id: string
    name: string
    line: LineName
    color: string
}

// FOR TESTING LOADING SPINNER
//
// async function fetchWithDelay(start: string, dest: string) {
//     await new Promise((r) => setTimeout(r, 13_000))
//     return fetchShortestPath(start, dest)
// }

async function fetchShortestPath(start: string, dest: string): Promise<StationData[]> {
    const response = await fetch(`https://routeapi-gevj.onrender.com/route/${start}/${dest}`, {
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
    let prev_line: LineName = LineName.NULL_TRAIN

    /* Don't check last station, which always has a Null_train */
    for (let i = 0; i < stationData.length - 1; i++) {
        if (stationData[i].line !== prev_line) {
            indexes_with_transfer.push(i)
            prev_line = stationData[i].line
        }
    }

    return indexes_with_transfer
}

function OptimalRouteUI() {
    const { gameState, initializeGame } = useGameContext()
    const { darkMode } = useUIContext()

    const [stationData, setStationData] = useState<StationData[]>([])
    const [transferIndexes, setTransferIndexes] = useState<number[]>([])
    const [loadingVisible, setLoadingVisible] = useState(false)

    const getDotColor = (line: LineName) => {
        return getLineType(line) === LineType.EXPRESS ? '#fff' : '#222'
    }

    const getDotBorderColor = (line: LineName) => {
        return getLineType(line) === LineType.EXPRESS ? 'express' : 'local'
    }

    useEffect(() => {
        if (!gameState.isWon) return
        ;(async () => {
            setLoadingVisible(true)
            try {
                const [startID, destID] = await gameState.getStartDestStationIDs()
                const data = await fetchShortestPath(startID, destID)
                // const data = await fetchShortestPath(startID, destID)

                const stationsData: StationData[] = data.map((station: StationData) => ({
                    id: station.id,
                    name: station.name,
                    line: station.line,
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
        if (stationData.length > 0) {
            const indexes = getTransfersIndexes(stationData)
            setTransferIndexes(indexes)
        }
    }, [stationData])

    return (
        <>
            <h1>Optimal route</h1>
            <div className='optimal-route-window-container'>
                <LoadingSpinner
                    visible={loadingVisible}
                    text='Fetching the optimal route for the first time in your session may take
                    longer than expected. Subsequent optimal route displays will be faster,
                    assuming the server was pinged in the past 15 minutes. Please
                    contact the developer if any other issues occur.'
                    textDelaySecs={5}
                />
                <div className='optimal-stations-horizontal'>
                    {stationData.map((station, index) => (
                        <div key={index} className='optimal-station-container'>
                            <div className='transfer-lines-wrapper'>
                                {transferIndexes.includes(index) ? (
                                    <img
                                        src={getTransferImageSvg(station.line)[0]}
                                        alt={station.line}
                                        className='transfer-line-image optimal-transfer-line-image'
                                    ></img>
                                ) : (
                                    <div className='transfer-placeholder' /> // We need a placeholder for dots with no transfer svg
                                )}
                            </div>

                            <div className='station-with-line'>
                                <div
                                    // dynamically setting the coloring of station dots depending on if current line is express/local
                                    className={`optimal-station-dot ${
                                        station.line === LineName.NULL_TRAIN
                                            ? getDotBorderColor(stationData[index - 1].line)
                                            : getDotBorderColor(station.line)
                                    }`}
                                    style={{
                                        backgroundColor:
                                            station.line === LineName.NULL_TRAIN
                                                ? getDotColor(stationData[index - 1].line) // if is the last station's dot, set dot color to prev dot color
                                                : getDotColor(station.line), // else set dot color properly
                                    }}
                                />
                                <div
                                    className='line-divider-custom'
                                    style={{
                                        width: `${station.name.length * 11}px`,
                                        backgroundColor: station.color,
                                        borderColor: station.color,
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
