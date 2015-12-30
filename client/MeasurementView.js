const rx = require('rx');
const React = require('react');

const axios = require('axios');

const log = require('./logger');

const WeightItem = React.createClass({
    render() {
        const makeItem = item => <li key={item._id}>Weight {item.weight},Waist {item.waist}</li>
        return <ul>{this.props.items.map(makeItem)}</ul>;
    }
});

module.exports = function(weightData$) {
    return React.createClass({
        getInitialState() {
            return {items: []};
        },
        componentDidMount() {
            weightData$.subscribe(state => {
                this.setState({items: state});
            });
        },
        render() {
            return <WeightItem items={this.state.items}/>
        }
    });
}
