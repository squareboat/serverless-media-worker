"use strict";

const AWS = require("aws-sdk");
const { get, pick, isEmpty, isObject } = require("lodash");
const SaveImage = require("./tasks/SaveImage");
const AfterSave = require("./tasks/AfterSave");
const CompressImage = require("./tasks/CompressImage");
const { build_path, asyncForEach } = require("./helpers");
const { mediaConvertParams } = require("../config/mediaconvert");

AWS.config.update({ region: process.env.APP_AWS_REGION });
AWS.config.mediaconvert = {
  endpoint: process.env.MEDIA_CONVERT_API_ENDPOINT,
};

class MediaHandler {
  /**
   * Initialize ImageHandler
   *
   * @param {Object} inputs
   * @param {Object} config
   *
   * @return {void}
   */
  constructor(inputs, config) {
    this.inputs = inputs;
    this.config = config;
    this.s3 = new AWS.S3();
    this.mediaconvert = new AWS.MediaConvert({ apiVersion: "2017-08-29" });
    this.compressor = new CompressImage(this.s3);
    this.saveImage = new SaveImage(this.s3);
    this.afterSave = new AfterSave();
    this.successBag = [];
  }

  /**
   * Handle the image compression and any other functionality
   *
   * @return {void}
   */
  handle() {
    if (!this.validate()) {
      return;
    }
    let options = {
      Bucket: get(this.inputs, "bucket"),
      Key: get(this.inputs, "key"),
    };

    this.s3
      .headObject(options)
      .promise()
      .then((meta) => {
        if (meta.ContentType.match("video.*")) {
          const params = mediaConvertParams(
            `s3://${options.Bucket}/${options.Key}`
          );
          this.mediaconvert
            .createJob(params)
            .promise()
            .then((res) => {
              console.log("RESPONSE ==>", res);
            })
            .catch((err) => {
              console.log("ERROR ==> ", err);
            });
        } else if (meta.ContentType.match("image.*")) {
          this.s3
            .getObject(options)
            .promise()
            .then(this.compress.bind(this))
            .catch((err) => {
              console.log(err);
            });
        } else {
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Compress the image recieved from S3
   * @param {Object} data
   *
   * @return {void}
   */
  async compress(data) {
    let variants = get(this.config, "variants", []);
    let payload = {
      key: get(this.inputs, "key"),
      meta: {},
      variants: [],
    };

    await asyncForEach(variants, async (v) => {
      let image = await this.compressor.handle(data.Body, {
        ...v,
        format: data.ContentType.split("/"),
      });
      this.save(image, v, data.ContentType);
      payload.meta = pick(image.meta, ["width", "height", "channels"]);
      const {
        channels: [rc, gc, bc, k],
      } = image.stats;
      payload.meta["dominantColor"] = {
        r: Math.round(rc.mean),
        g: Math.round(gc.mean),
        b: Math.round(bc.mean),
      };
      payload.variants.push(v);
    });

    this.afterSave.handle(payload);
  }

  /**
   * Save the image once it is processed.
   *
   * @param {Buffer} image
   * @param {Object} variant
   * @param {String} contentType
   *
   * @return {void}
   */
  save(image, variant, contentType) {
    this.saveImage.handle(image.buffer, {
      key: build_path({ ...variant, ...this.inputs }),
      bucket: this.inputs.bucket,
      contentType,
    });
  }

  /**
   * Validate if inputs received is as expected or not.
   *
   * @return {Boolean}
   */
  validate() {
    let inputs = this.inputs;
    if (isEmpty(inputs)) {
      return false;
    }
    if (!isObject(inputs)) {
      return false;
    }
    if (isEmpty(get(inputs, "bucket")) || isEmpty(get(inputs, "key"))) {
      return false;
    }

    return true;
  }
}

module.exports = MediaHandler;
