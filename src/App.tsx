import './App.css'
import React, { useEffect } from 'react'

import LandingScreen from './components/ui/LandingScreen'
import OptimalRouteUI from './components/ui/OptimalRouteUI'
import ConductorMode from './components/modes/ConductorMode'
import RiderMode from './components/modes/RiderMode'
import UmbrellaButton from './components/common/UmbrellaButton'
import SettingsMenu from './components/common/SettingsMenu'
import UpcomingStationsHorizontal from './components/common/UpcomingStationsHorizontal'
import UpcomingStationsVertical from './components/common/UpcomingStationsVertical'
import KeyShortcutMenu from './components/static/KeyShortcutMenuContent'
// import SubwayMap from './components/SubwayMap'

import { useUIContext } from './contexts/UIContext'
import { useTrainContext } from './contexts/TrainContext'
import { useGameStateContext } from './contexts/GameStateContext'
import { useSettingsContext, GameMode, UpcomingStationsLayout } from './contexts/SettingsContext'

import { useGame } from './hooks/useGame'
import { useUITheme } from './hooks/useCSSProperties'
import { useLineFavicon } from './hooks/useLineFavicon'

import GEAR_BLACK from './assets/images/settings-icon-b.svg'
import GEAR_WHITE from './assets/images/settings-icon-w.svg'
import KEYBOARD_BLACK from './assets/images/shortcut-icon-black.svg'
import KEYBOARD_WHITE from './assets/images/shortcut-icon-white.svg'
import SUBWAY_ICON_BLACK from './assets/images/subway-b.svg'
import SUBWAY_ICON_WHITE from './assets/images/subway-w.svg'
import DAILY_CHALLENGE_WHITE from './assets/images/daily-challenge-w.svg'
import DAILY_CHALLENGE_BLACK from './assets/images/daily-challenge-b.svg'
import DAILY_CHALLENGE_COMPLETE from './assets/images/daily-challenge-complete-g.svg'

import WelcomeScreenContent from './components/static/WelcomeScreenContent'
import ActionButton from './components/common/ActionButton'
import DailyChallengeScreenContent from './components/static/DailyChallengeScreenContent'

const settingsMenu: JSX.Element = <SettingsMenu />
const keyShortcutMenu: JSX.Element = <KeyShortcutMenu />
const settingsButtons: string[] = [GEAR_WHITE, GEAR_BLACK]
const keyShortcutButtons: string[] = [KEYBOARD_WHITE, KEYBOARD_BLACK]

