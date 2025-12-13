import './LandingScreen.css'

import { useUIContext } from '../../contexts/UIContext'
import ActionButton from '../common/ActionButton'

interface LandingScreenProps {
    closeLabel?: string
    children: React.ReactNode
}

function LandingScreen({ closeLabel, children }: LandingScreenProps) {
    const isLandingPage = useUIContext((state) => state.isLandingPage)
    const setIsLandingPage = useUIContext((state) => state.setIsLandingPage)

    if (!isLandingPage) {
        return null
    }

    return (
        <div className='landing-screen-container'>
            <div className='landing-screen-content'>
                {children}

                <ActionButton label={closeLabel && closeLabel} onClick={() => setIsLandingPage(false)}></ActionButton>
            </div>
        </div>
    )
}

export default LandingScreen
