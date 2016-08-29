import config from './config';

const query = {
    get: function (url, cb) {
        let REQUEST_URL = config.domain + url;
        fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)
                if (cb && typeof cb === 'function') {
                    cb(responseData);
                }
            })
            .done();
    },
    post: function (url, param, cb) {
        let REQUEST_URL = config.domain + url;
        var myHeaders = new Headers();

        myHeaders.append('Content-Type', 'application/json');
        fetch(REQUEST_URL, {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(param)
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (cb && typeof cb === 'function') {
                    cb(responseData);
                }
            })
            .done();
    }
};
export default query;