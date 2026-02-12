import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { UIProvider } from './contexts/UIContext'
import { GameStateProvider } from './contexts/GameStateContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { TrainProvider } from './contexts/TrainContext'

import useBrowserCSS from './hooks/useBrowserCSS'

const root = ReactDOM.createRoot(document.getElementById('root')!)

document.body.classList.add(useBrowserCSS())


// TODO(eric): The entire app depends on settings, game state and ui, so these things are just
// global state. Packaging them into these React constructs feels silly, but I'm not sure what
// the landscape of making react do things is. A downside of this is that your startup code
// for the client is scattered all over the place and I can't just read it. There is stuff you have
// to do at startup, there's no point in putting it in these objects, just have a main function.
//
// At least with the main function, I now know what all the state is that gets used, what
// happened etc. A consequence of you not having a startup function is that you have lazy initialization
// in random places.
//
function main() {
    (async () => {
        // globalFoo = fetchTheThings()

        // Then in the ui, you can react to this ready variable
        // globalInitialStuffIsDoneReadyToBeInteractive = true
    })()

    // Having your global state be in these provider objects just makes everything harder to think
    // about. Because now it's not *just* global state, which has properties I understand, it's also
    // a react thing that has a place in the tree for some reason. I don't think you're getting any
    // benefit from having it in the tree? And I'm going speculate that even if you have a legit use case
    // for contexts, it's probably best not to use it even then and just have regular structs
    //
    // The other thing that scares me about this react stuff is can you put it in local storage? Do
    // you want refreshing the page to drop all this state?

    root.render(
        <UIProvider>
            <SettingsProvider>
                <GameStateProvider>
                    <TrainProvider>
                        <App />
                    </TrainProvider>
                </GameStateProvider>
            </SettingsProvider>
        </UIProvider>
    )
}
main()
