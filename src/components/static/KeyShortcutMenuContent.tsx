import React from 'react'
import KeyShortcut from './KeyShortcut'

import './KeyShortcutMenuContent.css'

const KeyShortcutMenu = () => {
    return (
        <>
            <KeyShortcut shortcutKey='→' label='Advance station' />
            <KeyShortcut shortcutKey='t' label='Transfer lines' />
            <KeyShortcut shortcutKey='c' label='Change direction' />
            <KeyShortcut shortcutKey='u' label='Change direction UPTOWN' />
            <KeyShortcut shortcutKey='d' label='Change direction DOWNTOWN' />
            <KeyShortcut shortcutKey='r' label='Refresh' />
            <KeyShortcut shortcutKey='D' label='Light/dark mode' isCommand />
            <KeyShortcut shortcutKey='U' label='Stations hide/show' isCommand />
            <KeyShortcut shortcutKey='L' label='Toggle layout' isCommand conductorModeOnly />
            <KeyShortcut shortcutKey='C' label='Conductor/rider mode' isCommand />
            <KeyShortcut shortcutKey='+' label='Increase advance count' conductorModeOnly />
            <KeyShortcut shortcutKey='-' label='Decrease Advance Count' conductorModeOnly />
            <KeyShortcut shortcutKey='Esc' label='Exit transfer' />
        </>
    )
}

export default KeyShortcutMenu
