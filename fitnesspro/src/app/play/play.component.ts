import { Component, OnInit } from '@angular/core';
import { Http } from "@angular/http";
import { Room, Player, Quote, Workout, ChatRoom, Routine, Searchbar } from '../models/game';
import { GameService } from '../models/game.service';
import { Router } from '@angular/router';
import { Image } from '../widgets/picture-chooser/picture-chooser.component'

declare const FB: any;
declare const angular: any;
declare var $:any;

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

    room = new Room();
    chatRoom = new ChatRoom();
    searchBar = new Searchbar();
    me: Player;
    fbImages: Image[];
  
    constructor(private http: Http, public game: GameService, private router: Router) { }
    
    ngOnInit() {
        if(this.game.me == null){
            this.router.navigate(['/login']);
        }
        this.me = this.game.me;
        $("#search-bar").select2();
        setInterval(()=> this.update(), 1000)
    }

    update(){
        this.http.get(this.game.apiRoot + "/game/room").subscribe( data =>{
            this.room = data.json();
        });
        this.http.get(this.game.apiRoot + "/game/chatRoom").subscribe( data =>{
            this.chatRoom = data.json();
        });
    }

    public params = {
    hl: 'en',
    ds: 'yt',
    xhr: 't',
    client: 'youtube'
    };
    public url = 'https://suggestqueries.google.com/complete/search';
    
    public url2 = JSON.parse(JSON.stringify(this.room.workouts.map(a => a.text)));
    public query = "";
 
    handleResult2Selected (result) {
        this.query = result;
        this.pickWorkout3()
    }
    
    submitMiles(e: MouseEvent, i: number){
        e.preventDefault();
        this.http.post(this.game.apiRoot + "/game/room/player", {}).subscribe();
    }
    
    sendMsg(e: MouseEvent, player: Player){
        const msg = prompt("Enter your message", "hello");
        const data = { text: msg, player: this.me };
        this.http.post(this.game.apiRoot + "/game/chatRoom/messages", data).subscribe(res=>{
            this.chatRoom.messages.push( res.json() );
        })
    }

    flipPicture(e: MouseEvent){
        e.preventDefault();
        this.http.post(this.game.apiRoot + "/game/room/picture", {}).subscribe();
    }
    
    submitQuote(e: MouseEvent, quote: Quote, i: number){
        e.preventDefault();
        const data = { text: quote.text, player: this.me.name };
        this.http.post(this.game.apiRoot + "/game/room/quotes", data).subscribe(res=>{
            this.me.quotes.splice(i, 1);
            this.me.quotes.push( res.json() );            
        })
    }
    
    pickWorkout(e: MouseEvent, workout: Workout, i: number, player: Player){
        e.preventDefault();
        const setTime = prompt("What time do you want to do this exercise?", "12pm");
        workout.time = setTime;
        this.me.workouts.push(workout);
    }
    
    pickWorkout2(e: MouseEvent, player: Player){
        e.preventDefault();
        const data = $("#search-bar").select2("val");
        const setTime = prompt("What time do you want to do this exercise?", "12pm");
        const workout = { text: data, chosen: true, player: player.name, time: setTime };
        this.me.workouts.push(workout);
    }
    pickWorkout3(){
        const data = this.query;
        const player = this.myRoutine();
        const setTime = prompt("What time do you want to do this exercise?", "12pm");
        const workout = { text: data, chosen: true, player: player.name, time: setTime };
        this.me.workouts.push(workout);
    }
    
    removeWorkout(e: MouseEvent, workout: Workout){
        e.preventDefault();
        const index = this.me.workouts.indexOf(workout);
        this.me.workouts.splice(index, 1);
    }
    
    showRoutine(e: MouseEvent){
        e.preventDefault();
        const switcheroo = this.me.showRoutine;
        this.me.showRoutine = !switcheroo;
        const rout = { player: this.me, workouts: this.me.workouts };
        const data = { showRoutine: this.me.showRoutine, routine: rout };
        this.http.post(this.game.apiRoot + "/game/room/routines", data).subscribe();
    }
    
    submitWorkout(e: MouseEvent, workout: Workout, i: number){
        e.preventDefault();
        const data = { text: workout.text, player: this.me.name };
        this.http.post(this.game.apiRoot + "/game/room/workouts", data).subscribe(res=>{
            this.me.workouts.splice(i, 1);
            this.me.workouts.push( res.json() );            
        })
    }
    
    chooseQuote(e: MouseEvent, i: number){
        e.preventDefault();
        this.http.post(this.game.apiRoot + "/game/room/quotes/choose", { i: i }).subscribe(res=>{
        })
    }

    chosenQuote = ()=> this.room.quotes.find(x=> x.chosen);
    myQuote = ()=> this.room.quotes.find(x=> x.player ==this.me.name);
    myWorkout = ()=> this.room.workouts.find(x=> x.player ==this.me.name);
    myRoutine = ()=> this.room.players.find(x=> x.name == this.me.name);
    
    showFBPictures(e: MouseEvent){
        e.preventDefault();
        FB.api('/me/photos?fields=album,picture,images', (response: any) => {
            console.log(response);
            this.fbImages = response.data.map((x: any )=> ({ id: x.id, src: x.picture, link: x.images[0].source }) )
        });
    }
    
    formatState (state: any) {
        if (!state.id) {
            return state.text;
        }
        var baseUrl = "/user/pages/images/flags";
        var $state = $("<span>" + state.text + "</span>");
        return $state;
    }
    
    
    
        
}
