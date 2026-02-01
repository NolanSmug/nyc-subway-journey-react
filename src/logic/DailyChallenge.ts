import { Score } from './Score'
import { fetchShortestPath, getTransferIndices, StationData } from './RouteUtils'

export class DailyChallenge {
    private static getTodayKey(): string {
        return `user_daily_score_${new Date().toDateString()}`
    }

    public static isAlreadyCompleted(): boolean {
        return localStorage.getItem(`user_daily_score_${new Date().toDateString()}`) !== null
    }

    public static getCompletionScore(): Score | null {
        const data = localStorage.getItem(this.getTodayKey())
        return data ? Score.fromJSON(JSON.parse(data)) : null
    }

    public static saveScore(score: Score): void {
        localStorage.setItem(
            this.getTodayKey(),
            JSON.stringify({
                advanceCount: score.getAdvanceCount(),
                transferCount: score.getTransferCount(),
            })
        )
    }

    public static async getOptimalScore(startID: string, destID: string): Promise<Score | null> {
        const cacheKey = `daily_opt_${startID}_${destID}`
        const cached = localStorage.getItem(cacheKey)

        if (cached) {
            return Score.fromJSON(JSON.parse(cached))
        }

        try {
            const routeData: StationData[] = await fetchShortestPath(startID, destID)
            const score = new Score(routeData.length, Math.max(0, getTransferIndices(routeData).length - 1))

            localStorage.setItem(
                cacheKey,
                JSON.stringify({
                    advanceCount: score.getAdvanceCount(),
                    transferCount: score.getTransferCount(),
                })
            )
            return score
        } catch (e) {
            console.error('Failed to fetch optimal score', e)
            return null
        }
    }

    private saveDailyOptimalRouteData(route: StationData[]) {}
}
