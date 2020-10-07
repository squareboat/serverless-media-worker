provider "aws" {
   region = "us-east-1"
}
resource "aws_media_convert_queue" "transcoder" {
  name = "tf-test-queue"
  pricing_plan="ON_DEMAND"
}
resource "aws_cloudwatch_event_rule" "VideoTranscodeSuccess" {
  name        = "video-transcode"
  description = "MediaConvert Job State Change"

  event_pattern = <<EOF
{
  "source": [
    "aws.mediaconvert"
  ],
  "detail-type": [
    "MediaConvert Job State Change"
  ],
  "detail": {
    "status": [
      "COMPLETE"
    ]
  }
}
EOF
}

resource "aws_cloudwatch_event_target" "sns" {
  rule      = aws_cloudwatch_event_rule.VideoTranscodeSuccess.name
  target_id = "VideoTranscodeSuccess"
  arn       = aws_sns_topic.VideoTranscodeSuccess.arn
}

resource "aws_sns_topic" "VideoTranscodeSuccess" {
  name = "VideoTranscodeSuccess"
}

resource "aws_sns_topic_policy" "default" {
  arn    = aws_sns_topic.VideoTranscodeSuccess.arn
  policy = data.aws_iam_policy_document.sns_topic_policy.json
}

data "aws_iam_policy_document" "sns_topic_policy" {
  statement {
    effect  = "Allow"
    actions = ["SNS:Publish"]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }

    resources = [aws_sns_topic.VideoTranscodeSuccess.arn]
  }
}
