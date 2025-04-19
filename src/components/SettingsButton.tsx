import ActionButton from './ActionButton'
import './SettingsButton.css'

export interface SettingsButtonProps {
    label: string
    imgSrc: string
    onClick: () => void
}

/// Dude I know you like building the buttons all pretty by hand, but like
// this file is 100% boiler plate. The standard ass MIT material 3 icon button would
// take less lines and look and work better. Component design is a science and Google's 
// ui designers have spent years make it work. There's also a lot of wisdom to be 
// gained from just reading the material 3 specifications to understand how colors work.
//
// Like here are some subtle things that you're doing wrong that material would
// have just done for you:
//
// 1. In rtl locales the icon should appear before the text but it needs to
//    switch for ltr locals. 
//
// 2. The icon comes before the text btw because the 
//    whole point of having an icon is because the monkey visual system can grab
//    the picture and know the meaning before we read the text. When the icon 
//    is after, we don't get the optimization and it's pointless.
//
// 3. The spacing visually separates the icons from the buttons
//
// 4. The icons are a different font size than the text
//
// And I'm sure I'm missing a lot of stuff too because I'm not a ui guy.
//
function SettingsButton({ imgSrc, label, onClick }: SettingsButtonProps) {
    return (
        <div className="settings-row">
            <span id="setting-label">{label}</span>
            <ActionButton imageSrc={imgSrc} onClick={onClick} small></ActionButton>
        </div>
    )
}

export default SettingsButton
