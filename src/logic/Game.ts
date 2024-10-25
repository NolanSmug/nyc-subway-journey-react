import { GameState } from './GameState'
import { LineName } from './Line'
import { Station } from './StationManager'
import { Train, Direction } from './TrainManager'

export class Game {
    public gameState: GameState
    public train: Train

    constructor() {
        this.gameState = new GameState()
        this.train = new Train()
    }

    public async runGame(): Promise<void> {
        await this.gameState.resetGameState()

        // Initialize the train
        this.train.setLine(this.gameState.startingLine)
        this.train.setDirection(this.train.getRandomDirection())
        this.train.setScheduledStops(this.gameState.currentStations)
        this.train.setCurrentStation(this.gameState.startingStation)
        this.train.setLineType()
        this.train.updateTrainState()
    }

    public async transferLines(newLine: LineName): Promise<void> {
        if (await this.train.transferToLine(newLine, this.gameState.currentStation)) {
            this.train.setLineType()
            this.gameState.currentLine = this.train.getLineName()
            this.gameState.currentStation = this.train.getCurrentStation()
            this.gameState.currentDirection = this.train.getDirection()
            await this.train.updateTrainState() // If this is async
        }
    }

    public async changeDirection(): Promise<void> {
        if (this.train.getDirection() !== Direction.NULL_DIRECTION) {
            this.train.reverseDirection()
            this.gameState.currentStation = this.train.getCurrentStation()
        }
    }

    public async advanceStation(): Promise<void> {
        if (this.train.advanceStation()) {
            this.gameState.currentStation = this.train.getCurrentStation();
        }
    }

    public async checkWin(): Promise<boolean> {
        if (this.gameState.currentStation.equals(this.gameState.destinationStation)) {
            console.log("WIN!")
            const currentStationElement = document.getElementById('current-station');
            const destinationStationElement = document.getElementById('destination-station');
            const trainCarElement = document.getElementById('train');

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
