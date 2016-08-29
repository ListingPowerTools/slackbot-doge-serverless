var caption = require('caption');
var AWS = require('aws-sdk');
var fs = require('fs');

/*
    The following variables need to be updated
 */
AWS.config.region = 'us-east-1';
var bucketName = "slackdoge";
var bucketPath = "https://s3-us-west-2.amazonaws.com/slackdoge/";



/*
    Generates the memes and saves them in /tmp directory
 */
var generateMeme = function (meme, topCaption, bottomCaption, cb) {
    var fileName = new Date().valueOf() + ".jpeg";
    var meme = meme + ".jpg";
    var obj = {
        caption: topCaption,
        outputFile: "/tmp/" + fileName
    };

    if(bottomCaption){
        obj['bottomCaption'] = bottomCaption;
    }


    caption.path("memes/" + meme,obj, function (err, filename) {
        if(err) return cb(err);

        var r = "/tmp/" + fileName;
        var body = fs.createReadStream(r);
        var s3obj = new AWS.S3({params: {Bucket: bucketName, Key: fileName}});
        /*
            Upload the meme to bucket
         */
        s3obj.upload({Body: body, ContentType: "image/jpeg"}).on('httpUploadProgress', function (evt) {
    
        }).send(function (err, data) {
            var url = bucketPath + fileName;
            console.log("ERRR ",err)
            console.log(url)
            cb(err, url);

        });
    });
};



/*
    Retrieves all the files in the meme directory.
 */
var getFiles = function(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            var f = files[i].split(".")[0];
            files_.push(f);
        }
    }
    return files_;
};












exports.handler = function (event, context) {


    process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']

    /*
        AWS API passes in slack parameters
     */
    var text = event.text;





    /*
        If the user is requesting help, return the 2 available methods
     */
    if (text.toLowerCase() == "help") {
        var params = {
            "icon_emoji": ':smiley:',
            "text": "",
            "attachments": [
                {
                    "text": "available memes /meme all or usage /meme usage"
                }
            ]
        };
        return context.succeed(params);
    }




    /*
        User usage response
     */

    if (text.toLowerCase() == "usage") {
        var params = {
            "icon_emoji": ':smiley:',
            "text": "",
            "attachments": [
                {
                    "text": "meme:TOP CAPTION|BOTTOM CAPTION \n EXAMPLE: `/meme doge:Hello World|I'm Doge!`"
                }
            ]
        };

        return context.succeed(params);
    }




    /*
        Read the memes directory and display a list of memes available to the user
     */

    if (text.toLowerCase() == "all") {
        var memes = getFiles('memes');
        var params = {
            "icon_emoji": ':smiley:',
            "text": "",
            "attachments": [
                {
                    "text": memes.join("\n")
                }
            ]
        };

        return context.succeed(params);
    }





    var memeType = "doge";
    /*
        Get the meme type
     */
    if (text.indexOf(":") > -1) {
        try {
            var split = text.split(":");
            var text = split[1];
            var memeType = split[0].toLowerCase();
        } catch (e) {

        }
    }




    var textArray = text.split("|");

    /*
        Generate the meme
     */

    generateMeme(memeType, textArray[0], textArray[1], function (error, imageUrl) {
        if(error){
            /*
                If there is an error, display the error to the user.
             */
            var params = {
                "icon_emoji": ':smiley:',
                "text": "",
                "attachments": [
                    {
                        "text": JSON.stringify(error)
                    }
                ]
            };

        }else {
            /*
             Send MEME off to the channel
             */
            var params = {
                "response_type": "in_channel",
                "icon_emoji": ':smiley:',
                "text": "",
                "attachments": [
                    {
                        "text": "",
                        "image_url": imageUrl
                    }
                ]
            };
        }


        context.succeed(params);
    });


};