// This function makes me happy because after reading it I have a pretty clear idea of what
// states the app can be in and what's going on. The details of simulating the game etc are 
// lower in the call stack.
function Game() {
    // This function is pretty straight forward. It looks like something hard is going on
    // because of all this functional react nonsense. Remember what you're doing:
    // Something changed in our state, you're updating the ui, and making any changes
    // to the state that the user wanted. All of these "use*" things are just paperwork.
    //
    // You have to change the state you have to change, and if you do it wrong you did it wrong.
    // Wrapping everything in nonsense doesn't make the situation better
    //
    const {
        // When I see "initializeGame", to know what that does I have to click into it and read the function code.
        // Names should avoid me having to read the code. Long names that prevent me from having to do that are ok.
        // A lot of the names in this codebase are unhelpful https://www.rfleury.com/p/emergence-and-composition
        //
        initializeGame
    } = useGame()
    const {
        isWon,
        isDailyChallengeCompleted,
    } = useGameStateContext().gameState
    const isLineNull = useTrainContext((state) => state.train.isLineNull())

    const {
        isTransferMode,
        isLandingPage,
        setIsLandingPage,
        setIsTransferMode,
    } = useUIContext(state => state);

    const {
        darkMode,
        gameMode,
        isDailyChallenge,
        setIsDailyChallenge,
        upcomingStationsVisible,
    } = useSettingsContext(state => state)

    const isHorizontalLayout = useSettingsContext((state) => state.upcomingStationsLayout === UpcomingStationsLayout.HORIZONTAL)
    // Thanks once again for making your code more accessible to our
    // employees of varying skill levels. -HR
    const isVerticalLayout: boolean = !isHorizontalLayout

    // This is an example of an unhelpful name. You chose to capture the fact that this function is called on
    // click away in it's name. The way a function is used does not capture anything about the function itself,
    // and so I have to read the function body. Names need to describe the thing they represent. When you couple
    // the name of a function to how it's used, you're making a function jungle, and making the reader hold more context
    // in their mind. When code bases get big, you have to make functions that can be understood in isolation from
    // their call site
    //
    // When I read this function name the first thing I did was check the call site to make sure it is actually just 
    // used for what the name suggests
    const handleClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.line-svgs-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            setIsTransferMode(false)
        }
    }

    const getChallengeIcon = () => {
        if (isDailyChallenge) return darkMode ? SUBWAY_ICON_WHITE : SUBWAY_ICON_BLACK
        if (isDailyChallengeCompleted) return DAILY_CHALLENGE_COMPLETE
        return darkMode ? DAILY_CHALLENGE_WHITE : DAILY_CHALLENGE_BLACK
    }

    const renderGameControls = () => (
        // The deviation from the reactive functional way of doing things here- you're managing the state of
        // the dom by hand to do this popup, means that the state of the settings menu being visible is not 
        // exposed to the rest of your state, which means that later in this function you don't know if the 
        // settings menu is visible or not
        <div className='top-page-umbrellas'>
            <UmbrellaButton openingButtonsW_B={settingsButtons} below visible>
                {settingsMenu}
            </UmbrellaButton>

            <ActionButton
                wrapperClassName={isDailyChallengeCompleted && !isDailyChallenge ? 'success-border' : ''}
                label={isDailyChallenge ? "Fine, I'm lost": 'Start daily challenge'}
                // hoverText={isDailyChallenge ? "Exit Challenge" : 'Start Daily Challenge'}
                imageSrc={getChallengeIcon()}
                onClick={() => {
                    setIsDailyChallenge((prev) => !prev)
                    setIsLandingPage(!isDailyChallenge)
                }}
            />
        </div>
    )

    useEffect(() => {
        initializeGame()
    }, [initializeGame, isDailyChallenge])

    useLineFavicon()
    useUITheme(darkMode)

    // TODO(eric): I throttled chrome to 3G and this message got displayed for 5 full seconds before the rest of the state arrived
    //
    // isLineNull doesn't indicate that there's a problem, just that you haven't finished loading state, which is a valid state
    // that you have to consider and handle
    if (isLineNull) return <>Sorry, something went wrong on our end and we can't display the page right now. Try again later?</>

    if (isWon) {
        return (
            <div className='Game'>
                <OptimalRouteUI isDailyChallenge={isDailyChallenge} setIsDailyChallenge={setIsDailyChallenge} />
                {renderGameControls()}
            </div>
        )
    }

    // On the landing page I'm not sure what I should do because there's too much other stuff.
    // I did a few things to make it easier
    //
    const gameCanvasInFocus = !isLandingPage; // || settings menu open, but you have stuff organized so that's hard to do

    // Make the landing screen bigger somehow. Right now it takes up less than 20% of the screen. It is the most important thing on the screen
    // It needs to give strong dominant alpha element energy for me to know what to do

    return (
        <>
            <div
                className={`dimmed-overlay ${isTransferMode ? 'active' : ''} ${isLandingPage ? 'landing' : ''}`}
                onMouseDown={handleClickAway}
            />

            {isLandingPage && !isDailyChallenge && (
                // If the narrative you're going for is test, make the action buttons test specific
                //
                // It's also not visually apparent that this is the button for the daily challenge and not a random challenge
                <LandingScreen closeLabel="Sounds easy to me">
                    <WelcomeScreenContent />
                </LandingScreen>
            )}
            {isDailyChallenge && (
                // closeLabel feels weird, why not let LandingScreen make this decision using the global state? Let this function
                // focus on the big state transitions? It's not like anything you compute in this function needs
                // to impact what gets put on the button
                <LandingScreen closeLabel={`${isDailyChallengeCompleted ? 'I can beat that' : 'Why is it a challenge?'}`}>
                    <DailyChallengeScreenContent />
                </LandingScreen>
            )}

            <div className={`Game ${gameMode}-mode ${!upcomingStationsVisible ? 'upcoming-stations-disabled' : ''}`} style={{
                // The game state is strictly a distraction when we're not looking at it
                'filter': gameCanvasInFocus ? '' : 'blur(0.5em)' 
            }}>
                {upcomingStationsVisible && isHorizontalLayout && <UpcomingStationsHorizontal />}

                <div className={`game-state-ui ${isVerticalLayout && upcomingStationsVisible ? 'is-vertical-layout' : ''}`}>
                    {gameMode === GameMode.CONDUCTOR && <ConductorMode />}
                    {gameMode === GameMode.RIDER && <RiderMode />}
                </div>
            </div>

            <div className='umbrella-menus'>
                {renderGameControls()}
                <div className='bottom-page-umbrellas'>
                    <UmbrellaButton openingButtonsW_B={keyShortcutButtons} visible>
                        {keyShortcutMenu}
                    </UmbrellaButton>
                    {/* <UmbrellaButton openingButtonsW_B={[GEAR_WHITE, GEAR_BLACK]} visible>
                        <SubwayMap />
                    </UmbrellaButton> */}
                </div>
            </div>

            {upcomingStationsVisible && isVerticalLayout && (
                <div className='upcoming-stations-vertical'>
                    <UpcomingStationsVertical />
                </div>
            )}
        </>
    )
}

//TODO(eric): Why does this function exist
function App() {
    return <Game />
}

export default App
