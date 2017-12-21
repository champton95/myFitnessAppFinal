export class Quote {
    text: string;
    chosen: boolean = false;
    player: string;
}

export class Workout {
    text: string;
    chosen: boolean = false;
    player: string;
    time: string;
}

export class Message {
    text: string;
    player: Player;
}

export class ChatRoom {
    messages: Message[] = [];
}

export class Routine {
    player: Player;
    workouts: Workout[] = [];
}

export class Player {
    id: number;
    name: string = "";
    quotes: Quote[] = [];
    workouts: Workout[] = [];
    score: number = 0;
    showRoutine: boolean = false;
    searchBar: Searchbar;
}

export class Room {
    players: Player[] = [new Player(), new Player()];
    dealer: number;
    picture: string;
    quotes: Quote[] = [];
    workouts: Workout[] = [];
    routines: Routine[] = [];
}

export class Searchbar {
    workouts: Workout[] = [];
}