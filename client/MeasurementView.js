const rx = require('rx');
const React = require('react');

const axios = require('axios');
const _ = require('lodash');
const log = require('./logger');

function sortItems(items) {
    return _.chain(items)
        .map(i => {
            i.time = new Date(i.time)
            return i;
        })
        .sortByOrder(['time'], ['desc'])
        .value();
}

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
            weightData$.subscribe(items => {
                this.setState({items: sortItems(items)});
            });
        },
        render() {
            return <WeightItem items={this.state.items}/>
        }
    });
}
