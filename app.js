const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const Match = require('./models/Match')
const User = require('./models/User')

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const URI = "mongodb://localhost:27017/match_prediction";

mongoose.connect(URI, { useNewUrlParser: true })
    .then(() => {

        console.log("DB connected");
    }).catch((error) => {
        console.error("Db Error: ", error);
        process.exit(1);
    });

app.post('/addMatch', celebrate({
    body: Joi.object().keys({
        matchNo: Joi.string().required(),
        team: Joi.array().items().optional()
    })
}), (req, res) => {
    try {
        console.log('0000000')
        Match.create(req.body, (err, data) => {
            console.log('111111111')

            if (err) {
                console.log('222222222')
                res.status(200).json({
                    statusCode: 400,
                    message: "Something went wrong",
                    data: {}
                });
            }
            res.status(200).json({
                statusCode: 201,
                message: "Success",
                data: data
            })
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            statusCode: 400,
            message: "Something went wrong",
            data: {}
        })
    }
})


//sign up
app.post('/test', celebrate({
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        contact: Joi.string().required(),
    })
}), (req, res) => {
    try {
        console.log('0000000')
        User.create(req.body, (err, data) => {
            console.log('111111111')

            if (err) {
                console.log('222222222')
                res.status(200).json({
                    statusCode: 400,
                    message: "Something went wrong",
                    data: {}
                });
            }
            res.status(200).json({
                statusCode: 201,
                message: "Success",
                data: data
            })
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            statusCode: 400,
            message: "Something went wrong",
            data: {}
        })
    }
})
app.post('/signin', celebrate({
   body: Joi.object().keys({
       email: Joi.string().required(),
       password: Joi.string().required(),

   })
}), (req, res) => {
   try {
       console.log('0000000')
       User.findOne({ email: req.body.email }, (err, data) => {
           console.log('0000000')
           console.log(data)
           console.log(data.email)
           console.log(data.email)
           if (data === null) {
               console.log('111111')
               return res.contentType('json').json({
                   statusCode: 400,
                   message: "login invalid"
               })

           } else if (data.email === req.body.email && data.password === req.body.password) {
               console.log('333333')
               return res.contentType('json').json({
                   statusCode: 200,
                   message: "login sucessful",
                   data: data
               })

           } else {

               console.log("Credentials wrong");
               return res.contentType('json').json({
                   statusCode: 500,
                   message: "login invalid"
               })
           }
       })
   } catch (err) {
       console.log(err);
       res.status(400).json({
           statusCode: 400,
           message: "Something went wrong",
           data: {}
       })
   }
})

app.put('/updateVote/:id/:tName', celebrate({
   body: Joi.object().keys({
       matchNo: Joi.string().optional(),
       teams: Joi.array().items().optional()
   })
}), (req, res) => {

   try {
       console.log('111000')
       Match.updateOne({
           _id: mongodb.ObjectID(req.params.id),
           "team.teamName": req.params.tName
       },

           {
               $inc: { "team.$.votes": 1 }
           },

           (error, data) => {
               if (error) {
                   res.status(200).json({
                       statusCode: 400,
                       message: "user not found",


                   })
               }
               return res.status(200).json({
                   statusCode: 200,
                   message: "sucess",
                   data: data
               })
           })

   } catch (err) {
       console.error(err)
       res.status(200).json({
           statusCode: 400,
           message: "somthing is going wrong"
       })

   }

})
app.use(errors());
app.use((err, req, res, next) => {

    res.locals.message = err.message;
})
app.listen(3000, () => {
    console.log("server is running @3000")
})