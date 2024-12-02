import React from 'react'
import KeyShortcut from './KeyShortcut'

import './KeyShortcutMenu.css'

interface KeyShortcutMenuProps {}

const KeyShortcutMenu: React.FC<KeyShortcutMenuProps> = () => {
    return (
        <>
            <KeyShortcut shortcutKey="→" label="Advance Station" />
            <KeyShortcut shortcutKey="t" label="Transfer Lines" />
            <KeyShortcut shortcutKey="c" label="Change Direction" />
            <KeyShortcut shortcutKey="r" label="Refresh" />
            <KeyShortcut shortcutKey="Esc" label="Exit Transfer" />
            <KeyShortcut shortcutKey="l" label="Toggle Layout" isCommand />
            <KeyShortcut shortcutKey="d" label="Light/Dark Mode" isCommand />
            <KeyShortcut shortcutKey="u" label="Stations Hide/Show" isCommand />
            <KeyShortcut shortcutKey="c" label="Conductor/Rider Mode" isCommand />
            <KeyShortcut shortcutKey="+" label="Increase Advance Count" />
            <KeyShortcut shortcutKey="-" label="Decrease Advance Count" />
        </>
    )
}

export default KeyShortcutMenu
