import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import App from './App'
import { SettingsProvider } from './contexts/SettingsContext'
import { UIProvider } from './contexts/UIContext'
import { TrainProvider } from './contexts/TrainContext'
import { JourneyProvider } from './contexts/JourneyContext'
import { SeedRNG } from './logic/SeedRNG'

jest.mock('use-context-selector', () => {
    const React = require('react')
    return {
        createContext: React.createContext,
        useContextSelector: (context: React.Context<any>, selector: (value: any) => any) => selector(React.useContext(context)),
    }
})

jest.mock('./components/gameplay/RiderMode', () => {
    const React = require('react')

    return React.forwardRef((_props: unknown, ref: any) => {
        React.useImperativeHandle(ref, () => ({
            gameLandingTurnstileSwipe: () => Promise.resolve(),
        }))

        return <div>Rider mode</div>
    })
})

const mockSubwayData = {
    S_Train: [
        {
            id: '127',
            name: 'Times Sq-42 St',
            transfers: [
                'One_Train',
                'Two_Train',
                'Three_Train',
                'Seven_Train',
                'A_Train',
                'C_Train',
                'E_Train',
                'N_Train',
                'Q_Train',
                'R_Train',
                'W_Train',
                'S_Train',
            ],
            borough: 'Manhattan',
        },
        {
            id: 'GRC',
            name: 'Grand Central-42 St',
            transfers: ['Four_Train', 'Five_Train', 'Six_Train', 'Seven_Train', 'S_Train'],
            borough: 'Manhattan',
        },
    ],
}

const mockRng = () => {
    const values = [0.9, 0, 0.9]
    let i = 0

    return () => values[i++ % 3]
}

const renderApp = () => {
    render(
        <UIProvider>
            <SettingsProvider>
                <JourneyProvider>
                    <TrainProvider>
                        <App />
                    </TrainProvider>
                </JourneyProvider>
            </SettingsProvider>
        </UIProvider>
    )
}

describe('<App>', () => {
    beforeEach(() => {
        jest.spyOn(Math, 'random').mockImplementation(mockRng())
        jest.spyOn(SeedRNG.prototype, 'next').mockImplementation(mockRng())

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockSubwayData,
        } as Response)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test('renders landing screen after initialization', async () => {
        renderApp()

        expect(await screen.findByRole('button', { name: 'Start journey' })).toBeInTheDocument()
        expect(screen.getAllByText('Times Sq-42 St').length).toBeGreaterThan(0)
    })

    test('starts journey', async () => {
        renderApp()

        fireEvent.click(await screen.findByRole('button', { name: 'Start journey' }))

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: 'Start journey' })).not.toBeInTheDocument()
        })
    })

    test('opens and starts daily challenge', async () => {
        renderApp()

        fireEvent.pointerDown(await screen.findByRole('button', { name: 'Daily challenge' }))

        expect(screen.getByRole('button', { name: 'Exit challenge' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Start journey' })).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Start journey' }))

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: 'Start journey' })).not.toBeInTheDocument()
        })
    })

    test('exits daily challenge', async () => {
        renderApp()

        fireEvent.pointerDown(await screen.findByRole('button', { name: 'Daily challenge' }))
        fireEvent.click(await screen.findByRole('button', { name: 'Start journey' }))

        fireEvent.pointerDown(await screen.findByRole('button', { name: 'Exit challenge' }))

        expect(await screen.findByRole('button', { name: 'Daily challenge' })).toBeInTheDocument()
    })
})
