import './KeyShortcut.css'

export interface KeyShortcutProps {
    shortcutKey: string
    label: string
    isCommand?: boolean
}

function KeyShortcut({ shortcutKey, label, isCommand }: KeyShortcutProps) {
    return (
        <div className='shortcut'>
            <span id='key-label'>{label}</span>
            <p>
                {isCommand && (
                    <>
                        <kbd>Shift</kbd> +{' '}
                    </>
                )}
                <kbd>{shortcutKey}</kbd>
            </p>
        </div>
    )
}
export default KeyShortcut
