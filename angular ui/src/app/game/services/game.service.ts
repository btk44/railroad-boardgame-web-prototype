import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient) {}

  url: string = 'https://zuricode.pl/projects/railroadbase/';

  getNewGame(gameId: number){
    return this.http.get(this.url + "gamerolls.php?gameId=" + gameId + "&v=" + (new Date()).getTime());
  }

  gameCompleted(){
    return this.http.post(this.url + "complete.php?v=" + (new Date()).getTime(), "");
  }
}
