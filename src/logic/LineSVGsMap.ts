import { areLineSetsEqual, LineName } from './LineManager'
import IMG_A from '../images/a.svg'
import IMG_AL from '../images/al.svg'
import IMG_AR from '../images/ar.svg'
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

const LINE_SVGS: { [key in LineName]: string } = {
    [LineName.NULL_TRAIN]: '',
    [LineName.ONE_TRAIN]: IMG_1,
    [LineName.TWO_TRAIN]: IMG_2,
    [LineName.THREE_TRAIN]: IMG_3,
    [LineName.FOUR_TRAIN]: IMG_4,
    [LineName.FIVE_TRAIN]: IMG_5,
    [LineName.SIX_TRAIN]: IMG_6,
    [LineName.SEVEN_TRAIN]: IMG_7,
    [LineName.A_TRAIN]: IMG_A,
    [LineName.A_ROCKAWAY_MOTT_TRAIN]: IMG_AR,
    [LineName.A_LEFFERTS_TRAIN]: IMG_AL,
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
}

const LINE_COLORS: { [key in LineName]: string } = {
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

export const getLineSVG = (line: LineName): string => {
    const svgPath: string = LINE_SVGS[line]

    if (!svgPath) {
        return ''
    }

    return svgPath
}

export const getLineSVGs = (lines: LineName[]): string[] => {
    return lines.map((transfer) => LINE_SVGS[transfer] || '')
}

export function lineToLineColor(line: LineName): string {
    return LINE_COLORS[line]
}

const LINE_GROUPS: LineName[][] = [
    [LineName.ONE_TRAIN, LineName.TWO_TRAIN, LineName.THREE_TRAIN],
    [LineName.FOUR_TRAIN, LineName.FIVE_TRAIN, LineName.SIX_TRAIN],
    [LineName.SEVEN_TRAIN],
    [LineName.A_TRAIN, LineName.C_TRAIN, LineName.E_TRAIN],
    [LineName.B_TRAIN, LineName.D_TRAIN, LineName.F_TRAIN, LineName.M_TRAIN],
    [LineName.N_TRAIN, LineName.Q_TRAIN, LineName.R_TRAIN, LineName.W_TRAIN],
    [LineName.J_TRAIN, LineName.Z_TRAIN],
    [LineName.G_TRAIN],
    [LineName.L_TRAIN],
    [LineName.S_TRAIN, LineName.S_TRAIN_SHUTTLE, LineName.S_TRAIN_ROCKAWAY],
]

const UNIQUE_STATION_GROUPS: { [key: string]: LineName[][] } = {
    //? FUN GAME: guess these station names just by their ids (ex: AAB == Atlantic Av Barclays)

    AAB: [
        [LineName.TWO_TRAIN, LineName.THREE_TRAIN],
        [LineName.FOUR_TRAIN, LineName.FIVE_TRAIN],
        [LineName.D_TRAIN, LineName.N_TRAIN, LineName.R_TRAIN],
        [LineName.B_TRAIN, LineName.Q_TRAIN],
    ],
    CAN: [
        [LineName.N_TRAIN, LineName.Q_TRAIN],
        [LineName.R_TRAIN, LineName.W_TRAIN],
        [LineName.J_TRAIN, LineName.Z_TRAIN],
        [LineName.SIX_TRAIN],
    ],
    WTC: [
        [LineName.TWO_TRAIN, LineName.THREE_TRAIN],
        [LineName.A_TRAIN, LineName.C_TRAIN],
        [LineName.E_TRAIN],
        [LineName.R_TRAIN, LineName.W_TRAIN],
    ],
    JAY: [[LineName.A_TRAIN, LineName.C_TRAIN, LineName.F_TRAIN], [LineName.R_TRAIN]],
    BOT: [[LineName.TWO_TRAIN, LineName.THREE_TRAIN, LineName.FOUR_TRAIN, LineName.FIVE_TRAIN], [LineName.S_TRAIN_SHUTTLE]],
    CSQ: [[LineName.E_TRAIN, LineName.F_TRAIN], [LineName.SEVEN_TRAIN], [LineName.G_TRAIN]],
    QBP: [[LineName.SEVEN_TRAIN, LineName.N_TRAIN, LineName.W_TRAIN]],
    LEX: [[LineName.E_TRAIN, LineName.F_TRAIN], [LineName.SIX_TRAIN]],
    CBC: [[LineName.A_TRAIN, LineName.B_TRAIN, LineName.C_TRAIN, LineName.D_TRAIN], [LineName.ONE_TRAIN]],
    ESX: [[LineName.J_TRAIN, LineName.M_TRAIN, LineName.Z_TRAIN], [LineName.F_TRAIN]], // Delancey St Essex St

    A61: [[LineName.A_TRAIN, LineName.A_LEFFERTS_TRAIN, LineName.A_ROCKAWAY_MOTT_TRAIN]], // Rockaway Blvd (junction)
    H04: [[LineName.A_ROCKAWAY_MOTT_TRAIN, LineName.S_TRAIN_ROCKAWAY]],
    BO8: [[LineName.M_TRAIN, LineName.Q_TRAIN]], // Lexington Av/63 St
    M14: [[LineName.J_TRAIN, LineName.M_TRAIN]], // Hewes St
    M13: [[LineName.J_TRAIN, LineName.M_TRAIN]], // Lorimer St
    M12: [[LineName.J_TRAIN, LineName.M_TRAIN]], // Flushing Av
    R30: [[LineName.B_TRAIN, LineName.Q_TRAIN, LineName.R_TRAIN]], // DeKalb
    A42: [[LineName.A_TRAIN, LineName.C_TRAIN, LineName.G_TRAIN]], // Hoyt Schermerhorn
    D14: [[LineName.B_TRAIN, LineName.D_TRAIN, LineName.E_TRAIN]], // 7 Av (53 St)
    G21: [[LineName.E_TRAIN, LineName.F_TRAIN, LineName.R_TRAIN]], // Queens Plaza
    D26: [[LineName.B_TRAIN, LineName.Q_TRAIN, LineName.S_TRAIN_SHUTTLE]], // Prospect Park
    G05: [[LineName.E_TRAIN, LineName.J_TRAIN, LineName.Z_TRAIN]], // Jamaica Center-Parsons/Archer
    G06: [[LineName.E_TRAIN, LineName.J_TRAIN, LineName.Z_TRAIN]], // Sutphin Blvd-ArcherAv-JFK Airport
    G08: [[LineName.E_TRAIN, LineName.F_TRAIN, LineName.M_TRAIN, LineName.R_TRAIN]], // Forest Hills-71 Av
    D43: [[LineName.D_TRAIN, LineName.F_TRAIN, LineName.N_TRAIN, LineName.Q_TRAIN]], // Coney Island-Stillwell Av
    A15: [[LineName.A_TRAIN, LineName.C_TRAIN, LineName.B_TRAIN, LineName.D_TRAIN]], // 125 St
    R36: [[LineName.D_TRAIN, LineName.N_TRAIN, LineName.R_TRAIN]], // 36 St
    '250': [[LineName.THREE_TRAIN, LineName.FOUR_TRAIN]], // Crown Hts-Utica Av
    '626': [[LineName.FOUR_TRAIN, LineName.FIVE_TRAIN], [LineName.SIX_TRAIN]], // 86 St
    '4A9': [[LineName.F_TRAIN, LineName.G_TRAIN], [LineName.R_TRAIN]], // 4 Av 9th
    '222': [[LineName.TWO_TRAIN, LineName.FIVE_TRAIN], [LineName.FOUR_TRAIN]], // 149 St-Grand Concourse
    '234': [[LineName.TWO_TRAIN, LineName.THREE_TRAIN, LineName.FOUR_TRAIN, LineName.FIVE_TRAIN]], // Nevins St
    '710': [[LineName.E_TRAIN, LineName.F_TRAIN, LineName.M_TRAIN, LineName.R_TRAIN], [LineName.SEVEN_TRAIN]], // Jackson Hts
}

export function groupLines(lines: LineName[], stationID: string): LineName[][] {
    if (stationID in UNIQUE_STATION_GROUPS) {
        return UNIQUE_STATION_GROUPS[stationID]
    }

    // handle F,G train pairing
    if (areLineSetsEqual(lines, [LineName.F_TRAIN, LineName.G_TRAIN])) {
        return [[LineName.F_TRAIN, LineName.G_TRAIN]]
    }
    // handle E,F train pairing
    if (areLineSetsEqual(lines, [LineName.E_TRAIN, LineName.F_TRAIN])) {
        return [[LineName.E_TRAIN, LineName.F_TRAIN]]
    }
    // handle M,R train pairing
    if (areLineSetsEqual(lines, [LineName.M_TRAIN, LineName.R_TRAIN])) {
        return [[LineName.M_TRAIN, LineName.R_TRAIN]]
    }
    // handle B,C train pairing
    if (areLineSetsEqual(lines, [LineName.B_TRAIN, LineName.C_TRAIN])) {
        return [[LineName.B_TRAIN, LineName.C_TRAIN]]
    }
    // handle J,M,Z train pairing
    if (areLineSetsEqual(lines, [LineName.J_TRAIN, LineName.M_TRAIN, LineName.Z_TRAIN])) {
        return [[LineName.J_TRAIN, LineName.M_TRAIN, LineName.Z_TRAIN]]
    }
    // handle B,Q train pairing
    if (areLineSetsEqual(lines, [LineName.B_TRAIN, LineName.Q_TRAIN])) {
        return [[LineName.B_TRAIN, LineName.Q_TRAIN]]
    }
    // handle 2,5 train pairing
    if (areLineSetsEqual(lines, [LineName.TWO_TRAIN, LineName.FIVE_TRAIN])) {
        return [[LineName.TWO_TRAIN, LineName.FIVE_TRAIN]]
    }

    return LINE_GROUPS.map((group) => group.filter((line) => lines.includes(line))).filter((filteredGroup) => filteredGroup.length > 0)
}

export function getCorrespondingLineGroup(line: LineName, groups: LineName[][]): LineName[] {
    if (!groups) groups = LINE_GROUPS

    return groups.find((group) => group.includes(line)) ?? []
}
