import { LineName } from './Line';
import IMG_A from '../images/a.svg'
import IMG_B from '../images/b.svg'
import IMG_C from '../images/c.svg'
import IMG_D from '../images/d.svg'
import IMG_E from '../images/e.svg'
import IMG_F from '../images/f.svg'
import IMG_G from '../images/g.svg'
import IMG_H from '../images/h.svg'
import IMG_J from '../images/j.svg'
import IMG_L from '../images/l.svg'
import IMG_M from '../images/m.svg'
import IMG_N from '../images/n.svg'
import IMG_Q from '../images/q.svg'
import IMG_R from '../images/r.svg'
import IMG_S from '../images/s.svg'
import IMG_T from '../images/t.svg'
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
import IMG_6D from '../images/6d.svg'
import IMG_7 from '../images/7.svg'
import IMG_7D from '../images/7d.svg'

const transferImageMap: { [key in LineName]: string } = {
    [LineName.NULL_TRAIN]: '', // Add the correct image or leave blank
    [LineName.ONE_TRAIN]: IMG_1,
    [LineName.TWO_TRAIN]: IMG_2,
    [LineName.THREE_TRAIN]: IMG_3,
    [LineName.FOUR_TRAIN]: IMG_4,
    [LineName.FIVE_TRAIN]: IMG_5,
    [LineName.SIX_TRAIN]: IMG_6,
    [LineName.SEVEN_TRAIN]: IMG_7,
    [LineName.A_TRAIN]: IMG_A,
    [LineName.A_ROCKAWAY_MOTT_TRAIN]: IMG_A, // Specify if you have an image
    [LineName.A_LEFFERTS_TRAIN]: IMG_A, // Specify if you have an image
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
    [LineName.S_TRAIN_SHUTTLE]: IMG_SF, // Specify if you have an image
    [LineName.S_TRAIN_ROCKAWAY]: IMG_SR, // Specify if you have an image
};

export const getTransferImages = (transfers: LineName[]): string[] => {
    return transfers.map((transfer) => transferImageMap[transfer] || '');
};

export default transferImageMap;