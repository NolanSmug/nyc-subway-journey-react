import React from 'react';
import './ActionButton.css';

export interface ActionButtonProps {
    imageSrc: string;
    label?: string;
    onClick?: () => void;
    className?: string;  // Add className prop
}

function ActionButton({ imageSrc, label, onClick, className }: ActionButtonProps) {
    return (
        <button className={`action-button-container ${className}`} onClick={onClick} type="button">
            <img src={imageSrc} className="button" alt={label} />
            <p>{label}</p>
        </button>
    );
}

export default ActionButton;