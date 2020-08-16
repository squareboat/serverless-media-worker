'use strict'

class SaveImage
{
    constructor(s3) {
        this.s3 = s3
    }

    handle(image, options) {
        let inputs = {
            Bucket : options.bucket,
            Key : options.key,
            Body : image,
            ContentType : options.contentType
        }

        this.s3.putObject(inputs, this.afterSave.bind(this))
    }

    afterSave(err, data) {
        console.log('ERROR WHILE SAVING ====> ', err)
        console.log('DATA WHILE SAVING =======>', data)
    }
}

module.exports = SaveImage