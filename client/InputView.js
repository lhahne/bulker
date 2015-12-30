const rx = require('rx');
const React = require('react');

const axios = require('axios');

const log = require('./logger');

module.exports = function(profile$, weightData$) {
    return React.createClass({
        getInitialState() {
            return {};
        },
        componentDidMount() {
            rx.Observable.combineLatest(profile$, weightData$, (profile, weightData) => {
                return {
                    profile,
                    weightData
                }
            }).subscribe(state => this.setState(state));
        },
        submitNewData(event) {
            const waist = event.target[0].value;
            const user = this.state.profile.encodedId;
            const weight = this.state.weightData.weight;
            axios.post('/data', {waist, weight, user, time: new Date()});
            event.preventDefault();
        },
        render() {
            const displayWeight = data => {
                if (data)
                    return <p>Weight today {data.weight}</p>;
            };

            return (
                <div>
                    {displayWeight(this.state.weightData)}
                    <form onSubmit={this.submitNewData}>
                        <p>Waist <input type="text" /></p>
                        <input type="submit" />
                    </form>
                </div>
            );
        }
    });
}
