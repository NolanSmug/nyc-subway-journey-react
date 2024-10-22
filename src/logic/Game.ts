import { GameState } from './GameState';
import { LineName } from './Line';
import { Train, Direction } from './TrainManager';

export class Game {
  public gameState: GameState;
  public train: Train;

  constructor() {
    this.gameState = new GameState();
    this.train = new Train();
  }

  public async runGame(): Promise<void> {
    await this.gameState.resetGameState();

    // Initialize the train
    this.train.setLine(this.gameState.startingLine);
    this.train.setScheduledStops(this.gameState.currentStations);
    this.train.setCurrentStation(this.gameState.startingStation);
    this.train.setLineType();
    this.train.updateTrainState();
  }


  
  public transferLines(newLine: LineName): void {
    if (this.train.transferToLine(newLine, this.gameState.currentStation)) {
      this.gameState.currentStation = this.train.getCurrentStation();
    }
  }

  public changeDirection(): void {
    this.train.reverseDirection();
    this.gameState.currentStation = this.train.getCurrentStation();
  }

  public advanceStation(): void {
    if (this.train.advanceStation()) {
      this.gameState.currentStation = this.train.getCurrentStation();
    }
  }
}