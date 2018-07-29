import React, { Component } from 'react';
import getCompassDirection from '../utils/getCompassDirection';
import serverSentEventWrapper from './ServerSentEventWrapper';

const MIN_HUE = 0; // RED
const MAX_HUE = 190; // LIGHT BLUE 

const MIN_SCALE = 1; 
const MAX_SCALE = 2.7;

const MIN_SPEED = 0;
const MAX_SPEED = 50;

class Compass extends Component {
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

    setColor(speed) {
        const hue = this.getHue(speed);

        return `hsla(${hue}, 100%, 50%, 1)`;
    }

    parseMessage(message) {
        let data;

        try {
            data = JSON.parse(message);
        } catch(err) {
            throw new Error('Invalid json from server sent event');
        }

        return data;
    }

    render() {
        const { message } = this.props;

        if (!message) return (
            <div>No data!!</div>
        )

        const { windSpeed, windDirection, windSpeedAverage, windDirectionAverage } = this.parseMessage(message);

        return (
            <div className="Compass">
                <table>
                    <tbody>
                        <tr>
                            <th>Speed</th>
                            <td>{windSpeed}<span className="unit">kn</span></td>
                        </tr>
                        <tr>
                            <th>Direction</th>
                            <td>{getCompassDirection(windDirection)} ({windDirection}&deg;)</td>
                        </tr>
                    </tbody>
                </table>
                <div className="compass-container">
                    <svg className="compass" dangerouslySetInnerHTML={{__html: '<use xlink:href="#compass" />'}} />
                    <svg className="roses" viewBox="0 0 120 120" preserveAspectRatio="xMinYMin">
                        <g className="rose" transform={this.setTransform(windSpeed, windDirection)}>
                            <path fill="transparent" strokeWidth="0.5" stroke={this.setColor(windSpeed)} d="M8.898725556198825e-16,-14.532721699667961A14.532721699667961,14.532721699667961,0,0,1,7.266360849833979,-12.585706178041821L0,0Z"></path>
                        </g>
                        <g className="rose" transform={this.setTransform(windSpeedAverage, windDirectionAverage)}>
                            <path fill={this.setColor(windSpeedAverage)} d="M8.898725556198825e-16,-14.532721699667961A14.532721699667961,14.532721699667961,0,0,1,7.266360849833979,-12.585706178041821L0,0Z"></path>
                        </g>
                    </svg>
                </div>
            </div>
        )
    }
}

const WrappedCompass = serverSentEventWrapper(Compass);

export default WrappedCompass;
