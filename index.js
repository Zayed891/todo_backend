const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { UserModel, TodoModel } = require("./db");
const {auth} = require('./auth');
const bcrypt = require('bcrypt');
import { z } from "zod";

mongoose.connect("mongodb+srv://jayedaktar35:fMvKX7hUkHvEsdnl@cluster0.9l3ea.mongodb.net/");

const app = express();
app.use(express.json());

const JWT_SECRET = "GTA6";

app.post('/signup', async(req,res)=>{
    const requireBody = z.object({
        email : z.string().min(5).max(15),
        password : z.string().min(8).max(18),
        name : z.string()
    });
    
    const parsedData = requireBody.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            message : "Incorrect Format"
        })

        return;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.username;

    const hashedPassword = bcrypt.hash(password,5)

    await UserModel.create({
        email : email,
        password: hashedPassword,
        name : name
    });

    res.json({
        message : "You are signed up"
    })

})

app.post('/login', async(req,res)=>{
    const requireBody = z.object({
        email : z.string().min(5).max(15),
        password : z.string().min(8).max(18)
    });
    
    const parsedData = requireBody.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            message : "Incorrect Format"
        })

        return;
    }
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email : email,
    })

    const passwordMatch = bcrypt.compare(password,user.password);

    if(user && passwordMatch){
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