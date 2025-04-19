import React, { useEffect, useState } from 'react'
import GameStateUI from './components/GameStateUI'
import UmbrellaButton from './components/UmbrellaButton'
import SettingsMenu from './components/SettingsMenu'
import UpcomingStationsVertical from './components/UpcomingStationsVertical'
import UpcomingStationsHorizontal from './components/UpcomingStationsHorizontal'
import KeyShortcutMenu from './components/KeyShortcutMenu'

import './App.css'
import { useUIContext } from './contexts/UIContext'
import { useGameContext } from './contexts/GameContext'
import { useSettingsContext } from './contexts/SettingsContext'

import GEAR_BLACK from './images/settings-icon-b.svg'
import GEAR_WHITE from './images/settings-icon-w.svg'
import KEYBOARD_BLACK from './images/shortcut-icon-black.svg'
import KEYBOARD_WHITE from './images/shortcut-icon-white.svg'

// A high level issue is that it's not obvious how to use the website.
// You need to read a book about ux design communication. There are lots
// of subtle ways that software communicates to the user how it is supposed
// to be used and it's missing here.
//
// Go look at slither.io or agar.io or any successful io game. You get on the
// page and everything says "this is what you have to do to get started",
// then the ui changes to a different mode which is the game mode. Your app
// lacks distinct modes and so it's never clear to the user what's happening.
//
// The big "toggle direction" button does provide a clue that you want them
// to press the button, but it doesn't express *why* they would want to press
// the button. The result is that it kinda feels like an ad. I'm a very picky
// user and this makes me feel talked down to but it's like in a "the website
// designer isn't very smart" way
//

enum TopLevelMode {
    AboutToPlay,
    Playing,
}

function App() {
    const { isTransferMode, setIsTransferMode, upcomingStationsVertical } = useUIContext()
    const { conductorMode } = useSettingsContext()
    const { train, gameState, initializeGame } = useGameContext()

    const handleClickAway = (e: React.MouseEvent) => {
        const transferLinesContainer = document.querySelector('.transfer-lines-container')
        if (transferLinesContainer && !transferLinesContainer.contains(e.target as Node)) {
            setIsTransferMode(false)
        }
    }

    useEffect(() => {
        // Hmmm
        initializeGame()
    }, [initializeGame])

    // I would rather that you used encapsulation + OO to make invalid program
    // states impossible to represent. Also in general displaying an error message 
    // with no information like this is just the most annoying thing in the 
    // world to me as a user. If I wasn't technically competent, I might also start
    // doing things like clearing my cookies and restarting my computer.
    //
    // Be respectful of the user. Communicate with the intent that they will
    // understand you.
    //
    if (train.isLineNull() || gameState.isEmpty()) return <>
        Sorry, something went wrong on our end and we can't display the page right now.
        Try again later?
    </>

    return (
        <>
            <div className={`dimmed-overlay ${isTransferMode ? 'active' : ''}`} onClick={handleClickAway} />
            <div className="Game">
                {!upcomingStationsVertical && <UpcomingStationsHorizontal />}

                <div className={`game-state-ui ${upcomingStationsVertical ? ' shifted-up' : ''}`}>
                    <GameStateUI />
                </div>
            </div>

            <div className="umbrella-menus">
                {/* You have so few settings, I'd rather you lifted them out and just put a bar
                    of toggles on one edge of the screen.

                    If you do keep the button, could you make it just show the menu when I hover?
                    My reaction to the button is that it's a lot of cognitive effort.

                    1. I have to click it to open it and to close it (two clicks!). Also it doesn't
                       always close when I click outside of it. Jank like this
                       is a big deal, user gets frustrated fast.

                    2. The button is in the top left corner and it gets right in the
                       way when I first scan the page. The layout of the page should
                       make it very easy for my monkey brain to group elements/infer
                       semantic layout. UI design is a conversation between the user and 
                       the program and the language is colors, locations, spacing etc.

                       My monkey brain hates this button. The settings button is as
                       big as the title text, and it's in the top file where all the
                       essential stuff usually is. It competes with the most important elements
                       in the page for my attention, and I keep trying to group it in somehow
                       (even while I'm writing this!) and I can't and I'm frustrated by it.

                       The position is too far from the edge of the screen and too
                       close in size to the other elements for me to put it in it's 
                       own group. The coloring really doesn't help, because it shares
                       the same style as the primary elements in the page, again
                       communicating that it is central even though it's not.

                       Settings is not the center stage and should be off in a corner somewhere
                       low down. The user has a few out of the way places that they will look
                       for it when they need it. 

                    3. This is an unpopular opinion, but I share it with John Carmak so I'm 
                       pretty confident about it. The button should perform it's action
                       onMouseDown, not when the mouse is lifted. This is a design
                       error that basically everyone makes and it makes my computer 
                       that much more annoying to use. 

                       People do on mouse up because on mobile you have to scroll
                       by touching things. In those contexts you have no other choice.
                       But in absolutely any context that you do have a choice,
                       you should choose to do the action the moment that the user
                       expresses their intent to do it. This makes the ui feel 
                       fast and responsive and users notice it, although they usually
                       can't say what it is. This goes for most of the buttons on your 
                       page.
                */}
                <div className="settings-umbrella">
                    <UmbrellaButton
                        openingButtonsW_B={[GEAR_WHITE, GEAR_BLACK]}
                        umbrellaContent={<SettingsMenu />}
                        below
                        visible
                    />
                </div>
                <div className="shortcuts-umbrella">
                    <UmbrellaButton
                        openingButtonsW_B={[KEYBOARD_WHITE, KEYBOARD_BLACK]}
                        umbrellaContent={<KeyShortcutMenu />}
                        visible={conductorMode}
                    />
                </div>
            </div>

            {upcomingStationsVertical && (
                <div className="upcoming-stations-vertical">
                    {/**
                    As you saw on my screen in class, this doesn't work well on different browser scale
                    settings. You need to actually use layout logic here, know how big your elements
                    are and make intelligent decisions about what layouts to allow/how to size things.
                    **/}
                    <UpcomingStationsVertical />
                </div>
            )}
        </>
    )
}

export default App
