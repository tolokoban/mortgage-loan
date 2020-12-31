import React from "react"
import Button from 'tfw/view/button'

import "./App.css"

interface IAppProps {
    className?: string
}
interface IAppState {}

export default class App extends React.Component<IAppProps, IAppState> {
    state = {}

    render() {
        const classes = ['App']
        if (this.props.className) classes.push(this.props.className)

        return (<div className={classes.join(' ')}>
            <p>You are ready to play!</p>
            <Button icon="play" />
        </div>)
    }
}
