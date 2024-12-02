import './UpcomingStationsHorizontal.css'
import { LineName } from '../logic/EnumManager'
import StationFragment from './StationFragment'
import { useEffect, useRef } from 'react'
import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'

const lineColorMap: { [key in LineName]: string } = {
    [LineName.NULL_TRAIN]: '',
    [LineName.ONE_TRAIN]: '#EE352E',
    [LineName.TWO_TRAIN]: '#EE352E',
    [LineName.THREE_TRAIN]: '#EE352E',
    [LineName.FOUR_TRAIN]: '#00933C',
    [LineName.FIVE_TRAIN]: '#00933C',
    [LineName.SIX_TRAIN]: '#00933C',
    [LineName.SEVEN_TRAIN]: '#B933AD',
    [LineName.A_TRAIN]: '#0039A6',
    [LineName.A_ROCKAWAY_MOTT_TRAIN]: '#0039A6',
    [LineName.A_LEFFERTS_TRAIN]: '#0039A6',
    [LineName.C_TRAIN]: '#0039A6',
    [LineName.E_TRAIN]: '#0039A6',
    [LineName.B_TRAIN]: '#FF6319',
    [LineName.D_TRAIN]: '#FF6319',
    [LineName.F_TRAIN]: '#FF6319',
    [LineName.M_TRAIN]: '#FF6319',
    [LineName.N_TRAIN]: '#FCCC0A',
    [LineName.Q_TRAIN]: '#FCCC0A',
    [LineName.R_TRAIN]: '#FCCC0A',
    [LineName.W_TRAIN]: '#FCCC0A',
    [LineName.J_TRAIN]: '#996633',
    [LineName.Z_TRAIN]: '#996633',
    [LineName.G_TRAIN]: '#6CBE45',
    [LineName.L_TRAIN]: '#A7A9AC',
    [LineName.S_TRAIN]: '#808183',
    [LineName.S_TRAIN_SHUTTLE]: '#808183',
    [LineName.S_TRAIN_ROCKAWAY]: '#808183',
}

export function lineToLineColor(lineName: LineName): string {
    return lineColorMap[lineName]
}

// TODO: Borough barrier

function UpcomingStationsHorizontal() {
    const { upcomingStationsVisible: visible } = useUIContext()
    const { train } = useGameContext()
    const stations = train.getScheduledStops()
    const currentStation = train.getCurrentStation()

    const stationsRef = useRef<HTMLDivElement>(null)
    const lineDividerRef = useRef<HTMLDivElement>(null)
    const currentID = currentStation.getId()

    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement = stationsRef.current.querySelector('.current-station')
            scrollToCurrentStation(currentStationElement!)
        }
    }, [currentStation, stations.length, currentID])

    useEffect(() => {
        if (stationsRef.current && lineDividerRef.current) {
            const stationsWidth = stationsRef.current.scrollWidth
            if (stationsWidth > 0) {
                lineDividerRef.current.style.width = `${stationsWidth}px`
            }
        }
    }, [stations.length, visible])

    if (!stations || stations.length === 0 || !visible) {
        return <div style={{ display: 'none' }} />
    }

    return (
        <div className="upcoming-stations-horizontal-container not-dim">
            <div className="stations-horizontal" ref={stationsRef}>
                {stations.map((station, index) => (
                    <StationFragment
                        key={station.getId() || index}
                        station={station}
                        transfers={station.getTransfers()}
                        className={currentID === station.getId() ? 'current-station' : ''}
                    />
                ))}
            </div>
            <div ref={lineDividerRef} className="line-divider" />
        </div>
    )
}

function scrollToCurrentStation(currentStationElement: Element): () => void {
    if (currentStationElement) {
        const timer = setTimeout(() => {
            currentStationElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'end' })
        }, 0) // !DO NOT REMOVE! no idea why "0ms delay" fixes occasional scrolling issues, but it does
        return () => clearTimeout(timer)
    } else {
        console.warn(`Current station not found.`)
    }
    console.warn(`Current station not found.`)
    return () => {}
}

export default UpcomingStationsHorizontal
