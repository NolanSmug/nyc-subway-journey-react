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
            <KeyShortcut shortcutKey="l" label="Layout" isCommand />
        </>
    )
}

export default KeyShortcutMenu
