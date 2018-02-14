import React, { Component } from 'react';
import './Map.css';

export class Map extends Component {
    render() {
        return (
            <div id="map">
                <Filters />
                <div id="mapVis"></div>
            </div>
        )
    }
}

class Filters extends Component {
    render() {
        return (
            <div id="filters"></div>
        )
    }
}

class Filter extends Component {
    render() {
        return (
            <div className="filter"></div>
        )
    }
}

