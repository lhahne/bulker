const rx = require('rx');
const axios = require('axios');

const React = require('react');
const ReactDOM = require('react-dom');

const log = require('./logger');

const token = rx.Observable.fromPromise(axios.get('/user'))
    .map(response => response.data.token);

const get = path => token.flatMap(token => rx.Observable.fromPromise(axios.get(`https://api.fitbit.com${path}`, {headers: {Authorization: 'Bearer ' + token}})))

const profile = get('/1/user/-/profile.json')
    .map(response => response.data.user);

const today = new Date().toISOString().substr(0, 10);

const weightData = get(`/1/user/-/body/log/weight/date/${today}.json`)
    .map(response => response.data.weight[0]);

const DataView = React.createClass({
    getInitialState() {
        return {};
    },
    componentDidMount() {
        weightData.subscribe(data => {
            log.info(data);
            this.setState({data})
        });
    },
    render() {
        const displayData = data => {
            if (data)
             return <p>Weight today {this.state.data.weight}</p>;
        };

        return (
            <div>
                {displayData(this.state.data)}
            </div>
        );
    }
});

ReactDOM.render(<DataView />, document.getElementById('root'));
