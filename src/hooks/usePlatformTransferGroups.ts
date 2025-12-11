import { useMemo } from 'react'
import { LineName } from '../logic/LineManager'
import { Station } from '../logic/StationManager'
import { getCorrespondingLineGroup, groupLines } from '../logic/LineSVGsMap'

type UsePlatformTransferGroups = {
    currentStation: Station
    currentLine: LineName
}

export function usePlatformTransferGroups({ currentStation, currentLine }: UsePlatformTransferGroups) {
    const stationID: string = currentStation.getId()
    const transfers: LineName[] = currentStation.getTransfers()

    const isOnAlternateATrain: boolean = useMemo(
        () => currentLine === LineName.A_ROCKAWAY_MOTT_TRAIN || currentLine === LineName.A_LEFFERTS_TRAIN,
        [currentLine]
    )

    if (isOnAlternateATrain && stationID !== 'A61' && stationID !== 'H04') currentLine = LineName.A_TRAIN

    const groupedTransfers = useMemo(() => groupLines(transfers, stationID), [transfers, stationID])
    const currentPlatformGroup = useMemo(() => getCorrespondingLineGroup(currentLine, groupedTransfers), [currentLine, groupedTransfers])
    const otherPlatformGroups = useMemo(() => groupedTransfers.filter((g) => !g.includes(currentLine)), [groupedTransfers, currentLine])
    const samePlatformLines = useMemo(
        () => currentPlatformGroup.filter((line) => line !== currentLine),
        [currentPlatformGroup, currentLine]
    )

    return {
        otherPlatformGroups,
        samePlatformLines,
        hasSamePlatformTransfers: currentPlatformGroup.length > 1,
        hasOtherPlatformTransfers: otherPlatformGroups.length > 0,
        transfers,
    }
}
