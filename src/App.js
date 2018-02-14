import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import $ from 'jquery';
import { Map } from './Map';

export class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to NTIA Broadband Data Dashboard</h1>
        </header>
        <div id="dashboard">
          <Map />
          <div id="metrics">
              <div id="tabs"></div>
              <div id="metric"></div>
          </div>
        </div>
      </div>
    );
  }
}

$.get("https://opendata.fcc.gov/resource/if4k-kzsc.json?$select=providername&$where=stateabbr='TN'&$limit=10000000",function(data){
    console.log(data)
})