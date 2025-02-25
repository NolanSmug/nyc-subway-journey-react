import React from 'react'
import KeyShortcut from './KeyShortcut'

import './KeyShortcutMenu.css'

const KeyShortcutMenu = () => {
    return (
        <>
            <KeyShortcut shortcutKey="→" label="Advance station" />
            <KeyShortcut shortcutKey="t" label="Transfer lines" />
            <KeyShortcut shortcutKey="c" label="Change direction" />
            <KeyShortcut shortcutKey="r" label="Refresh" />
            <KeyShortcut shortcutKey="Esc" label="Exit transfer" />
            <KeyShortcut shortcutKey="l" label="Toggle layout" isCommand />
            <KeyShortcut shortcutKey="d" label="Light/dark mode" isCommand />
            <KeyShortcut shortcutKey="u" label="Stations hide/show" isCommand />
            <KeyShortcut shortcutKey="c" label="Conductor/rider mode" isCommand />
            <KeyShortcut shortcutKey="+" label="Increase advance count" />
            <KeyShortcut shortcutKey="-" label="Decrease Advance Count" />
        </>
    )
}

export default KeyShortcutMenu
