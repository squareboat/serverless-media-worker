'use strict'

const { pick, get } = require('lodash')
const sharp = require('sharp')

class ImageCompress {
    constructor(s3) {
        this.s3 = s3
    }

    async handle(image, options) {
        let s = sharp(image)

        if (options.format === 'jpeg') {
            let formatOptions = {
                quality: get(options, 'quality', 90),
                progressive: true
            }
            s.toFormat('jpeg', formatOptions)
        }

        if (options.width && options.height) {
            let resizeOptions = pick(options, ['width', 'height'])
            if (get(options, 'aspectRatio', true)) {
                resizeOptions.fit = 'inside'
            }

            s.resize(resizeOptions)
        }

        if (options.blur) { s.blur() }

        return {
            meta: await s.metadata(),
            stats: await s.stats(),
            buffer: await s.toBuffer(),
        }
    }
}

module.exports = ImageCompress