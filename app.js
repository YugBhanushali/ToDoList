const express=require("express");
const bodyParser=require("body-parser");
const MongoClient = require('mongodb').MongoClient
const { query } = require("express");
const mongoose = require("mongoose");
const _=require("lodash");

const app1=express();
app1.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-yug:Spartans9090%40@cluster0.qjntsn9.mongodb.net/todolistDB");

const itemsSchema=new mongoose.Schema({
    name:String
});

const listSchema=new mongoose.Schema({
    name:String,
    items:[itemsSchema]
})

const Item=mongoose.model("Item",itemsSchema);
const List=mongoose.model("List",listSchema);

app1.use(bodyParser.urlencoded({extended: true}));
app1.set("view engine","ejs");

// var arrayNewItems=["Buy food","Cook food","Eat Food"];
// var workList=[];
const item1=new Item({
    name:"Buy food"
});

const item2=new Item({
    name:"Cook food"
});

const item3=new Item({
    name:"Eat food"
});

const defaultItems=[item1,item2,item3];


// console.log(date.getDay());
app1.get("/",function(req,res){
    
    

    Item.find(function(err,item){
        if(item.length===0){
            Item.insertMany(defaultItems,function(err){
                    if(err){
                        console.log("err");
                    }
                    else{
                        console.log("Success");
                    }
            })
        }
        else{
            res.render("list",{
                listTitle:"Home list",
                newTask:item
            });
        }
    });  
})

app1.post("/",function(req,res){
    var Itemname=req.body.task;
    var listName=req.body.list;
    
    const item4=new Item({
        name:Itemname
    });

    if(listName==="Home list"){
        item4.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName},function(err,result){
            result.items.push(item4);
            result.save();
        });
        res.redirect("/"+listName);
    }
});

app1.post("/delete",function(req,res){
   
    var idOfItem=req.body.deletedItem;
    var listTitle1=req.body.titleOflist;
    console.log(listTitle1);

    if(listTitle1==="Home list"){

        Item.deleteOne({_id:idOfItem},function(err){
            console.log("Successfully deleted");
        });
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name:listTitle1},{$pull : {items : {_id:idOfItem}}},function(err){
            console.log("Hi");
        })
        res.redirect("/"+listTitle1);
    }

});

app1.get("/:typesOfList",function(req,res){
    var customListName=_.capitalize(req.params.typesOfList);

    List.findOne({name:customListName},function(err,result){
        // console.log(result);
        if(result===null){
            // if does not exist
            List.create({
                name:customListName,
                items:defaultItems,
            });
            res.redirect("/"+customListName);
        }
        else{
            res.render("list",{
                listTitle:customListName,
                newTask:result.items
            });
        }   
    });
})

app1.get("/work",function(req,res){
    res.render("list",{
        listTitle : "Work list",
        newTask: workList,
    });
});

app1.get("/about",function (req,res) {
    res.render("about");
})


app1.listen(4000,function(){
    console.log("server has started");
});