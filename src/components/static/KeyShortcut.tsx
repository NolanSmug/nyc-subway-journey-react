import './KeyShortcut.css'

interface KeyShortcutProps {
    shortcutKey: string
    label: string
    isCommand?: boolean
    disabled?: boolean
}

function KeyShortcut({ shortcutKey, label, isCommand, disabled }: KeyShortcutProps) {
    const handleShortcutClick = () => {
        if (shortcutKey === 'Esc') shortcutKey = 'Escape'
        if (shortcutKey === '→') shortcutKey = 'ArrowRight'

        const event = new KeyboardEvent('keydown', {
            key: shortcutKey,
            shiftKey: isCommand,
            bubbles: true,
        })

        document.dispatchEvent(event)
    }

    return (
        <div className={`shortcut ${disabled ? 'disabled' : ''}`} onMouseDown={handleShortcutClick}>
            <span id='key-label'>{label}</span>
            <p className={`shortcut-key ${isCommand ? 'command' : ''}`}>
                {isCommand && (
                    <>
                        <kbd>Shift</kbd>+
                    </>
                )}
                <kbd>{shortcutKey}</kbd>
            </p>
        </div>
    )
}

export default KeyShortcut
