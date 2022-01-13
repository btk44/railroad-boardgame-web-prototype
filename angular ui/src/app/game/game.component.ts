import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TileType, PathType, TemplateId } from './common/constants';
import { Tile } from './objects/tile';
import { TileService } from './services/tile.service';
import { MapService } from './services/map.service';
import { PointsService } from './services/points.service';
import { ValidationService } from './services/validation.service';
import { Points } from './objects/points';
import { GameService } from './services/game.service';
import { Neighbour } from './objects/neighbour';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  tileMap: Array<Array<Tile>> = [];
  specialTileTemplates: Array<TemplateId> = [];
  standardTileTemplates: Array<TemplateId> = [];
  availableTiles: Array<Tile> = [];
  specialTiles: Array<Tile> =[];
  usedSpecialTemplates: Array<TemplateId> = [];
  tileSpritePositions: Array<number> = [];
  rollCount: number;
  tileSize: number = 7.8;
  sizeUnit: string = 'vh';
  inProgress: boolean = false;
  gamePoints: Points = new Points();
  loading: boolean = false;
  howToPlay: boolean = false;
  selectedTileInfo: Neighbour;
  userGameId: string = "";
  gameId: string = "";
  fromGameId: boolean = false;

  @ViewChild("userGameIdInput") userGameIdInput: ElementRef;
  
  // ====================================================================================================================================== 
  // ========================================================================================================================= init 
  // ====================================================================================================================================== 

  constructor(private mapService: MapService, private tileService: TileService, 
    private pointsService: PointsService, private validationService: ValidationService, private gameService: GameService) { 
    this.initTilePanels();
    this.initSpritePositions();

    this.initGame();
  }

  initGame(){
    this.availableTiles = [];
    this.inProgress = false;
    this.rollCount = 0;
    this.tileMap = this.mapService.createEmptyMap();
    this.gamePoints.clearPoints();
    this.specialTiles = this.mapService.getSpecialTiles();
    this.usedSpecialTemplates = [];
    this.gameId = "";
    this.userGameId = "";
    this.fromGameId = false;
  }

  initTilePanels(){
    this.standardTileTemplates = [TemplateId.BaseDie1Tile1, TemplateId.BaseDie1Tile2, TemplateId.BaseDie1Tile3, 
                                  TemplateId.BaseDie1Tile4, TemplateId.BaseDie1Tile5, TemplateId.BaseDie1Tile6,
                                  TemplateId.BaseDie2Tile1, TemplateId.BaseDie2Tile2, TemplateId.BaseDie2Tile3];
    this.specialTileTemplates = [TemplateId.BaseSpecialTile1, TemplateId.BaseSpecialTile2, TemplateId.BaseSpecialTile3, 
                                 TemplateId.BaseSpecialTile4, TemplateId.BaseSpecialTile5, TemplateId.BaseSpecialTile6];
  }

  initSpritePositions(){
    this.tileSpritePositions[TemplateId.BaseDie1Tile1] = 1.5;
    this.tileSpritePositions[TemplateId.BaseDie1Tile2] = 4.5;
    this.tileSpritePositions[TemplateId.BaseDie1Tile3] = 7.5;
    this.tileSpritePositions[TemplateId.BaseDie1Tile4] = 10.5;
    this.tileSpritePositions[TemplateId.BaseDie1Tile5] = 13.5;
    this.tileSpritePositions[TemplateId.BaseDie1Tile6] = 16.5;

    this.tileSpritePositions[TemplateId.BaseDie2Tile1] = 19.5;
    this.tileSpritePositions[TemplateId.BaseDie2Tile2] = 22.5;
    this.tileSpritePositions[TemplateId.BaseDie2Tile3] = 25.5;

    this.tileSpritePositions[TemplateId.BaseSpecialTile1] = 28.5;
    this.tileSpritePositions[TemplateId.BaseSpecialTile2] = 31.5;
    this.tileSpritePositions[TemplateId.BaseSpecialTile3] = 34.5;
    this.tileSpritePositions[TemplateId.BaseSpecialTile4] = 37.5;
    this.tileSpritePositions[TemplateId.BaseSpecialTile5] = 40.5;
    this.tileSpritePositions[TemplateId.BaseSpecialTile6] = 43.5;
  }

  ngOnInit() { }

  // ====================================================================================================================================== 
  // ========================================================================================================================== events 
  // ====================================================================================================================================== 

  onTileDiscard(tile: Tile){
    if(confirm("Do you really want to discard?")) {
      this.availableTiles = this.availableTiles.filter(t => t.id !== tile.id);
    }
  }

  onTileSelection(tile: Tile, x: number, y: number){
    if(!tile){
      if(this.selectedTileInfo){
        let sourceX = this.selectedTileInfo.x ? this.selectedTileInfo.x : -1,
            sourceY = this.selectedTileInfo.y ? this.selectedTileInfo.y : -1;
        this.handleTileMove(this.selectedTileInfo.tile.id, sourceX, sourceY, x, y);
      }

      this.clearTileSelection();
      return;
    } 
      
    if(this.selectedTileInfo && this.selectedTileInfo.tile.id === tile.id){
      this.clearTileSelection();
      return;
    }

    this.clearTileSelection();
   
    if(tile.roundNumber === this.rollCount || tile.roundNumber === 0){
      this.selectedTileInfo = new Neighbour(tile, null, x, y);
    }
  }

  onDragStart(event, tile: Tile, x: number, y: number) {
    this.clearTileSelection();

    if(tile.roundNumber === 0 || tile.roundNumber === this.rollCount){
      event.dataTransfer.setData('text', `${tile.id};${x ? x : -1};${y ? y : -1}`); // 'text' -> because of IE
    } else {
      event.preventDefault();
    }
  }

  onDragOver(event, x: number, y: number){
    let tile = this.tileMap[x][y];
    if(!tile){
      event.preventDefault();
    }
  }

  onDrop(event, x: number, y: number){
    let tile = this.tileMap[x][y];
    if(!tile){
      event.preventDefault();
      let sourceTileInfo = event.dataTransfer.getData('text').split(';'),
          tileId = sourceTileInfo[0],
          sourceX = parseInt(sourceTileInfo[1]),
          sourceY = parseInt(sourceTileInfo[2]);

      this.handleTileMove(tileId, sourceX, sourceY, x, y);
    }
  }

  onRotate(event, x: number, y: number){
    event.stopPropagation();
    this.clearTileSelection();
    let tile = this.tileMap[x][y];
    if(tile && tile.type === TileType.Normal){
      this.tileService.rotate(tile, 1);
    }
  }

  onFlip(event, x:number, y: number){
    event.stopPropagation();
    this.clearTileSelection();
    let tile = this.tileMap[x][y];
    if(tile && tile.type === TileType.Normal){
      this.tileService.flipHorizontally(tile);
    }
  }

  onDelete(event, x: number, y: number){ 
    event.stopPropagation();
    this.clearTileSelection();
    let tile = this.tileMap[x][y];
    this.availableTiles.filter(at => at.id === tile.id)[0].inUse = false;
    if(this.specialTileTemplates.indexOf(tile.templateId) !== -1){
      this.availableTiles.filter(t => this.specialTileTemplates.indexOf(t.templateId) !== -1).forEach(t => t.inUse = false);
      this.usedSpecialTemplates.pop();
    }
    this.tileMap[x][y] = null;
  }

  onTutorialOpen(){
    this.howToPlay = true;
  }

  onTutorialClose(){
    this.howToPlay = false;
  }

  onNewGame(id?: number){
    this.loading = true;
    this.mapService.setRolls();
    this.gameService.getNewGame(id || 0).subscribe(
      (response: any) => { 
        this.mapService.setRolls(response.tiles.toString());
        this.gameId = '#' + response.gameId;
        this.inProgress = true;
        this.onNextRoll(); 
        this.loading = false;
      },
      error => {
        this.inProgress = true;
        this.onNextRoll(); 
        this.loading = false;
      });
  }

  onNewGameFromId(){
    if(this.fromGameId){
      let gameId = parseInt(this.userGameId.replace('#', ''));
      gameId = !isNaN(gameId) && Number.isInteger(gameId) && gameId > 0 ? gameId : 0;
      this.onNewGame(gameId);
    } else {
      this.fromGameId = true;
      setTimeout(() => {
        if(this.userGameIdInput){
          this.userGameIdInput.nativeElement.focus(); 
        }
      },100);
    }
  }

  onGameIdKey(event){
    if (event.keyCode === 13) {
      this.onNewGameFromId();
    }
  }

  onNextRoll(){
    this.clearTileSelection();
    if(this.rollCount === 0 || this.validationService.valildateNewTiles(this.tileMap, this.rollCount)){
      this.gamePoints = this.pointsService.calculatePoints(this.tileMap);
      this.rollCount++;
      if(this.rollCount >= 8){
        this.availableTiles = [];
        this.gameService.gameCompleted().subscribe();
      } else{
        this.specialTiles = this.usedSpecialTemplates.length >= 3 ? [] : this.specialTiles.filter(tile => this.usedSpecialTemplates.indexOf(tile.templateId) === -1);
        this.availableTiles = this.mapService.getRollTiles(this.rollCount);
        this.availableTiles = this.availableTiles.concat(this.specialTiles);
        this.availableTiles.forEach(t => t.inUse = false);
      }
    }
  }

  onQuit(){
    if(confirm("Do you really want to quit?")) {
      this.initGame();
    }
  }

  // ====================================================================================================================================== 
  // ========================================================================================================================= helpers 
  // ======================================================================================================================================  

  handleTileMove(tileId: string, sourceX: number, sourceY: number, destinationX: number, destinationY: number){
    if(sourceX > 0 && sourceY > 0){
      this.tileMap[destinationX][destinationY] = this.tileMap[sourceX][sourceY];
      this.tileMap[sourceX][sourceY] = null;
    } else {
      let tileToUse =  this.availableTiles.filter(t => t.id === tileId)[0];
      let copy = this.tileService.copy(tileToUse);

      tileToUse.inUse = true;
      if(this.specialTileTemplates.indexOf(tileToUse.templateId) !== -1){
        this.availableTiles.filter(t => this.specialTileTemplates.indexOf(t.templateId) !== -1).forEach(t => t.inUse = true);
        this.usedSpecialTemplates.push(tileToUse.templateId);
      }

      this.tileMap[destinationX][destinationY] = copy;
      this.tileMap[destinationX][destinationY].roundNumber = this.rollCount;
    }
  }

  clearTileSelection(){
    this.selectedTileInfo = null;
  }

  // ====================================================================================================================================== 
  // ========================================================================================================================= ifs 
  // ====================================================================================================================================== 


  getAvailableTiles(templateId: TemplateId){
    return this.availableTiles.filter(tile => tile.templateId === templateId && !tile.inUse);
  }

  isAvailable(templateId: TemplateId){
    return this.availableTiles.some(tile => tile.templateId === templateId && !tile.inUse);
  }

  isTileDeletable(x: number, y: number): boolean{
    let tile = this.tileMap[x][y];
    return tile && tile.type !== TileType.Edge && tile.type !== TileType.Entrance;
  }

  getRollButtonText(){
    return this.rollCount < 7 ? 'Next round' : 'Count points';
  }

  isNextRollBlocked(){
    return this.availableTiles.filter(t => this.specialTileTemplates.indexOf(t.templateId) === -1 && !t.inUse).length;
  }

  showTileActions(tile: Tile){
    return !!tile && tile.type === TileType.Normal && tile.roundNumber === this.rollCount;
  }

  // ====================================================================================================================================== 
  // ========================================================================================================================= styling 
  // ======================================================================================================================================  

  getBackgroundPosition(templateId: TemplateId){
    return `-${templateId ? this.tileSpritePositions[templateId]*this.tileSize : 0}vh`;
  }

  getTileBackgroundPosition(tile: Tile){
    if(!tile){
      return 'vh';
    }

    let position = this.tileSpritePositions[tile.templateId]*this.tileSize + (tile.flip ? 1.5*this.tileSize : 0);

    return `-${position}vh`;
  }

  getAvailableTileClass(tile: Tile){
    let cssClass = 'tile panel-tile available-tile';

    if(this.selectedTileInfo && this.selectedTileInfo.tile.id === tile.id){
      cssClass = `${cssClass} selected`;
    }

    return cssClass;
  }

  getTileClass(tile: Tile, x: number, y: number){
    let cssClass = 'tile map-tile';

    if(x >= 3 && x <= 5 && y >= 3 && y <= 5){
      cssClass = `${cssClass} central-tile`;
    }

    if(!tile){
      return cssClass = `${cssClass} empty-tile`;
    }

    if(tile.type !== TileType.Normal){
      if(y === 0 || y === 8){
        cssClass = `${cssClass} vertical-edge-tile`;
      }
      
      if(x === 0 || x === 8){
        cssClass = `${cssClass} horizontal-edge-tile`;
      }

      if(tile.type === TileType.Edge){
        cssClass = `${cssClass} edge-tile`;
      }

      if(tile.type === TileType.Entrance){
        if(tile.tracks[0].paths[0].type === PathType.Highway){
          cssClass = `${cssClass} highway-entrance`;
        }

        if(tile.tracks[0].paths[0].type === PathType.Railway){
          cssClass = `${cssClass} railway-entrance`;
        }

        switch(tile.rotation){
          case 0: cssClass = `${cssClass} rotation-0`; break;
          case 1: cssClass = `${cssClass} rotation-90`; break;
          case 2: cssClass = `${cssClass} rotation-180`; break;
          case 3: cssClass = `${cssClass} rotation-270`; break;
        }  
      }
    }

    if(tile.type === TileType.Normal){   
      switch(tile.rotation){
        case 0: cssClass = `${cssClass} rotation-0`; break;
        case 1: cssClass = `${cssClass} rotation-90`; break;
        case 2: cssClass = `${cssClass} rotation-180`; break;
        case 3: cssClass = `${cssClass} rotation-270`; break;
      }

      if(!tile.isValid){
        cssClass = `${cssClass} incorrect`;
      }

      
      if(this.selectedTileInfo && this.selectedTileInfo.tile.id === tile.id){
        cssClass = `${cssClass} selected`;
      }

      if(tile.roundNumber === this.rollCount){
        cssClass = `${cssClass} current-tile`;
      }
    }

    return cssClass;
  }
}
