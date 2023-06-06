const express = require('express')
const aminRouter = express.Router()
const bodyparser = require('body-parser')
const {MongoClient} = require('mongodb')
const bcrypt = require('bcryptjs')
const url="mongodb+srv://testing:test123@cluster1.vnynuru.mongodb.net/?retryWrites=true&w=majority"



aminRouter.use(bodyparser.urlencoded({ extended: true }));
aminRouter.use(bodyparser.json());


const client =new MongoClient(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

//register user
aminRouter.post('/register',(req,res)=>{
client.connect((dberr,dbres)=>{
    if(dberr){
        console.log(dberr)
    }
    else{
    const db = dbres.db('test')
    db.collection('admin').findOne({email:req.body.email}, function(err,user){
        if(err){
            console.log(err)
        }
       if(user){
            // res.status(304).send("please use different email")
            console.log(user)
            res.send("Email Already in Use")
        }
        else{
            const hashedPassword= bcrypt.hashSync(req.body.password,8)
            const userCreate = {
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                password:hashedPassword
            }
            db.collection('admin').insertOne(userCreate,(err,result)=>{
                if(err){
                    console.log(err)
                }
                else{
        
                    // res.status(200).send({auth:true,token:"successfull"})
                    res.send(result)
                }
        
            })
            }
        })
        }
    })
  
})

//admin login

aminRouter.post('/login',(req,res)=>{
    client.connect((dberr,dbres)=>{
        if(dberr){
            console.log(dberr)
        }
        else{
        const db = dbres.db('test')
        db.collection('admin').findOne({email:req.body.email}, function(err,user){
            if(err){
                console.log(err)
            }
        else{
            if(!user){
                console.log("no user found")
                res.send("No User Found")
            }
            else{
               const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
               if(!passwordIsValid){
                console.log("wrong password")
                res.send("Wrong Password")
               } 
               else{
                res.send(user)
                
               }
            }
        }
        })
        }
    })
})

///adding students
aminRouter.post('/addStudent',(req,res)=>{
    client.connect((dberr,dbres)=>{
        if(dberr){
            console.log(dberr)
        }
        else{
            const db = dbres.db('test')
            db.collection('students').findOne({register:req.body.register}, function (err,user){
             if(err) return res.status(500).send('Error on the server.');

             else {
                if(!user){
                    const haspassword= bcrypt.hashSync(req.body.password?req.body.password:'test',8)
                      const userCreate = {
                        register:req.body.register,
                        name:req.body.name,
                        isActive:req.body.active?req.body.active:true,
                        leave:req.body.leave?req.body.leave:false,
                        password:haspassword
                    }
                    db.collection('students').insertOne(userCreate,(err,result)=>{
                        if(err){
                            console.log(err)
                        }
                        else{
                
                            // res.status(200).send({auth:true,token:"successfull"})
                            res.send(result)
                        }
                    })
                    }
                    else{
                   res.status(304).send({auth:false,token:"number is already in use"})
                   console.log(user)
                   res.send("Register Number already in use")
                    }
                }
                })
                
                }
            })
                
    })

    //adding timetable
    aminRouter.post('/posting',(req,res)=>{
        client.connect((dberr,dbres)=>{
            if(dberr){
                console.log(dberr)
            }
            else{
                const db = dbres.db('test')
                db.collection('timetable').insertOne(req.body,(err,result)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        // res.status(200).send("successfull")
                        res.send(result)
                    }
                })
            }
        })
    })

    /////sending notifctaions
    aminRouter.post('/posting/notifications',(req,res)=>{
        client.connect((dberr,dbres)=>{
            if(dberr){
                console.log(dberr)
            }
            else{
                const db = dbres.db('test')
                const userCreate ={
                    notification:req.body.Notification,
                    date:new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
                }
                db.collection('notification').insertOne(userCreate,(err,result)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        // res.status(200).send('successfull')
                        res.send(result)
                    }
                })
            }
        })
    })

    ///// exam pass
    aminRouter.post('/posting/exampass',(req,res)=>{
        client.connect((dberr,dbres)=>{
            if(dberr){
                console.log(dberr)
            }
            else{
                const db = dbres.db('test')
                db.collection('exampass').insertOne(req.body,(err,result)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.status(200).send("successfull")
                    }
                })
            }
        })
    })

    /////change faculty
    aminRouter.post('/posting/changeFaculty',(req,res)=>{
        client.connect((dberr,dbres)=>{
            if(dberr){
                console.log(dberr)
            }
            else{
                const db = dbres.db('test')
                db.collection('faculty').insertOne(req.body,(err,result)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.send(result)
                    }
                })
            }
        })
    })

    aminRouter.put('/updating',(req,res)=>{
            client.connect((dberr,dbres)=>{
                if(dberr){
                    console.log(dberr)
                }
                else{
                    const db = dbres.db('test')
                    const query = {register:req.body.register}
                    const query2 = {$set:req.body}
                    db.collection('students').updateOne(query,query2, function(err,result){
                        if(err){
                            console.log(err)
                        }
                        else{
                            res.send(result)
                        }
                    })
                }
            })
        })

    module.exports = aminRouter