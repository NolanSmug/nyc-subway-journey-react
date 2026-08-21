import './ConductorModeControls.css'

import { memo } from 'react'

import ActionButton from '../common/ActionButton'
import AdvanceNStationsInput from '../navigation/AdvanceNStationsInput'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { Direction } from '../../logic/LineManager'

import R_ARROW_BLACK from '../../assets/images/right-arrow-b.svg'
import R_ARROW_WHITE from '../../assets/images/right-arrow-w.svg'
import TRANSFER_WHITE from '../../assets/images/transfer-icon-w.svg'
import TRANSFER_BLACK from '../../assets/images/transfer-icon-b.svg'
import C_DIRECTION_WHITE from '../../assets/images/change-direction-icon-w.svg'
import C_DIRECTION_BLACK from '../../assets/images/change-direction-icon-b.svg'

interface ConductorModeControlsProps {
    handleTransferClick: () => void
    handleAdvanceClick: () => void
    handleChangeDirectionClick: () => void
    numAdvanceStations: number
    direction: Direction
    isVerticalLayout: boolean
    isMobile?: boolean
}

function ConductorModeControls({
    handleTransferClick,
    handleAdvanceClick,
    handleChangeDirectionClick,
    numAdvanceStations,
    direction,
    isVerticalLayout,
    isMobile,
}: ConductorModeControlsProps) {
    const darkMode = useSettingsContext((state) => state.darkMode)

    const advanceArrowRotateDegrees: number = isVerticalLayout
        ? direction === Direction.DOWNTOWN
            ? 270
            : 90
        : direction === Direction.DOWNTOWN
          ? 180
          : 0

    return (
        <div className={`action-buttons-container conductor-mode-controls ${isMobile ? 'mobile' : ''}`}>
            <ActionButton imageSrc={darkMode ? TRANSFER_WHITE : TRANSFER_BLACK} label={'Transfer lines'} onClick={handleTransferClick} />
            <ActionButton
                imageSrc={darkMode ? C_DIRECTION_WHITE : C_DIRECTION_BLACK}
                label={'Change direction'}
                onClick={() => handleChangeDirectionClick()}
                pulse={direction === Direction.NULL_DIRECTION}
                wrapperClassName={`${direction === Direction.NULL_DIRECTION ? 'line-color-border' : ''}`}
            />
            <ActionButton
                imageSrc={darkMode ? R_ARROW_WHITE : R_ARROW_BLACK}
                rotateDegrees={advanceArrowRotateDegrees}
                label={`Advance station${numAdvanceStations > 1 ? 's' : ''}`}
                onClick={handleAdvanceClick}
                additionalInput={isMobile ? undefined : <AdvanceNStationsInput />}
                disabled={direction === Direction.NULL_DIRECTION}
            />
        </div>
    )
}

export default memo(ConductorModeControls)
