import { GameMode, useSettingsContext } from '../../contexts/SettingsContext'
import './KeyShortcut.css'

interface KeyShortcutProps {
    shortcutKey: string
    label: string
    isCommand?: boolean
    conductorModeOnly?: boolean
}

function KeyShortcut({ shortcutKey, label, isCommand, conductorModeOnly }: KeyShortcutProps) {
    const disabled = useSettingsContext((state) => state.gameMode === GameMode.RIDER && conductorModeOnly)

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
        <div
            className='shortcut'
            onMouseDown={handleShortcutClick}
            style={disabled ? { textDecoration: 'line-through', opacity: 0.5 } : {}}
        >
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
