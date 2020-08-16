'use strict'

const { pick } = require('lodash')

const build_path = function(options) {
    let key = options.key.split('/')[1].split('.')[0]
    if (options.path) return `${options.path}/${key}`
    return `w:${options.width}/h:${options.height}/f:${options.format}/${key}.${options.format}`
}

const asyncForEach = async function(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = {
    build_path,
    asyncForEach
}