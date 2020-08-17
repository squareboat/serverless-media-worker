# Serverless Media Worker

A simple out of the box serverless media worker 🧑‍🏭 for your media processing tasks.

## Table of Content

- [Serverless Media Worker](#serverless-media-worker)
  - [Table of Content](#table-of-content)
  - [Introduction](#introduction)
  - [Installation](#installation)
  - [Configuration](#configuration)
      - [#1: Configure aws-cli](#1-configure-aws-cli)
      - [#2: Environment Variables Setup](#2-environment-variables-setup)
      - [#3: Image Variants Configuration](#3-image-variants-configuration)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Commands](#commands)
  - [Coming Soon](#coming-soon)
  - [About Us](#about-us)
  - [License](#license)

## Introduction

A ready-to-use configurable media worker for image compression and video transcoding tasks. You can compress images and transcode videos at ease. This is highly scalable because of the serverless architecture it supports.

As simple as running a 2-3 commands, one time setup and nothing more. We promise! 🙆

> ⚡ Currently supports only AWS Lambda

---

## Installation

This package internally uses [Serverless Framework](https://www.serverless.com/) for maintenance and deployment purposes.

```python
# 1. Install Serverless CLI tool
> npm install -g serverless

# 2. Install NPM dependencies
> npm install
```

---

## Configuration

Before deployment you need to configure the `aws-cli` user first. This worker will automatically detect your `aws-cli` user.

> By default, the `media-worker` will be triggered when you PUT images inside the `originals/` directory in the mentioned AWS S3 bucket.

#### #1: Configure aws-cli

To know how to configure, a good explanation is given [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).

> Make sure all necessary permissions are given to the aws-cli user, otherwise you won't be able to deploy the worker 🧑‍🏭.

#### #2: Environment Variables Setup

We have added an `.env.example` file to know what all variables are needed for configuration.

```python
# 1. Copy the .env.example to following
> cp .env.example .env.production # for production environment
> cp .env.example .env.development # for development environment
```

For better debugging and development purpose, this package enforces `.env.production` and `.env.development` out-of-the-box.

Variables needed are:
| Variable                     | Description                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| APP_SERVICE                  | Name of the main service, for example: `example-microservices`                                                                       |
| APP_STAGE                    | Stage of the worker, `dev` or `prod`. Helpful in identifying in cloudformation templates                                             |
| LAMBDA_NAME                  | Name of the Lambda function                                                                                                          |
| APP_AWS_REGION               | AWS region of the app, where all of the resources will be deployed                                                                   |
| APP_S3_BUCKET                | AWS S3 Bucket Name, see the rules [here](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules). |
| APP_REPORTING_SERVER_URL     | Absolute webhook URL, where the meta data of the image will be posted once it is successfully compressed, method used will be `POST`   |
| APP_REPORTING_SERVER_HEADERS | In some case you may need to send custom headers, if so provide them in `"KEY1|VALUE1,KEY2|VALUE2,..."` format                       |

#### #3: Image Variants Configuration

We provide some pre-defined variants for image processing. However, if you wish to generate your custom variants you can do so very easily.

1. Go to config/image.js
2. Add your variant in the `variants` array

`variants` array expects an object as it's child, which can have below mentioned possible key-value pairs

| Key         | Possible Values                      | Description                                                                                                                     | Default Value        |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| width       | 0-10000                              | max width of the image after compression. Note: Image's width can be <= `width` to preserve aspect ratio                        | --                   |
| height      | 0-10000                              | max height of the image after compression. Note: Image's height can be <= `height` to preserve the aspect ratio and orientation | --                   |
| path        | `w:${width}/h:${height}/f:${format}` | The path inside the S3 bucket where the variant of the image is to be put                                                       | --                   |
| format      | `jpeg` or `png` or `webp`            | Format to which the variant to be compressed to, independent of the input image's format                                        | input image's format |
| blur        | `Boolean`                            | To blur the images or not. Helpful when generating mini thumbnails of the images                                                | `false`              |
| quality     | 0-100                                | Quality of the compressed image variant in respect to the input image's quality                                                 | 90                   |
| aspectRatio | `Boolean`                            | To preserve the aspect-ratio of the image variant or not                                                                        | `true`               |

---

## Testing

> We strongly recommend to follow this step before jumping to deployment step.

We provide a simple command to invoke the function to test the invocation of the `media-worker` function.

To test, simply run:

```python
> npm run invoke -- --path mocks/image.json
```

We have already added mock events for `image` and `video` as `image.json` and `video.json` respectively. 

Once your `aws-cli` is configured you can simply pass the name of the file to compress and see the magic 🔮 happen.

---

## Deployment

Once you are done with all your testing and ready for deployment, follow the below mentioned steps.

We support two environments, `prod` and `dev` out of the box. In most of the cases these two environments will be sufficient for all purposes.

```python
# For Staging Environment
> npm run deploy:dev

# For Production Environment
> npm run deploy:prod
```

To know what is happening, run the command in verbose mode:

```python
# For Staging Environment
> npm run deploy:dev -- --verbose

# For Production Environment
> npm run deploy:prod -- --verbose
```

For more support and options, see the link [here](https://www.serverless.com/framework/docs/providers/aws/cli-reference/deploy/).

---

## Commands

This package includes following commands:

| Command          | Description                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| build:local      | Run this command if you wish to build the function for your local system, auto-manages the `sharp` package                              |
| build:serverless | Command to build the function for your serverless deployment, auto-manages the `sharp` package                                          |
| deploy:dev       | For development environment deployment                                                                                                  |
| deploy:prod      | For production environment deployment                                                                                                   |
| invoke           | Run this command to invoke the function locally. Pass `--path mocks/image.json` or `--path mocks/video.json` for custom events payloads |


---

## Coming Soon

1. AWS Cloudformation Template - Deploy directly from AWS Console
2. Terraform Support
3. and much more... 😇

---

## About Us

We are a bunch of dreamers, designers, and futurists. We are high on collaboration, low on ego, and take our happy hours seriously. We'd love to hear more about your product. Let's talk and turn your great ideas into something even greater! We have something in store for everyone. [☎️ 📧 Connect with us!](https://squareboat.com/contact)

---

## License

The MIT License. Please see License File for more information. Copyright © 2020 SquareBoat.

Made with ❤️ by [Squareboat](https://squareboat.com)
