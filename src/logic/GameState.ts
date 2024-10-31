import { LineName } from './Line'
import { Station } from './StationManager'


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

}
