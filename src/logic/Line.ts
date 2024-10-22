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

export enum LineType {
    NONE = '',
    EXPRESS = 'Express',
    LOCAL = 'Local',
}

const TOTAL_NUM_LINES: number = 25

export class Line {
    static getRandomLine(): LineName {
        const desiredLines: LineName[] = [
            LineName.ONE_TRAIN,
            LineName.TWO_TRAIN,
            LineName.THREE_TRAIN,
            LineName.FOUR_TRAIN,
            LineName.FIVE_TRAIN,
            LineName.SIX_TRAIN,
            LineName.SEVEN_TRAIN,
            LineName.A_TRAIN,
            LineName.C_TRAIN,
            LineName.E_TRAIN,
            LineName.B_TRAIN,
            LineName.D_TRAIN,
            LineName.F_TRAIN,
            LineName.M_TRAIN,
            LineName.N_TRAIN,
            LineName.Q_TRAIN,
            LineName.R_TRAIN,
            LineName.W_TRAIN,
            LineName.J_TRAIN,
            LineName.Z_TRAIN,
            LineName.G_TRAIN,
            LineName.L_TRAIN,
            LineName.S_TRAIN,
            LineName.S_TRAIN_SHUTTLE,
            LineName.S_TRAIN_ROCKAWAY,
        ]

        const randomIndex = Math.floor(Math.random() * desiredLines.length)
        return desiredLines[randomIndex]
    }
}
