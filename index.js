"use strict";

const { isEmpty } = require("lodash");
const config = require("./config/image");
const eventParser = require("./src/utils/eventParser");
const MediaHandler = require("./src/MediaHandler");

module.exports.compress = (event) => {
  let inputs = eventParser(event);
  if (isEmpty(inputs)) return;
  const handler = new MediaHandler(inputs, config);
  handler.handle();
  return;
};
