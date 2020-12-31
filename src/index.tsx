import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Font from 'tfw/font'
import Theme from 'tfw/theme'

import './index.css'


async function start() {
    // Set application theme.
    await Font.loadJosefin(true)
    Theme.apply({
        color3: "#456",
        color0: "#123",
        colorPD: "#0040dd",
        colorPL: "#56abff",
        colorS: "#ff8d1e",
        colorE: "#f44"
    })

    // Create main component.
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('ROOT')
    )

    // Remove splash screen.
    removeSplashScreen()
}


function removeSplashScreen() {
    const splash = document.getElementById('SPLASH')
    if (splash) {
        splash.classList.add("hide")
        const VANISHING_TIME = 1000
        window.setTimeout(
            () => {
                const parent = splash.parentNode
                if (parent) parent.removeChild(splash)
            },
            VANISHING_TIME
        )
    }
}


start()