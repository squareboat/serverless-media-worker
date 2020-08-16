'use strict'

const axios = require('axios')

class AfterSave
{
    handle(payload) {
        payload.lambdaName = process.env.LAMBDA_NAME
        axios.post(process.env.APP_REPORTING_SERVER_URL, payload, {
            headers : this.headers(),
        })
        .then(res => {
            console.log('MESSAGE RECEIVED FROM SERVER ==>', res)
        }).catch(error => {
            console.log('ERROR FROM SERVER ==>', error)
        })
    }

    headers() {
        let headers = process.env.APP_REPORTING_SERVER_HEADERS
        headers = headers.split(',')
        let parsedHeaders = {}
        headers.forEach(h => {
            h = h.split('|')
            parsedHeaders[h[0]] = h[1]
        })
        return parsedHeaders
    }
}

module.exports = AfterSave