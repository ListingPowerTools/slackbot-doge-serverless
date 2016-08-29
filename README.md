![Plan](http://www.mbejda.com/content/images/2016/08/doge-logo.png)


# Serverless SlackBot Doge
### What is Serverless Slackbot Doge?
Slackbot Doge is a serverless meme bot for Slack that utilizes and leverages the following Amazon Web Services : Amazon API, Amazon S3 Buckets, Amazon Lambda. Best of all, it is easy to install.

![Plan](http://www.mbejda.com/content/images/2016/08/plan.png#full)



## Installation

### Lambda Function & S3 Bucket
Create an Amazon S3 bucket that will contain all your user-generated memes. 
[Download](https://github.com/ListingPowerTools/slackbot-doge-serverless) SlackBot Doge zip from Github and upload it to your Lambda function. Give your Lambda function access to your S3 resources by going to **configuration->role->custom role** and adding the following policy. Make sure to update the Resource to your own.
![Custom Role](http://www.mbejda.com/content/images/2016/08/Screen-Shot-2016-08-28-at-9-31-42-PM.png#full)

**IAM Policy**
```javascript
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Sid": "Stmt1472400819800",
        "Action": "s3:*",
        "Effect": "Allow",
        "Resource": "arn:aws:s3:::slackbotdoge:*"
    },
    {
        "Effect": "Allow",
        "Action": [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
        "Resource": "arn:aws:logs:*:*:*"
    }
]
}
```

### API Gateway
In the Amazon dashboard, navigate to Amazon API Gateway and click on Create API.
![Custom Role](http://www.mbejda.com/content/images/2016/08/Screen-Shot-2016-08-28-at-9-35-40-PM.png#full)
Fill in some basic API information and then click Create API. Now create a new API `GET` method and set the integration type to `Lambda Function`. Make sure that the `Lambda Region` corresponds to your Lambdas region. If you have done everything correctly your Lambda function should automatically prepopulate. Then click save. 
![Custom Role](http://www.mbejda.com/content/images/2016/08/Screen-Shot-2016-08-28-at-9-43-20-PM.png#full)

Now we are going to MAP Slacks request variables. 
Click on **Integration Request->Body Mapping Templates->Add Mapping Template**
![Custom Role](http://www.mbejda.com/content/images/2016/08/Screen-Shot-2016-08-28-at-9-47-53-PM.png#full)
Put the following into the header type
```
application/x-www-form-encoded
``` 
and put the following into the template
```
{
#set($queryMap = $input.params().querystring)
#foreach( $key in $queryMap.keySet())
  "$key" : "$queryMap.get($key)"
  #if($foreach.hasNext),#end
#end
}
```
![Amazon API Gateway](http://www.mbejda.com/content/images/2016/08/Screen-Shot-2016-08-28-at-9-48-33-PM.png#full)


### Slash Command
https://api.slack.com/slash-commands

Create a custom command for your team by going to
`https://<YOUR TEAM>.slack.com/apps/build`
![Slack Slash Command](http://www.mbejda.com/content/images/2016/08/Screen-Shot-2016-08-28-at-9-58-52-PM.png#full) and clicking on **Make a Custom Integration->Slash Command**.
Choose a command and continue.
![Slack Slash Command](http://www.mbejda.com/content/images/2016/08/Screen-Shot-2016-08-28-at-10-01-43-PM.png#full)

Continue filling out whatever information is necessary. For the URL field make sure to input your **Amazon API Gateway API** URL and for the Method select `GET`. 
![Slack Slash Command](http://www.mbejda.com/content/images/2016/08/Screen-Shot-2016-08-28-at-10-03-36-PM.png#full)


### That's it! 
Everything should be working just fine. If you are running into any issues feel free to send me a tweet [@notMiloBejda](https://twitter.com/notMiloBejda). SlackBot Doge repo can be found here : 
https://github.com/ListingPowerTools/slackbot-doge-serverless







