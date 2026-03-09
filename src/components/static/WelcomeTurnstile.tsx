import './WelcomeTurnstile.css'

const WelcomeTurnstile = () => {
    return (
        <div className='welcome-turnstile-container'>
            <div className='turnstile-top-right-triangle'></div>
            <div className='turnstile-column'>
                <div className='sensor-rectangle'></div>
                <div className='sensor-circle'></div>
                <div className='payment-light'></div>
            </div>
            <div className='turnstile-base'>
                <div className='turnstile-arms-container'>
                    <div className='arm arm-1'></div>
                    <div className='arm arm-2'></div>
                    <div className='arm arm-3'></div>
                </div>
            </div>
        </div>
    )
}

export default WelcomeTurnstile
