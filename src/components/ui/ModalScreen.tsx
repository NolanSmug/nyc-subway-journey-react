import './ModalScreen.css'
import { ReactNode } from 'react'

import ActionButton from '../common/ActionButton'

interface ModalScreenProps {
    closeLabel: string
    closeAction: () => void | Promise<void>
    children: ReactNode
}

function ModalScreen({ closeLabel, closeAction, children }: ModalScreenProps) {
    return (
        <div className='landing-screen-container'>
            <div className='landing-screen-content'>
                {children}
                <ActionButton label={closeLabel} onClick={closeAction} />
            </div>
        </div>
    )
}

export default ModalScreen
