export enum LineName {
    NULL_TRAIN = 'Null_Train',
    ONE_TRAIN = 'One_Train',
    TWO_TRAIN = 'Two_Train',
    THREE_TRAIN = 'Three_Train',
    FOUR_TRAIN = 'Four_Train',
    FIVE_TRAIN = 'Five_Train',
    SIX_TRAIN = 'Six_Train',
    SEVEN_TRAIN = 'Seven_Train',
    A_TRAIN = 'A_Train',
    A_ROCKAWAY_MOTT_TRAIN = 'A_Train_Rockaway-Mott',
    A_LEFFERTS_TRAIN = 'A_Train_Lefferts',
    C_TRAIN = 'C_Train',
    E_TRAIN = 'E_Train',
    B_TRAIN = 'B_Train',
    D_TRAIN = 'D_Train',
    F_TRAIN = 'F_Train',
    M_TRAIN = 'M_Train',
    N_TRAIN = 'N_Train',
    Q_TRAIN = 'Q_Train',
    R_TRAIN = 'R_Train',
    W_TRAIN = 'W_Train',
    J_TRAIN = 'J_Train',
    Z_TRAIN = 'Z_Train',
    G_TRAIN = 'G_Train',
    L_TRAIN = 'L_Train',
    S_TRAIN = 'S_Train',
    S_TRAIN_SHUTTLE = 'S_Train_Shuttle',
    S_TRAIN_ROCKAWAY = 'S_Train_Rockaway',
}

export enum Borough {
    MANHATTAN = 'Manhattan',
    BROOKLYN = 'Brooklyn',
    QUEENS = 'Queens',
    BRONX = 'Bronx',
    STATEN_ISLAND = 'Staten Island',
}

export enum Direction {
    UPTOWN = 'Uptown',
    DOWNTOWN = 'Downtown',
    NULL_DIRECTION = '',
}

export enum LineType {
    NONE = '',
    EXPRESS = 'Express',
    LOCAL = 'Local',
}

export const LINE_TYPES: Record<LineName, LineType> = {
    [LineName.NULL_TRAIN]: LineType.NONE,
    [LineName.ONE_TRAIN]: LineType.LOCAL,
    [LineName.TWO_TRAIN]: LineType.EXPRESS,
    [LineName.THREE_TRAIN]: LineType.EXPRESS,
    [LineName.FOUR_TRAIN]: LineType.EXPRESS,
    [LineName.FIVE_TRAIN]: LineType.EXPRESS,
    [LineName.SIX_TRAIN]: LineType.LOCAL,
    [LineName.SEVEN_TRAIN]: LineType.LOCAL,
    [LineName.A_TRAIN]: LineType.EXPRESS,
    [LineName.A_ROCKAWAY_MOTT_TRAIN]: LineType.EXPRESS,
    [LineName.A_LEFFERTS_TRAIN]: LineType.EXPRESS,
    [LineName.B_TRAIN]: LineType.EXPRESS,
    [LineName.C_TRAIN]: LineType.LOCAL,
    [LineName.D_TRAIN]: LineType.EXPRESS,
    [LineName.E_TRAIN]: LineType.EXPRESS,
    [LineName.F_TRAIN]: LineType.LOCAL,
    [LineName.G_TRAIN]: LineType.LOCAL,
    [LineName.J_TRAIN]: LineType.LOCAL,
    [LineName.L_TRAIN]: LineType.LOCAL,
    [LineName.M_TRAIN]: LineType.LOCAL,
    [LineName.N_TRAIN]: LineType.EXPRESS,
    [LineName.Q_TRAIN]: LineType.EXPRESS,
    [LineName.R_TRAIN]: LineType.LOCAL,
    [LineName.W_TRAIN]: LineType.LOCAL,
    [LineName.Z_TRAIN]: LineType.LOCAL,
    [LineName.S_TRAIN]: LineType.NONE,
    [LineName.S_TRAIN_SHUTTLE]: LineType.NONE,
    [LineName.S_TRAIN_ROCKAWAY]: LineType.NONE,
}

// TODO: repOk() implementation (see TrainManger.ts)

export function getRandomLine(rng: () => number = Math.random): LineName {
    const lines: LineName[] = Object.values(LineName)
    let randomLine: LineName = LineName.NULL_TRAIN

    do {
        randomLine = lines[Math.floor(rng() * lines.length)]
    } while (randomLine === LineName.NULL_TRAIN)

    return randomLine
}

export function areLineSetsEqual(arrayA: LineName[], arrayB: LineName[], strictOrder = false): boolean {
    if (arrayA.length !== arrayB.length) return false

    if (strictOrder) {
        return arrayA.every((line, index) => line === arrayB[index])
    }

    let mapA: Map<string, number> = new Map()
    for (let i = 0; i < arrayA.length; i++) {
        mapA.set(arrayA[i], 1) // yes I can achieve the same with sorting the arrays or making a Set(), but I am practicing leetcode type solutions
    }

    return arrayB.every((transfer) => mapA.get(transfer))
}

export function areLineSetsDisjoint(arrayA: LineName[], arrayB: LineName[]): boolean {
    return !arrayA.some((line) => arrayB.includes(line))
}

export function getLineType(line: LineName): LineType {
    return LINE_TYPES[line] ?? LineType.NONE
}
