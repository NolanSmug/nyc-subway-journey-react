import { LineName } from './EnumManager';
import IMG_A from '../images/a.svg'
import IMG_B from '../images/b.svg'
import IMG_C from '../images/c.svg'
import IMG_D from '../images/d.svg'
import IMG_E from '../images/e.svg'
import IMG_F from '../images/f.svg'
import IMG_G from '../images/g.svg'
// import IMG_H from '../images/h.svg'
import IMG_J from '../images/j.svg'
import IMG_L from '../images/l.svg'
import IMG_M from '../images/m.svg'
import IMG_N from '../images/n.svg'
import IMG_Q from '../images/q.svg'
import IMG_R from '../images/r.svg'
import IMG_S from '../images/s.svg'
// import IMG_T from '../images/t.svg'
import IMG_W from '../images/w.svg'
import IMG_Z from '../images/z.svg'
import IMG_SF from '../images/sf.svg'
import IMG_SR from '../images/sr.svg'
import IMG_1 from '../images/1.svg'
import IMG_2 from '../images/2.svg'
import IMG_3 from '../images/3.svg'
import IMG_4 from '../images/4.svg'
import IMG_5 from '../images/5.svg'
import IMG_6 from '../images/6.svg'
// import IMG_6D from '../images/6d.svg'
import IMG_7 from '../images/7.svg'
// import IMG_7D from '../images/7d.svg'
import { Station } from './StationManager';

const transferImageMap: { [key in LineName]: string } = {
    [LineName.NULL_TRAIN]: '', 
    [LineName.ONE_TRAIN]: IMG_1,
    [LineName.TWO_TRAIN]: IMG_2,
    [LineName.THREE_TRAIN]: IMG_3,
    [LineName.FOUR_TRAIN]: IMG_4,
    [LineName.FIVE_TRAIN]: IMG_5,
    [LineName.SIX_TRAIN]: IMG_6,
    [LineName.SEVEN_TRAIN]: IMG_7,
    [LineName.A_TRAIN]: IMG_A,
    [LineName.A_ROCKAWAY_MOTT_TRAIN]: IMG_A,
    [LineName.A_LEFFERTS_TRAIN]: IMG_A, 
    [LineName.C_TRAIN]: IMG_C,
    [LineName.E_TRAIN]: IMG_E,
    [LineName.B_TRAIN]: IMG_B,
    [LineName.D_TRAIN]: IMG_D,
    [LineName.F_TRAIN]: IMG_F,
    [LineName.M_TRAIN]: IMG_M,
    [LineName.N_TRAIN]: IMG_N,
    [LineName.Q_TRAIN]: IMG_Q,
    [LineName.R_TRAIN]: IMG_R,
    [LineName.W_TRAIN]: IMG_W,
    [LineName.J_TRAIN]: IMG_J,
    [LineName.Z_TRAIN]: IMG_Z,
    [LineName.G_TRAIN]: IMG_G,
    [LineName.L_TRAIN]: IMG_L,
    [LineName.S_TRAIN]: IMG_S,
    [LineName.S_TRAIN_SHUTTLE]: IMG_SF, 
    [LineName.S_TRAIN_ROCKAWAY]: IMG_SR,
};

// By allowing null | undefined, you're telling typescript that you expect null and undefined
// values. You do not expect these values. These are errors which indicate problems
// in your program and you want your tools to help you identify them.
//
export const getTransferImageSvg = (input: Station | LineName): string[] => {
    if (input instanceof Station) {
        return getTransferImages(input.getTransfers())
    }
    if (typeof input === 'string') {
        return getTransferImages([input])
    }
    throw new Error("The caller is wrong and needs to be fixed. " + input + " is not an acceptable value.")
}

export const getTransferImages = (transfers: LineName[]): string[] => {
    return transfers.map((transfer) => transferImageMap[transfer] || '');
};


// My ide tells me it's a map, the type says it's a map,
// the name is two nouns, lines need to have colors,
// we know its a map. Also consts are UPPER_CASE
//
// const LINE_COLOR
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
} as const
// This will make it a type error to change the map

// This function is called exactly once, just inline the constant
export function lineToLineColor(lineName: LineName): string {
    return lineColorMap[lineName]
}

export default transferImageMap;
