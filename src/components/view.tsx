import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from "./app";
import {singleton} from 'dependency-injection.ts';

@singleton
export class View {

    public render(){
        ReactDOM.render(
            <App />,
            document.getElementById('app')
        );
    }
}