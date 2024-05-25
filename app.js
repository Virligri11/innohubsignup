var express = require('express');
var app = express();
// var port = 1857;
app.set("view engine","ejs");
app.set("view engine","pug");
const jquery = require('jquery');
app.use(express.static(__dirname + '/public'))

var path = require('path') 
var bodyParser = require('body-parser')
var assert = require('assert')
var fs = require("fs");
const { time, error } = require('console');

var CronJob = require('cron').CronJob;

var nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const $ = jquery



app.get('/', function(req, res) {
    res.render("index.ejs");
})
app.get('/signup', function(req, res) {
    res.render("recreatesignup.ejs" ,{message:""});
})

app.get('/submit', function(req, res){
    var Name = req.query.name;
    var email = req.query.email;
    var time = req.query.Block;
    var classname = req.query.class;
    var purpose = req.query.Purpose;
    var addinfo = req.query.additioninformation;
    var date = req.query.getdate;
    var fin = date.split("/")
    date = fin[2]+"-"+fin[0]+"-"+fin[1];
    // console.log(date);
    var totaltime = "";
    for(var  i =0;i<time.length;i++){
        totaltime+=time[i]+", "
    }
    var pur="";
    pur = purpose;
    console.log(pur)
    if(date == "" || date=="undefined" || date=="undefined--undefined"){
        // console.log("error")
       res.render("recreatesignup.ejs",{message:"date error"})
    }
    else{
    var findrepeat = 'select count(1) from records where name = ? and email = ? and time = ? and date = ?';
        connection.query(findrepeat,[Name,email,time[0],date],(err,result)=>{
            if(err){
                console.log(err.message);
            }
            var testn = (JSON.parse(JSON.stringify(result)))
            // // console.log(testn);
            var whetherrepeat =  testn[0]['count(1)'];
            if(whetherrepeat > 0){
                res.render("submit.ejs",{teachername:Name,classs:classname,date:date,timePeriod:time});
            }
            else{
                console.log(Name,email,time,classname,purpose,addinfo,date);
                for(var i  = 0;i<time.length;i++){
                    var k = time[i];
                    // console.log(typeof k)
                    const insert = "insert into records(name,email,time,classname,purpose,addinfo,date) VALUES(?,?,?,?,?,?,?);"
                    connection.query(insert,[Name,email,k,classname,pur,addinfo,date],(err,results)=>{
                        if(err){
                            console.log(err.message);
                        }
                    }) 
                }
                var sendinfomation = Name+" has signup the innohub at "+date+" "+totaltime+" for "+ classname+"\nPurpose: "+pur+"\n Add information:"+addinfo;
                var mailOptions = {
                    from: 'signup-notification@ncpachina.org',
                    to: email,
                    cc:'thorn@ncpachina.org',
                    subject: 'Innohub signup',
                    text: sendinfomation,
                }                                                                    
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error.message)
                    }
                });
                res.render("submit.ejs",{teachername:Name,classs:classname,date:date,timePeriod:totaltime})
            }
        })
    }
});

//ALTER TABLE records MODIFY COLUMN purpose VARCHAR(64);
// create table records(name VARCHAR(32),email VARCHAR(32),time VARCHAR(24), classname VARCHAR(24), purpose VARCHAR(24), addinfo Text,date VARCHAR(24));



app.get("/total",function(req,res){
    var datadate = 'select * from records order by date desc;';
    var n=new Date();
    var date = n.getFullYear()+"-"+(n.getMonth()+1<10?"0"+n.getMonth()+1:n.getMonth()+1)+"-"+(n.getDate()>19?"0"+n.getDate:n.getDate());
    // console.log(date);
    connection.query(datadate,date,(err,result)=>{
        if(err){
            console.log(err.message);
        }
        var gettot = (JSON.parse(JSON.stringify(result)))
        res.render("totalpanel.ejs",{jsondata:JSON.stringify(gettot)})
    });
})

app.get('/cancel', function(req, res) {
    res.render("cancel.ejs",{message:""});
})

app.get('/cancelsuccess', function(req, res) {
    var date = req.query.date;
    var fin = date.split("/")
    date = fin[2]+"-"+fin[0]+"-"+fin[1];
    var timeperiod = req.query.timeperiod;
    var teachername = req.query.teachername.trim();
    var classname=req.query.classname.trim();
    var whethersignup;

    var totaltime =""
    for(var i = 0;i<timeperiod.length;i++){
        totaltime+=timeperiod[i]+",";
    }
    for(var i =0;i<timeperiod.length;i++){
        var k = timeperiod[i]
        var select = 'SELECT count(1) FROM records where date = ? and time = ? and name = ? and classname = ?;';
        connection.query(select,[date,k,teachername.toLowerCase(),classname.toLowerCase()],(err,result)=>{
            if(err) {
                res.render("error.ejs",{message:"Please check the date and the name"})
            }
            var testn = (JSON.parse(JSON.stringify(result)))
            console.log(testn[0]['count(1)'])
            whethersignup +=  testn[0]['count(1)'];
        });
        // console.log(whethersignup)
    }
    console.log(whethersignup)
    if(whethersignup == 0){
        res.render("error.ejs",{message:"You have not sign up the page or have error information"})
    }
    else{
        for(var i = 0;i<timeperiod.length;i++){
            const d = 'delete from records where date = ? and time = ? and name = ? and classname = ?';
            connection.query(d,[date,timeperiod[i],teachername.toLowerCase(),classname.toLowerCase()],(err,results)=>{
                if(err) {console.log(err.message)}
            });
        }
        res.render("cancelsuccess.ejs", {teachername:teachername,classs:classname,date:date,timePeriod:totaltime});
    }
});

app.get('/test',function(req,res){
    res.render('test.ejs')
})

var server = app.listen(8081, function () {//应用启动端口为8081

    var host = "localhost";
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

});
//TST create by Millie Pu3


// student@192.168.123.27

// fin5)SDK


