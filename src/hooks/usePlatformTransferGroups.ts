import { useMemo } from 'react'
import { LineName } from '../logic/LineManager'
import { Station } from '../logic/Station'
import { getCorrespondingLineGroup, groupLines } from '../utility/lineSVGsMap'

type UsePlatformTransferGroups = {
    currentStation: Station
    currentLine: LineName
}

export function usePlatformTransferGroups({ currentStation, currentLine }: UsePlatformTransferGroups) {
    const stationID: string = currentStation.getId()
    const transfers: LineName[] = currentStation.getTransfers()

    const isOnJunctionLineA: boolean = useMemo(
        () => currentLine === LineName.A_ROCKAWAY_MOTT_TRAIN || currentLine === LineName.A_LEFFERTS_TRAIN,
        [currentLine]
    )

    if (isOnJunctionLineA && stationID !== 'A61' && stationID !== 'H04') currentLine = LineName.A_TRAIN // pretend we're on normal A train in special rockaway/lefferts cases

    const groupedTransfers = useMemo(() => groupLines(transfers, stationID), [transfers, stationID])
    const currentPlatformGroup = useMemo(() => getCorrespondingLineGroup(currentLine, groupedTransfers), [currentLine, groupedTransfers])
    const otherPlatformGroups = useMemo(() => groupedTransfers.filter((g) => !g.includes(currentLine)), [groupedTransfers, currentLine])
    const samePlatformLines = useMemo(
        () => currentPlatformGroup.filter((line) => line !== currentLine),
        [currentPlatformGroup, currentLine]
    )

    return useMemo(
        () => ({
            otherPlatformGroups,
            samePlatformLines,
            hasSamePlatformTransfers: currentPlatformGroup.length > 1,
            hasOtherPlatformTransfers: otherPlatformGroups.length > 0,
            transfers,
        }),
        [otherPlatformGroups, samePlatformLines, currentPlatformGroup, transfers]
    )
}
