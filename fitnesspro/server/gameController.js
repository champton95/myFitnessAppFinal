const express = require("express");
const game = require("./gameObject");

const router = express.Router();

router
    .get("/pictures", (req, res) => res.send(game.pictures))
    .get("/quote", (req, res) => res.send(game.getNextQuote()))
    .get("/workout", (req, res) => res.send(game.getNextWorkout()))
    .get("/quotes", (req, res) => res.send( Array(7).fill().map( () => game.getNextQuote() )))
    .get("/workouts", (req, res) => res.send( Array(0).fill().map( () => game.getNextWorkout() )))
    .get("/chatRoom", (req, res) => res.send(game.chatRoom))
    .get("/room", (req, res) => res.send(game.room))
    .post("/chatRoom/messages", (req, res) => {
        game.chatRoom.messages.push(req.body);
        res.status(201).send();
    })
    .post("/room/routines", (req, res) => {
        const index = game.room.routines.indexOf(req.body.routine)
        if(req.body.showRoutine){
            if(index >= 0){
                game.room.routines.splice(index, 1);
            }
            game.room.routines.push(req.body.routine);
            res.status(201).send(game.room.routines);
        }else{
            game.room.routines.splice(index, 1);
            res.status(201).send(game.room.routines);
        }
    })
    .post("/room/picture",(req, res) => {
        game.room.picture = game.getNextPicture();
        game.room.quotes = [];
        game.room.workouts = [];
        res.status(201).send(game.room.picture);
    })
    .post("/room/quotes",(req, res) => {
        game.room.quotes.push(req.body);
        res.status(201).send(game.getNextQuote());
    })
    .post("/room/workouts",(req, res) => {
        game.room.workouts.push(req.body);
        res.status(201).send(game.getNextWorkout());
    })
    .post("/room/quotes/choose",(req, res) => {
        const chosen = game.room.quotes[req.body.i];
        chosen.chosen = true;
        game.room.dealer = (game.room.dealer + 1) % game.room.players.length;
        res.status(201).send(chosen);
    })
    .post("/room/players",(req, res) => {
        if(req.body.password == "password"){
            let player = game.room.players.find(x=> x.fbid == req.body.fbid);
            if(!player){
                player = { name: req.body.name, id: game.room.players.length, fbid: req.body.fbid, picture: req.body.picture };
                game.room.players.push(player);                
            }
            res.status(201).send(player);
        }else{
            res.status(403).send("Invalid Password");
        }
    })


module.exports.router = router;