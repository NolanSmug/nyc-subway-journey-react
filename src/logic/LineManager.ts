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

export const lineTypes: Map<LineName, LineType> = new Map([
    [LineName.NULL_TRAIN, LineType.NONE],
    [LineName.ONE_TRAIN, LineType.LOCAL],
    [LineName.TWO_TRAIN, LineType.EXPRESS],
    [LineName.THREE_TRAIN, LineType.EXPRESS],
    [LineName.FOUR_TRAIN, LineType.EXPRESS],
    [LineName.FIVE_TRAIN, LineType.EXPRESS],
    [LineName.SIX_TRAIN, LineType.LOCAL],
    [LineName.SEVEN_TRAIN, LineType.LOCAL],
    [LineName.A_TRAIN, LineType.EXPRESS],
    [LineName.B_TRAIN, LineType.EXPRESS],
    [LineName.C_TRAIN, LineType.LOCAL],
    [LineName.D_TRAIN, LineType.EXPRESS],
    [LineName.E_TRAIN, LineType.EXPRESS],
    [LineName.F_TRAIN, LineType.LOCAL],
    [LineName.G_TRAIN, LineType.LOCAL],
    [LineName.J_TRAIN, LineType.LOCAL],
    [LineName.L_TRAIN, LineType.LOCAL],
    [LineName.M_TRAIN, LineType.LOCAL],
    [LineName.N_TRAIN, LineType.EXPRESS],
    [LineName.Q_TRAIN, LineType.EXPRESS],
    [LineName.R_TRAIN, LineType.LOCAL],
    [LineName.W_TRAIN, LineType.LOCAL],
    [LineName.Z_TRAIN, LineType.LOCAL],
    [LineName.S_TRAIN, LineType.NONE],
    [LineName.S_TRAIN_SHUTTLE, LineType.NONE],
    [LineName.S_TRAIN_ROCKAWAY, LineType.NONE],
])

// TODO: repOk() implementation (see TrainManger.ts)

export function getRandomLine(): LineName {
    const lines: LineName[] = Object.values(LineName)
    let randomLine: LineName = LineName.NULL_TRAIN
    do {
        randomLine = lines[Math.floor(Math.random() * lines.length)]
    } while (randomLine === LineName.NULL_TRAIN)

    // can't start with special A train (weird transfer logic occurs)
    if (randomLine === LineName.A_LEFFERTS_TRAIN || randomLine === LineName.A_ROCKAWAY_MOTT_TRAIN) {
        randomLine = LineName.A_TRAIN
    }

    return randomLine
}

export function lineArrayEquals(arrayA: LineName[], arrayB: LineName[]): boolean {
    if (arrayA.length != arrayB.length) return false

    for (let i = 0; i < arrayA.length; i++) {
        if (arrayA[i] !== arrayB[i]) {
            return false
        }
    }

    return true
}

export function getLineType(line: LineName): LineType {
    return lineTypes.get(line) ?? LineType.NONE
}

interface LineDirectionDetails {
    defaultDirectionLabels?: [string, string]
    boroughSpecificLabels?: {
        [borough in Borough]?: {
            [direction in Direction]?: string
        }
    }
}

