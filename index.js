const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { UserModel, TodoModel } = require("./db");
const auth = require('./auth');

mongoose.connect("mongodb+srv://jayedaktar35:Zayed@891@cluster0.9l3ea.mongodb.net/");

const app = express();
app.use(express.json());

const JWT_SECRET = "GTA6";

app.post('/signup', async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        email : email,
        password: password,
        name : name
    });

    res.json({
        message : "You are signed up"
    })

})

app.post('/login', async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email : email,
        password: password
    })

    if(response){
        const token = jwt.sign({
            id : response._id.toString()
        },JWT_SECRET);

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Wrong Credentials"
        })
    }
});

app.post('/todo', auth, (req,res)=>{
    const userId = req.userId;
    const title = req.body.title;
    const done =req.body.done;

    TodoModel.create({
        userId: userId,
        title: title,
        done : done
    });

    res.json({
        message : "You have created a Todo"
    });

});

app.get('/todos',auth, async(req,res)=>{
    const userId = req.userId;

    const todos =await TodoModel.find({
        userId : userId
    });

    res.json({
        todos
    })
});

app.listen(3000);