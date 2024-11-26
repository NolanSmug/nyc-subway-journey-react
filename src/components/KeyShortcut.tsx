import './KeyShortcut.css'

export interface KeyShortcutProps {
    shortcutKey: string
    label: string
    isSpecial?: boolean
}

function KeyShortcut({ shortcutKey, label, isSpecial }: KeyShortcutProps) {
    return (
        <div className="shortcut">
            <span id="key-label">{label}</span>
            <kbd title={isSpecial ? shortcutKey : undefined}>{shortcutKey}</kbd>
        </div>
    )
}

export default KeyShortcut