export const lineDirectionsDetailed: Map<LineName, LineDirectionDetails> = new Map([
    [
        LineName.ONE_TRAIN,
        {
            defaultDirectionLabels: ['Downtown', 'Uptown'],
        },
    ],
    [
        LineName.TWO_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.BRONX]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Wakefield-241 St-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: 'Bronx-bound',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Flatbush-Avenue-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.THREE_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: 'Uptown',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'New Lots Avenue-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.FOUR_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.BRONX]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Woodlawn-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: 'Bronx-bound',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Crown Heights-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.FIVE_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.BRONX]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Eastchester-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: 'Bronx-bound',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Flatbush-Avenue-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.SIX_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.BRONX]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Pelham Bay Park-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-Bridge-bound',
                    [Direction.UPTOWN]: 'Uptown',
                },
            },
        },
    ],
    [
        LineName.SEVEN_TRAIN,
        {
            defaultDirectionLabels: ['Manhattan-bound', 'Queens-bound'],
            boroughSpecificLabels: {
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Flushing-Main St-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: '34 St-Hudson Yards-bound',
                    [Direction.UPTOWN]: 'Queens-bound',
                },
            },
        },
    ],
    [
        LineName.A_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Downtown',
                    [Direction.UPTOWN]: 'Uptown',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Queens-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Rockaway Blvd-bound',
                    [Direction.UPTOWN]: 'Brooklyn-bound',
                },
            },
        },
    ],
    [
        LineName.A_ROCKAWAY_MOTT_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Downtown',
                    [Direction.UPTOWN]: 'Uptown',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Queens-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Far Rockaway-Mott-bound',
                    [Direction.UPTOWN]: 'Brooklyn-bound',
                },
            },
        },
    ],
    [
        LineName.A_LEFFERTS_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Downtown',
                    [Direction.UPTOWN]: 'Uptown',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Queens-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Ozone Park-Lefferts Blvd-bound',
                    [Direction.UPTOWN]: 'Brooklyn-bound',
                },
            },
        },
    ],
    [
        LineName.B_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.BRONX]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Bedford Park Blvd-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Downtown',
                    [Direction.UPTOWN]: 'Uptown',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Brighton Beach-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.C_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Downtown',
                    [Direction.UPTOWN]: 'Uptown',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Euclid Av-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.D_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.BRONX]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Norwood-205 St-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Downtown',
                    [Direction.UPTOWN]: 'Uptown',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Coney Island-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.E_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'World Trade Center-bound',
                    [Direction.UPTOWN]: 'Queens-bound',
                },
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Jamaica Center-bound',
                },
            },
        },
    ],
    [
        LineName.F_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Jamaica-179 St-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Downtown',
                    [Direction.UPTOWN]: 'Uptown',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Coney Island-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.G_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: 'Court Sq-bound',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Church Av-bound',
                    [Direction.UPTOWN]: 'Queens-bound',
                },
            },
        },
    ],
    [
        LineName.J_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: 'Jamaica Center-bound',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Queens-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Broad St-bound',
                    [Direction.UPTOWN]: 'Brooklyn-bound',
                },
            },
        },
    ],
    [
        LineName.L_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: '8 Avenue-bound',
                    [Direction.UPTOWN]: 'Brooklyn-bound',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Rockaway Parkway-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Rockaway Parkway-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.M_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Middle Village-bound',
                    [Direction.UPTOWN]: 'Forest Hills-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: 'Queens-bound',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Queens-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.N_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Astoria-Ditmars Blvd-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: 'Queens-bound',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Coney Island-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.Q_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: '96 St-bound',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Coney Island-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.R_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Forest Hills-71 Av-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: 'Queens-bound',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Bay Ridge-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.W_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Astoria-Ditmars Blvd-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Whitehall St-bound',
                    [Direction.UPTOWN]: 'Uptown',
                },
            },
        },
    ],
    [
        LineName.Z_TRAIN,
        {
            boroughSpecificLabels: {
                [Borough.QUEENS]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: 'Jamaica Center-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: 'Uptown',
                },
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Jamaica Center-bound',
                    [Direction.UPTOWN]: 'Manhattan-bound',
                },
            },
        },
    ],
    [
        LineName.S_TRAIN,
        {
            defaultDirectionLabels: ['Times Sq-bound', 'Grand Central-bound'],
        },
    ],
    [
        LineName.S_TRAIN_SHUTTLE,
        {
            defaultDirectionLabels: ['Franklin Av-bound', 'Prospect Park-bound'],
        },
    ],
    [
        LineName.S_TRAIN_ROCKAWAY,
        {
            defaultDirectionLabels: ['Broad Channel-bound', 'Rockaway Park-Beach-bound'],
        },
    ],
])
