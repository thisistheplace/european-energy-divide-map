/* eslint no-magic-numbers: 0 */
import React, {Component} from 'react';

import { EuropeanEnergyDivideMap } from '../lib';

class App extends Component {

    constructor() {
        super();
        this.state = {
            id: 'test',
            mapCenter: {x: 482, y: 411}
        };
        this.setProps = this.setProps.bind(this);
    }

    setProps(newProps) {
        this.setState(newProps);
    }

    render() {
        return (
            <div>
                <EuropeanEnergyDivideMap
                    setProps={this.setProps}
                    {...this.state}
                />
            </div>
        )
    }
}

export default App;
