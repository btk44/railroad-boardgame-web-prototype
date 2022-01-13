import { Injectable } from '@angular/core';
import { Tile } from '../objects/tile';
import { TemplateId } from '../common/constants';
import { TileService } from './tile.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private roundRolls: Array<Array<number>>;

  constructor(private tileService: TileService) { } 

  setRolls(rolls?: string){
    this.roundRolls = null;
    
    if(rolls){
      this.roundRolls = new Array<Array<number>>();
      let rounds = rolls.split(';').filter(value => value);
      rounds.forEach((round, index) => {
        this.roundRolls[index] = round.split(',').map(value => parseInt(value));
      });
    }
  }

  createEmptyMap(): Array<Array<Tile>> {
    let tileMap = Array<Array<Tile>>();

    for(let x = 0; x < 9; x++){
      tileMap[x] = [null, null, null, null, null, null, null, null, null];
      for(let y = 0; y < 9; y++){
        if (x === 0 || x === 8 || y === 0 || y === 8){
          tileMap[x][y] = this.tileService.createTile(TemplateId.EdgeTile, this.getIdFromXY(x,y), 0);
        }
      }
    }
    
    this.createEntrances(tileMap);

    return tileMap;
  }

  getSpecialTiles() : Array<Tile>{
    return [
        this.tileService.createTile(TemplateId.BaseSpecialTile1, "special_1", 0),
        this.tileService.createTile(TemplateId.BaseSpecialTile2, "special_2", 0),
        this.tileService.createTile(TemplateId.BaseSpecialTile3, "special_3", 0),
        this.tileService.createTile(TemplateId.BaseSpecialTile4, "special_4", 0),
        this.tileService.createTile(TemplateId.BaseSpecialTile5, "special_5", 0),
        this.tileService.createTile(TemplateId.BaseSpecialTile6, "special_6", 0)
    ]; 
}

  getRollTiles(rollIndex: number): Array<Tile>
  {
      let standardTileIndex1 = this.roundRolls ? this.roundRolls[rollIndex-1][0] : Math.floor(Math.random()*6),
          standardTileIndex2 = this.roundRolls ? this.roundRolls[rollIndex-1][1] : Math.floor(Math.random()*6),
          standardTileIndex3 = this.roundRolls ? this.roundRolls[rollIndex-1][2] : Math.floor(Math.random()*6),
          standardTileIndex4 = this.roundRolls ? this.roundRolls[rollIndex-1][3] : Math.floor(Math.random()*3) + 6,
          templates = [
                        TemplateId.BaseDie1Tile1, TemplateId.BaseDie1Tile2, TemplateId.BaseDie1Tile3, TemplateId.BaseDie1Tile4, TemplateId.BaseDie1Tile5, TemplateId.BaseDie1Tile6,
                        TemplateId.BaseDie2Tile1, TemplateId.BaseDie2Tile2, TemplateId.BaseDie2Tile3
          ];

      return [
          this.tileService.createTile(templates[standardTileIndex1], `roll${rollIndex}_1`, 0),
          this.tileService.createTile(templates[standardTileIndex2], `roll${rollIndex}_2`, 0),
          this.tileService.createTile(templates[standardTileIndex3], `roll${rollIndex}_3`, 0),
          this.tileService.createTile(templates[standardTileIndex4], `roll${rollIndex}_4`, 0)
      ];       
  }

  private createEntrances(tileMap: Array<Array<Tile>>){
    tileMap[0][2] = this.tileService.createTile(TemplateId.EntranceHighwayTile, this.getIdFromXY(0,2), 0);
    tileMap[0][4] = this.tileService.createTile(TemplateId.EntranceRailwayTile, this.getIdFromXY(0,4), 0);
    tileMap[0][6] = this.tileService.createTile(TemplateId.EntranceHighwayTile, this.getIdFromXY(0,6), 0);

    tileMap[2][0] = this.tileService.createTile(TemplateId.EntranceRailwayTile, this.getIdFromXY(2,0), 3);
    tileMap[2][8] = this.tileService.createTile(TemplateId.EntranceRailwayTile, this.getIdFromXY(2,8), 1);

    tileMap[4][0] = this.tileService.createTile(TemplateId.EntranceHighwayTile, this.getIdFromXY(4,0), 3);
    tileMap[4][8] = this.tileService.createTile(TemplateId.EntranceHighwayTile, this.getIdFromXY(4,8), 1);
    
    tileMap[6][0] = this.tileService.createTile(TemplateId.EntranceRailwayTile, this.getIdFromXY(6,0), 3);
    tileMap[6][8] = this.tileService.createTile(TemplateId.EntranceRailwayTile, this.getIdFromXY(6,8), 1);
    
    tileMap[8][2] = this.tileService.createTile(TemplateId.EntranceHighwayTile, this.getIdFromXY(8,2), 2);
    tileMap[8][4] = this.tileService.createTile(TemplateId.EntranceRailwayTile, this.getIdFromXY(8,4), 2);
    tileMap[8][6] = this.tileService.createTile(TemplateId.EntranceHighwayTile, this.getIdFromXY(8,6), 2);
  }

  private getIdFromXY(x: number, y: number) : string{
    return `${x}_${y}`;
  }
}
