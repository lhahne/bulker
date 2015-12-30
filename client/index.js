const rx = require('rx');
const axios = require('axios')

const token = rx.Observable.fromPromise(axios.get('/user'))
    .map(response => response.data.token);

const profile = token.flatMap(token => rx.Observable.fromPromise(axios.get('https://api.fitbit.com/1/user/-/profile.json', {headers: {Authorization: 'Bearer ' + token}})))
    .map(response => response.data.user)
    .subscribe(v => console.log(v));

