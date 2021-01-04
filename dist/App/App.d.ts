import React from "react";
import "./App.css";
interface IAppProps {
    className?: string;
}
interface IAppState {
    sommeEmpruntee: number;
    variable: boolean;
    taux: number;
    remboursementAnnuel: number;
    remboursementTotal: number;
    year: number;
    years: IYear[];
}
interface IYear {
    solde: number;
    interet: number;
    remboursement: number;
    remboursementTotal: number;
}
export default class App extends React.Component<IAppProps, IAppState> {
    state: IAppState;
    componentDidMount(): void;
    private readonly compute;
    private readonly handleSelectYears;
    private upd;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=App.d.ts.map