import React from "react"
import InputFloat from 'tfw/view/input-float'
import InputInteger from 'tfw/view/input-integer'
import Checkbox from 'tfw/view/checkbox'
import Storage from 'tfw/storage'
import Debouncer from "tfw/async/debouncer"

import "./App.css"
import Button from "tfw/view/button"

const LocalStorage = new Storage.PrefixedLocalStorage("mortgage-loan")

interface IAppProps {
    className?: string
}
interface IAppState {
    sommeEmpruntee: number
    variable: boolean
    taux: number
    remboursementAnnuel: number
    remboursementTotal: number
    year: number
    years: IYear[]
}

interface IYear {
    solde: number
    interet: number
    remboursement: number
    remboursementTotal: number
}

export default class App extends React.Component<IAppProps, IAppState> {
    state: IAppState = {
        sommeEmpruntee: 100000,
        variable: false,
        taux: 10,
        remboursementAnnuel: 12000,
        remboursementTotal: 0,
        year: 15,
        years: [],
        ...LocalStorage.get("state", {})
    }

    componentDidMount() {
        this.compute()
    }

    private readonly compute = Debouncer(
        () => {
            const { sommeEmpruntee, taux, remboursementAnnuel, variable } = this.state
            const years: IYear[] = []
            let solde = -sommeEmpruntee
            let loops = 0
            let total = 0
            while (solde < 0 && loops < 100) {
                const interet = solde * taux * 0.01
                const remb = Math.min(
                    remboursementAnnuel - (variable ? interet : 0),
                    -solde - interet
                )
                total += remb
                const year: IYear = {
                    solde,
                    interet,
                    remboursement: remb,
                    remboursementTotal: total
                }
                years.push(year)
                solde += interet + remb
                loops++
            }
            this.setState({ years, remboursementTotal: total })
        },
        500
    )

    private readonly handleSelectYears = async () => {
        const { sommeEmpruntee, taux, remboursementAnnuel, variable } = this.state
        if (variable) {
            this.upd({
                remboursementAnnuel: trunc(sommeEmpruntee / this.state.year)
            })
        } else {
            const n = this.state.year
            const T = 1 + taux * 0.01
            const Tn = Math.pow(T, n)
            const C = sommeEmpruntee
            this.upd({
                remboursementAnnuel: trunc(
                    ((T - 1) * Tn * C) / (Tn - 1)
                )
            })
        }
    }

    private upd(partialState: Partial<IAppState>) {
        console.log("[App] partialState = ", partialState) // @FIXME: Remove this line written on 2020-12-31 at 18:04
        const state: IAppState = {
            ...this.state,
            ...partialState
        }
        LocalStorage.set("state", state)
        this.setState(state, this.compute)
    }

    render() {
        const {
            sommeEmpruntee, taux, variable, year,
            remboursementAnnuel, remboursementTotal, years
        } = this.state
        const classes = ['App']
        const currentYear = (new Date()).getFullYear()
        const fmt = new Intl.NumberFormat("fr-FR", { style: 'currency', currency: 'EUR' })

        return <div className={classes.join(' ')}>
            <div className="flex">
                <header>
                    <InputFloat
                        wide={true}
                        label="Somme empruntée"
                        value={sommeEmpruntee}
                        onChange={v => this.upd({ sommeEmpruntee: v })}
                    />
                    <InputFloat
                        label="Taux annuel (en %)"
                        value={taux}
                        onChange={v => this.upd({ taux: v })}
                    />
                    <InputFloat
                        label="Remboursement annuel"
                        value={remboursementAnnuel}
                        onChange={v => this.upd({ remboursementAnnuel: v })}
                    />
                    <Checkbox
                        label="Variable"
                        value={variable}
                        onChange={v => this.upd({ variable: v })}
                    />
                    <fieldset>
                        <legend>Définir le nombre d'années</legend>
                        <InputInteger
                            label="Nombre d'années"
                            value={year}
                            onChange={v => this.upd({ year: v })}
                        />
                        <Button
                            label="Calcul du remboursement"
                            wide={true}
                            onClick={this.handleSelectYears}
                        />
                    </fieldset>
                </header>
                <table className="thm-ele-header thm-bg-2">
                    <thead>
                        <tr className="thm-bgPD">
                            <th>Année</th>
                            <th>Solde</th>
                            <th>Intérêt</th>
                            <th>Remboursement</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            years.map((year, idx) => <tr key={`${year.solde}-${idx}`}>
                                <td>{idx + currentYear}</td>
                                <td>{fmt.format(year.solde)}</td>
                                <td>{fmt.format(year.interet)}</td>
                                <td>{fmt.format(year.remboursement)}</td>
                                <td>{fmt.format(year.remboursementTotal)}</td>
                            </tr>)
                        }
                    </tbody>
                </table>
                <table className="thm-ele-header thm-bg-2">
                    <tbody>
                        <tr>
                            <th>Somme empruntée</th>
                            <td>{fmt.format(sommeEmpruntee)}</td>
                        </tr>
                        <tr>
                            <th>Somme remboursée</th>
                            <td>{fmt.format(remboursementTotal)}</td>
                        </tr>
                        <tr>
                            <th>Taux final</th>
                            <td>{(100 * (remboursementTotal - sommeEmpruntee) / sommeEmpruntee).toFixed(1)} %</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    }
}


function trunc(value: number): number {
    return Math.ceil(value * 100) * 0.01
}