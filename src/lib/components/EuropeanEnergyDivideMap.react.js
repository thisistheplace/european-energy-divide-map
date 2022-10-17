import React from 'react';
import PropTypes from 'prop-types';

import {EuroMap} from '../map/eurobase'
import {Cyclist} from '../three/cyclist'

function EuropeanEnergyDivideMap(props) {
    return (
        <div id={props.id} style={{"height":"100%", "width":"100%", "position": "relative"}}>
            <EuroMap {...props}/>
            <Cyclist {...props}/>
        </div>
    )
}

EuropeanEnergyDivideMap.defaultProps = {

};

EuropeanEnergyDivideMap.propTypes = {
    /**
     * The ID used to identify the container for the IFC viewer component.
     */
    id: PropTypes.string.isRequired
};

export default EuropeanEnergyDivideMap;