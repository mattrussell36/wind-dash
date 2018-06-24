import React, { Component } from 'react';
import './App.css';
import getCompassDirection from './utils/getCompassDirection';
import average from './utils/average';
import randomNumberBetween from './utils/randomNumberBetween';

const MIN_HUE = 0; // RED
const MAX_HUE = 190; // LIGHT BLUE 

const MIN_SCALE = 1; 
const MAX_SCALE = 2.7;

const MIN_SPEED = 0;
const MAX_SPEED = 50;

class App extends Component {
  constructor() {
    super();
    this.state = {
      windSpeed: 20,
      windSpeedAverages: [20],
      windDirection: 180,
      windDirectionAverages: [180],
      roseScale: 2.7,
    };
  }

  getScale(value) {
    const percent = (value - MIN_SPEED) / (MAX_SPEED - MIN_SPEED);
    return percent * (MAX_SCALE - MIN_SCALE) + MIN_SCALE;
  }

  getHue(value) {
    const percent = (value - MIN_SPEED) / (MAX_SPEED - MIN_SPEED);
    return percent * (MIN_HUE - MAX_HUE) + MAX_HUE;
  }

  setTransform(speed, direction) {
    const scale = this.getScale(speed);

    return `translate(60, 60) rotate(${direction}) scale(${scale})`;
  }

  setTransformAverage() {
    const averageSpeed = average(this.state.windSpeedAverages);
    const averageDirection = average(this.state.windDirectionAverages);
    const scale = this.getScale(averageSpeed);

    return `translate(60, 60) rotate(${averageDirection}) scale(${scale})`;
  }

  setStroke(speed) {
    const hue = this.getHue(speed);

    return `hsla(${hue}, 100%, 50%, 1)`;
  }

  setFillAverage() {
    const hue = this.getHue(average(this.state.windSpeedAverages));

    return `hsla(${hue}, 100%, 50%, 0.5)`;
  }

  componentDidMount() {
    // Simulate 20-30kn Southwesterly
    this.windInterval = setInterval(() => {
      const windSpeed = randomNumberBetween(20, 30);
      const windSpeedAverages = this.state.windSpeedAverages.concat(windSpeed);

      if (windSpeedAverages.length >= 10) {
        windSpeedAverages.shift();
      }

      const windDirection = randomNumberBetween(195, 235);
      const windDirectionAverages = this.state.windDirectionAverages.concat(windDirection);

      if (windDirectionAverages.length >= 10) {
        windDirectionAverages.shift();
      }

      this.setState({
        windSpeed,
        windSpeedAverages,
        windDirection,
        windDirectionAverages,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.windInterval);
  }

  render() {
    return (
      <div className="App">
        <table>
          <tbody>
            <tr>
              <th>Speed</th>
              <td>{this.state.windSpeed}<span className="unit">kn</span> {this.last10speeds}</td>
            </tr>
            <tr>
              <th>Direction</th>
              <td>{getCompassDirection(this.state.windDirection)} ({this.state.windDirection}&deg;)</td>
            </tr>
          </tbody>
        </table>
        <div className="compass-container">
          <svg className="compass" dangerouslySetInnerHTML={{__html: '<use xlink:href="#compass" />'}} />
          <svg className="roses" viewBox="0 0 120 120" preserveAspectRatio="xMinYMin">
            <g className="rose" transform={this.setTransform(this.state.windSpeed, this.state.windDirection)}>
              <path fill="transparent" strokeWidth="0.5" stroke={this.setStroke(this.state.windSpeed)} d="M8.898725556198825e-16,-14.532721699667961A14.532721699667961,14.532721699667961,0,0,1,7.266360849833979,-12.585706178041821L0,0Z"></path>
            </g>
            <g className="rose" transform={this.setTransformAverage()}>
              <path fill={this.setFillAverage(this.state.windSpeed)} d="M8.898725556198825e-16,-14.532721699667961A14.532721699667961,14.532721699667961,0,0,1,7.266360849833979,-12.585706178041821L0,0Z"></path>
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

export default App;
