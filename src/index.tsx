import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { UIProvider } from './contexts/UIContext'
import { GameProvider } from './contexts/GameContext'
import { SettingsProvider } from './contexts/SettingsContext'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  // The advantage of using contexts over global state is that you get to
  // choose the scope of components that are affected by them. This makes 
  // reasoning about the program easier and reduces the space for unexpected
  // behavior. At a high level, you have thought through what information 
  // really *should* be relevant to different locations, and that early decision
  // influences the rest of the program and keeps things decoupled.
  //
  // Here you basically just have global state except you have to also call
  // useWhateverTheFuck() and then say {
  //  thingIAlreadyNamedElsewhere,
  //  nowFindReferencesDoesntWorkRight,
  // } const everywhere in your program. {}}{{{{}}{}}
  //
  // Related, the advantage of having multiple providers is that you can separate program state
  // into groups that serve the structure of your program. I see here that you
  // do put the game state together, which is logical, but I don't understand the
  // value of the distinction between the SettingsProvider and the UISettings.
  //
  // Clearly this grouping isn't serving organization because your <App> starts
  // by using all of them:
  //
  // const { isTransferMode, setIsTransferMode, upcomingStationsVertical } = useUIContext()
  // const { conductorMode } = useSettingsContext()
  // const { train, gameState, initializeGame } = useGameContext()
  //
  // You should use providers and component nesting to separate concerns:
  //
  // <PreferencesProvider> -- Dark mode and other genuinely user specific preferences
  //                       -- which do not affect game logic, layout or anything
  //                       -- nontrivial about the program
  //                       --
  //
  //   <App> 
  //      -- Knows and is the only component that knows the current mode of the app
  //      -- (playing, about to play, game result)
  //
  //      {mode == "about to play" ?
  //      <div>
  //      The settings icon, pick the game mode, make it clear that the user needs
  //      to take an action to start.
  //      <GameView>
  //      </div>
  //      : mode == "playing" ?
  //      Remove anything that's not part of the game. Immersion
  //      <GameView>
  //      : mode == "game result",
  //      Display the score, obvious path to get back into 1 or two. Look at all the
  //      popular io games, they use this pattern and people will know how to use your
  //      game. Maybe Just have 1 and 2 actually, reduce friction on the loop
  //      }
  //
  //  - App should be worrying about what the user should be seeing and facilitating
  //    the modes of the app. This lifts this responsibility from the game component
  //  - The game component needs to just be the game. It accepts a callback to let
  //    the outer app know that the game is over
  //  
    <UIProvider>
        <GameProvider>
            <SettingsProvider>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </SettingsProvider>
        </GameProvider>
    </UIProvider>
)
