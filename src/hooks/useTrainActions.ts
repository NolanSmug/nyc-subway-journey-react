import { useCallback } from 'react'
import { GameState } from '../logic/GameState'
import { Train } from '../logic/TrainManager'

type UseTrainActionsParams = {
    train: Train
    gameState: GameState
    numAdvanceStations: number
    conductorMode: boolean
    setIsTransferMode: (b: boolean) => void
    updateTrainObject: (t: Partial<Train>) => void
    setGameState: (gs: GameState) => void
}

export default function useTrainActions({
    train,
    gameState,
    numAdvanceStations,
    conductorMode,
    setIsTransferMode,
    updateTrainObject,
    setGameState,
}: UseTrainActionsParams) {
    const checkForWin = useCallback(() => {
        const winState = gameState.checkWin(train.getCurrentStation())
        if (winState) {
            setGameState(gameState)
        }
    }, [gameState, train, setGameState])

    const advanceStation = useCallback(() => {
        if (!train) throw new Error('repOK failed on advanceaction')

        setIsTransferMode(false)
        if (numAdvanceStations > 1 && conductorMode) {
            updateTrainObject({ ...train.advanceStationInc(numAdvanceStations) })
        } else {
            updateTrainObject({ ...train.advanceStation() })
        }

        checkForWin()
    }, [train, numAdvanceStations, conductorMode, setIsTransferMode, updateTrainObject, checkForWin])

    const transfer = useCallback(
        async (transferIndex: number) => {
            if (transferIndex === undefined) {
                console.log('No transfer index found')
                return
            }

            const selectedLine = train.getCurrentStation().getTransfers()[transferIndex]

            if (await train.transferToLine(selectedLine, train.getCurrentStation())) {
                train.setLine(selectedLine)
                train.setCurrentStation(train.getCurrentStation())
                // if (conductorMode) train.setDirection(defaultDirectionToggle)
                train.updateTrainState()
            }
            updateTrainObject({ ...train })
            setIsTransferMode(false)
        },
        [train, setIsTransferMode, updateTrainObject]
    )

    const changeDirection = useCallback(() => {
        if (!train) throw new Error('repOK failed on change direction action')
        setIsTransferMode(false)
        updateTrainObject({ ...train.reverseDirection() })
    }, [train, setIsTransferMode, updateTrainObject])

    return {
        advanceStation,
        transfer,
        changeDirection,
    }
}
