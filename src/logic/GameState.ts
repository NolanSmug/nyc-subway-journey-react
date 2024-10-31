import { Line, LineName } from './Line'
import { Station } from './StationManager'
import { SubwayMap } from './SubwayMap'


export class GameState {
    startingLine: LineName
    startingStation: Station 
    destinationStation: Station 
    currentStations: Station[]
    isFirstTurn: boolean
    isWon: boolean

    constructor(
        startingLine: LineName = LineName.NULL_TRAIN,
        startingStation: Station = Station.NULL_STATION,
        destinationStation: Station = Station.NULL_STATION,
        currentStations: Station[] = [],
        isFirstTurn: boolean = true,
        isWon: boolean = false
    ) {
        this.startingLine = startingLine;
        this.startingStation = startingStation;
        this.destinationStation = destinationStation;
        this.currentStations = currentStations;
        this.isFirstTurn = isFirstTurn;
        this.isWon = isWon;
    }

    public async checkWin(currentStation: Station): Promise<boolean> {
        if (currentStation.equals(this.destinationStation)) {
            const currentStationElement = document.getElementById('current-station');
            const destinationStationElement = document.getElementById('destination-station');
            const trainCarElement = document.getElementById('train');

            this.isWon = true

            if (currentStationElement && destinationStationElement?.parentElement) {
                currentStationElement.classList.add('win-state');
                destinationStationElement.parentElement.classList.add('win-state');
                trainCarElement?.classList.add('win-state')

                setTimeout(() => {
                    currentStationElement.classList.remove('win-state');
                    destinationStationElement.parentElement?.classList.remove('win-state');
                    trainCarElement?.classList.remove('win-state')
                }, 5000);

                return true;
            }
        }
        return false;
    }

    public async resetGameState(): Promise<void> {
        this.startingLine = Line.getRandomLine()
        this.isFirstTurn = true
        this.isWon = false

        await SubwayMap.createStations(this.startingLine, this.currentStations)

        this.startingStation = Station.getRandomStation(this.currentStations)
        do {
            this.destinationStation = Station.getRandomStation(Station.allNycStations)

        } while (this.startingStation === this.destinationStation)
    }

}
