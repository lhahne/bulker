const rx = require('rx');
const axios = require('axios');

const React = require('react');
const ReactDOM = require('react-dom');

const log = require('./logger');

const token$ = rx.Observable.fromPromise(axios.get('/user'))
    .map(response => response.data.token);

const get$ = path => token$.flatMap(token => rx.Observable.fromPromise(axios.get(`https://api.fitbit.com${path}`, {headers: {Authorization: 'Bearer ' + token}})));

const profile$ = get$('/1/user/-/profile.json')
    .map(response => response.data.user);

const today = new Date().toISOString().substr(0, 10);

const weightData$ = get$(`/1/user/-/body/log/weight/date/${today}.json`)
    .map(response => response.data.weight[0]);

const DataView = React.createClass({
    getInitialState() {
        return {};
    },
    componentDidMount() {
        rx.Observable.combineLatest(profile$, weightData$, (profile, weightData) => {
            log.info(profile);
            log.info(weightData);
            return {
                profile,
                weightData
            }
        }).subscribe(state => this.setState(state));
    },
    submitNewData(event) {
        const waist = event.target[0].value;
        const user = this.state.profile.encodedId;
        axios.post('/data', {waist, user});
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

ReactDOM.render(<DataView />, document.getElementById('root'));
