import { Borough, Direction, LineName } from '../logic/LineManager'

export function findDirectionLabel(direction: Direction, line: LineName, borough: Borough): string {
    const labels = LINE_DIRECTION_LABELS.get(line)
    if (!labels) return ''

    if (labels.defaultDirectionLabels) {
        return direction === Direction.DOWNTOWN ? labels.defaultDirectionLabels[0] : labels.defaultDirectionLabels[1]
    }

    return labels.boroughSpecificLabels?.[borough]?.[direction] || ''
}

interface LineDirectionDetails {
    defaultDirectionLabels?: [string, string]
    boroughSpecificLabels?: {
        [borough in Borough]?: {
            [direction in Direction]?: string
        }
    }
}

const LINE_DIRECTION_LABELS: Map<LineName, LineDirectionDetails> = new Map([
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
                    [Direction.DOWNTOWN]: 'Brooklyn-bound',
                    [Direction.UPTOWN]: '8 Avenue-bound',
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
                [Borough.BROOKLYN]: {
                    [Direction.DOWNTOWN]: 'Manhattan-bound',
                    [Direction.UPTOWN]: 'Queens-bound',
                },
                [Borough.MANHATTAN]: {
                    [Direction.DOWNTOWN]: 'Broad St-bound',
                    [Direction.UPTOWN]: 'Uptown',
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
