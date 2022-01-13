import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameService } from './game/services/game.service';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TileService } from './game/services/tile.service';
import { MapService } from './game/services/map.service';
import { PointsService } from './game/services/points.service';
import { ValidationService } from './game/services/validation.service';
import { FormsModule } from '@angular/forms';
 
@NgModule({
  declarations: [
    AppComponent,
    GameComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
    DragDropModule,
    FormsModule
  ],
  providers: [
    GameService,
    TileService,
    MapService,
    PointsService,
    ValidationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
