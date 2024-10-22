export interface UpcomingStationsProps {
    stations: string
    lineColor: string
}

function UpcomingStations({ stations, lineColor }: UpcomingStationsProps) {
    return (
        <>
            <h1 id={lineColor}>{stations}</h1>
        </>
    )
}
