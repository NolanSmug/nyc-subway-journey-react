const ADVANCE_MULTIPLIER: number = 1
const TRANSFER_MULTIPLIER: number = 3

export class Score {
    private advanceCount: number
    private transferCount: number

    constructor(advanceCount: number, transferCount: number) {
        this.advanceCount = advanceCount
        this.transferCount = transferCount
    }

    public get routeScore(): number {
        return this.advanceCount * ADVANCE_MULTIPLIER + this.transferCount * TRANSFER_MULTIPLIER
    }

    public getAdvanceCount(): number {
        return this.advanceCount
    }

    public getTransferCount(): number {
        return this.transferCount
    }

    public incrementAdvanceCount(numAdvance: number = 1) {
        this.advanceCount += numAdvance
    }

    public incrementTransferCount() {
        this.transferCount++
    }

    public reset() {
        this.advanceCount = 0
        this.transferCount = 0
    }
}
