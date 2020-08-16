'use strict'

const { head, get, isEmpty } = require('lodash')

const parser = function(events) {
    let records = events.Records
    let event = head(records)
    let s3 = get(event, 's3')
    if (isEmpty(s3)) { return null }
    return {
        bucket: get(s3, 'bucket.name', process.env.S3_PHOTOS_BUCKET),
        key: get(s3, 'object.key'),
    }
}

module.exports = parser