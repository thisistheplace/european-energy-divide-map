import React from 'react';
import PropTypes from 'prop-types';

import {Map} from '../map/map'
import {EuroMap} from '../map/eurobase'

function EuropeanEnergyDivideMap(props) {
    return (
        <div id={props.id} style={{"height":"100%", "width":"100%"}}>
            <EuroMap {...props}/>
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