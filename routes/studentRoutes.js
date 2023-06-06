const express = require('express')
const studentRouter = express.Router()
const bodyparser = require('body-parser')
const {MongoClient} = require('mongodb')
const bcrypt = require('bcryptjs')
const url="mongodb+srv://testing:test123@cluster1.vnynuru.mongodb.net/?retryWrites=true&w=majority"



studentRouter.use(bodyparser.urlencoded({ extended: true }));
studentRouter.use(bodyparser.json());


const client =new MongoClient(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

////login////////////
studentRouter.post('/studentlogin',(req,res)=>{
    client.connect((dberr,dbres)=>{
        if(dberr){
            console.log(dberr)
        }
        else{
        const db = dbres.db('test')
        db.collection('students').findOne({register:req.body.register},function(err,user){
            if(err){
                console.log(err)
            }
        else{
            if(!user){
                console.log(user)
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
studentRouter.put('/addPassword',(req,res)=>{
    client.connect((dberr,dbres)=>{
        if(dberr){
            console.log(dberr)
        }
        else{
            const hashedPassword = bcrypt.hashSync(req.body.password, 8)
            const db = dbres.db('test')
            const query = {register:req.body.register}
            const query2 = {$set:{password:hashedPassword}}
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


studentRouter.put('/addDetails',(req,res)=>{
    client.connect((dberr,dbres)=>{
        if(dberr){
            console.log(dberr)
        }
        else{
            const db = dbres.db('test')
            const query = {register:req.body.register}
            const query2 = {$set:req.body}
            db.collection('students').updateMany(query,query2,{multi:true},function(err,result){
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


studentRouter.get('/getDetails/:id',(req,res)=>{
    client.connect((dberr,dbress)=>{
        if(dberr){
            console.log(dberr)
        }
        else{
            const db= dbress.db('test')
          
            db.collection('students').findOne({register:req.params['id']}, function(err,result){
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

/////notifications
studentRouter.get('/detailnotifications',(req,res)=>{
    client.connect((dberr,dbres)=>{
        if(dberr){
            console.log(dberr)
        }
        else{
            const db = dbres.db('test')
            db.collection('notification').find({}).toArray((err,result)=>{
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

////exam pass
studentRouter.get('/exampass',(req,res)=>{
    client.connect((dberr,dbres)=>{
        if(dberr){
            console.log(dberr)
        }
        else{
            const db = dbres.db('test')
            db.collection('exampass').find({}).toArray((err,result)=>{
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

    /////change faculty
    studentRouter.get('/changeFaculty',(req,res)=>{
        client.connect((dberr,dbres)=>{
            if(dberr){
                console.log(dberr)
            }
            else{
                const db = dbres.db('test')
                db.collection('faculty').find({}).toArray((err,result)=>{
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

module.exports= studentRouter