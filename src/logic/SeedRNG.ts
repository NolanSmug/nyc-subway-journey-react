const MERSENNE_PRIME_31 = 2147483647 // 2^31 - 1
const LCG_MULTIPLIER = 16807 // 7^5

export class SeedRNG {
    private seed: number

    constructor(seedStr: string) {
        const salt = process.env.REACT_APP_RNG_SALT || '' // yup that's right. I'm salting on you tourists

        this.seed = this.stringToInteger(seedStr + salt)
        if (this.seed === 0) this.seed = 1
    }

    private stringToInteger(str: string): number {
        let hash: number = 0
        if (str.length === 0) return hash

        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i)
            hash = (hash << 5) - hash + char // bit shift by 2^5 (int32)
            hash = hash >>> 0 // convert to UNSIGNED int32 "https://stackoverflow.com/questions/54406985/why-does-number-0-convert-to-32bit-integer#comment95625646_54406985"
        }

        return Math.abs(hash)
    }

    // LCG (Linear Congruential Generator)
    public next(): number {
        this.seed = (this.seed * LCG_MULTIPLIER) % MERSENNE_PRIME_31
        return (this.seed - 1) / (MERSENNE_PRIME_31 - 1)

        // Goal: normalize [1, M-1] onto [0, 1)
        // this.seed: [1, 2147483646]
        // (this.seed - 1) / (MERSENNE_PRIME_31 - 1): [0, 0.9999999995]
    }
}
