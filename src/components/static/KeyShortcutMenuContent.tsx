import React from 'react'
import KeyShortcut from './KeyShortcut'

import './KeyShortcutMenuContent.css'
import { GameMode, useSettingsContext } from '../../contexts/SettingsContext'

const KeyShortcutMenu = () => {
    const isRiderMode = useSettingsContext((state) => state.gameMode === GameMode.RIDER)
    const isDailyChallenge = useSettingsContext((state) => state.isDailyChallenge)

    return (
        <>
            <KeyShortcut shortcutKey='→' label='Advance station' />
            <KeyShortcut shortcutKey='t' label='Transfer lines' />
            <KeyShortcut shortcutKey='c' label='Change direction' />
            <KeyShortcut shortcutKey='u' label='Change direction UPTOWN' />
            <KeyShortcut shortcutKey='d' label='Change direction DOWNTOWN' />
            <KeyShortcut shortcutKey='r' label='Refresh' />
            <KeyShortcut shortcutKey='D' label='Light/dark mode' isCommand />
            <KeyShortcut shortcutKey='U' label='Stations hide/show' isCommand disabled={isDailyChallenge} />
            <KeyShortcut shortcutKey='L' label='Toggle layout' isCommand disabled={isRiderMode || isDailyChallenge} />
            <KeyShortcut shortcutKey='C' label='Conductor/rider mode' isCommand />
            <KeyShortcut shortcutKey='+' label='Increase advance count' disabled={isRiderMode} />
            <KeyShortcut shortcutKey='-' label='Decrease Advance Count' disabled={isRiderMode} />
            <KeyShortcut shortcutKey='Esc' label='Exit transfer' />
        </>
    )
}

export default KeyShortcutMenu
