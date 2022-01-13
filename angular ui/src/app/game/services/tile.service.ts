import { Injectable } from '@angular/core';
import { Side, TemplateId, TileType, PathType } from '../common/constants';
import { Tile } from '../objects/tile';
import { Track } from '../objects/track';
import { Path } from '../objects/path';

@Injectable({
  providedIn: 'root'
})
export class TileService {

  private rotationMap: Array<Side>;
  private templateTiles: Array<Tile>;

  constructor() {
    this.templateTiles = new Array<Tile>();
    this.createDie1Tiles();
    this.createDie2Tiles();  
    this.createSpecialTiles();
    this.createExternalTiles();
    this.initRotationMap();
  }

  private createDie1Tiles(){
    this.templateTiles[TemplateId.BaseDie1Tile1] = new Tile(TemplateId.BaseDie1Tile1, '', TileType.Normal, 
            [new Track('', [new Path('', PathType.Railway,Side.Top), 
                            new Path('', PathType.Railway,Side.Left)])]);

    this.templateTiles[TemplateId.BaseDie1Tile2] = new Tile(TemplateId.BaseDie1Tile2, '', TileType.Normal, 
            [new Track('', [new Path('', PathType.Railway,Side.Top), 
                            new Path('', PathType.Railway,Side.Right), 
                            new Path('', PathType.Railway,Side.Left)])]);

    this.templateTiles[TemplateId.BaseDie1Tile3] = new Tile(TemplateId.BaseDie1Tile3, '', TileType.Normal, 
            [new Track('', [new Path('', PathType.Railway,Side.Top), 
                            new Path('', PathType.Railway,Side.Bottom)])]);

    this.templateTiles[TemplateId.BaseDie1Tile4] = new Tile(TemplateId.BaseDie1Tile4, '', TileType.Normal, 
            [new Track('', [new Path('', PathType.Highway,Side.Top), 
                            new Path('', PathType.Highway,Side.Left)])]);

    this.templateTiles[TemplateId.BaseDie1Tile5] = new Tile(TemplateId.BaseDie1Tile5, '', TileType.Normal,  
            [new Track('', [new Path('', PathType.Highway,Side.Top), 
                            new Path('', PathType.Highway,Side.Right), 
                            new Path('', PathType.Highway,Side.Left)])]);

    this.templateTiles[TemplateId.BaseDie1Tile6] = new Tile(TemplateId.BaseDie1Tile6, '', TileType.Normal, 
            [new Track('', [new Path('', PathType.Highway,Side.Top), 
                            new Path('', PathType.Highway,Side.Bottom)])]); 
  }

  private createDie2Tiles(){
    this.templateTiles[TemplateId.BaseDie2Tile1] = new Tile(TemplateId.BaseDie2Tile1, '', TileType.Normal, 
            [new Track('', [new Path('', PathType.Highway,Side.Top), 
                            new Path('', PathType.Highway,Side.Bottom)]),
             new Track('', [new Path('', PathType.Railway,Side.Right),
                            new Path('', PathType.Railway,Side.Left)])]);

    this.templateTiles[TemplateId.BaseDie2Tile2] = new Tile(TemplateId.BaseDie2Tile2, '', TileType.Normal, 
            [new Track('', [new Path('', PathType.Railway,Side.Top), 
                            new Path('', PathType.Highway,Side.Bottom)])]);

    this.templateTiles[TemplateId.BaseDie2Tile3] = new Tile(TemplateId.BaseDie2Tile3, '', TileType.Normal, 
            [new Track('', [new Path('', PathType.Railway,Side.Top), 
                            new Path('', PathType.Highway,Side.Left)])]);                                                                                                                                                                                      
  }

  private createSpecialTiles(){
    this.templateTiles[TemplateId.BaseSpecialTile1] = new Tile(TemplateId.BaseSpecialTile1, '', TileType.Normal, 
          [new Track('', [new Path('', PathType.Highway,Side.Top), 
                          new Path('', PathType.Highway,Side.Right), 
                          new Path('', PathType.Railway,Side.Bottom),
                          new Path('', PathType.Highway,Side.Left)])]);   

    this.templateTiles[TemplateId.BaseSpecialTile2] = new Tile(TemplateId.BaseSpecialTile2, '', TileType.Normal, 
          [new Track('', [new Path('', PathType.Highway,Side.Top), 
                          new Path('', PathType.Railway,Side.Right), 
                          new Path('', PathType.Railway,Side.Bottom),
                          new Path('', PathType.Railway,Side.Left)])]);

    this.templateTiles[TemplateId.BaseSpecialTile3] = new Tile(TemplateId.BaseSpecialTile3, '', TileType.Normal,
          [new Track('', [new Path('', PathType.Highway,Side.Top), 
                          new Path('', PathType.Highway,Side.Right), 
                          new Path('', PathType.Highway,Side.Bottom),
                          new Path('', PathType.Highway,Side.Left)])]);  

    this.templateTiles[TemplateId.BaseSpecialTile4] = new Tile(TemplateId.BaseSpecialTile4, '', TileType.Normal, 
          [new Track('', [new Path('', PathType.Railway,Side.Top), 
                          new Path('', PathType.Railway,Side.Right), 
                          new Path('', PathType.Railway,Side.Bottom),
                          new Path('', PathType.Railway,Side.Left)])]); 

    this.templateTiles[TemplateId.BaseSpecialTile5] = new Tile(TemplateId.BaseSpecialTile5, '', TileType.Normal, 
          [new Track('', [new Path('', PathType.Highway,Side.Top), 
                          new Path('', PathType.Railway,Side.Right), 
                          new Path('', PathType.Railway,Side.Bottom),
                          new Path('', PathType.Highway,Side.Left)])]);  

    this.templateTiles[TemplateId.BaseSpecialTile6] = new Tile(TemplateId.BaseSpecialTile6,'', TileType.Normal, 
          [new Track('', [new Path('', PathType.Highway,Side.Top), 
                          new Path('', PathType.Railway,Side.Right), 
                          new Path('', PathType.Highway,Side.Bottom),
                          new Path('', PathType.Railway,Side.Left)])]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  }

  private createExternalTiles(){
    this.templateTiles[TemplateId.EdgeTile] = new Tile(TemplateId.EdgeTile, '', TileType.Edge, null);
    this.templateTiles[TemplateId.EntranceHighwayTile] = new Tile(TemplateId.EntranceHighwayTile, '', TileType.Entrance, [new Track('', [new Path('', PathType.Highway, Side.Bottom)])]);
    this.templateTiles[TemplateId.EntranceRailwayTile] = new Tile(TemplateId.EntranceRailwayTile, '', TileType.Entrance, [new Track('', [new Path('', PathType.Railway, Side.Bottom)])]);
  }

  private initRotationMap(){
    this.rotationMap = new Array<Side>();
    this.rotationMap[Side.Top] = Side.Right;
    this.rotationMap[Side.Right] = Side.Bottom;
    this.rotationMap[Side.Bottom] = Side.Left;
    this.rotationMap[Side.Left] = Side.Top;
  }

  private rotatePath(path: Path, rotation: number){
    switch(rotation){
      case 1: return this.rotationMap[path.side];
      case 2: return this.rotationMap[this.rotationMap[path.side]];
      case 3: return this.rotationMap[this.rotationMap[this.rotationMap[path.side]]];
    }
  }

  private copyPaths(track: Track): Array<Path>{
    let copy = [];

    track.paths.forEach(path => copy.push(new Path(path.id, path.type, path.side)));

    return copy;
  }

  copy(template: Tile): Tile{
    let copy = new Tile(template.templateId, template.id, template.type, []);

    if(template.tracks && template.tracks.length){
      template.tracks.forEach(track => copy.tracks.push(new Track(track.id, this.copyPaths(track))));
    }
    return copy;
  }

  createTile(templateId: TemplateId, id: string, clockwiseRotation: number) : Tile{
    let template = this.templateTiles[templateId];

    if(!template){
      return null;
    }

    let tile: Tile = this.copy(template);
    tile.id = id;
    if(tile.tracks && tile.tracks.length){
      tile.tracks.forEach((track, index) => 
      {
        track.id = `${tile.id}_${index}`;
        track.paths.forEach((path, pindex) => path.id = `${track.id}_${pindex}`);
      });
    }

    this.rotate(tile, clockwiseRotation);

    return tile;
  }

  rotate(tile: Tile, clockwiseRotation: number){
    let rotation = clockwiseRotation % 4;
   
    if(rotation  === 0){
      return;
    }

    if(tile.tracks && tile.tracks.length){
      tile.tracks.forEach(track => track.paths.forEach(path => path.side = this.rotatePath(path, rotation )));
    }

    // for display only
    let flipFactor = tile.flip ? -1 : 1;
    tile.rotation += rotation*flipFactor;
    if(tile.rotation >= 4 || tile.rotation < 0){
      tile.rotation -= 4*flipFactor;
    }
  }

  flipHorizontally(tile: Tile){
    if(tile.tracks && tile.tracks.length){
      tile.tracks.forEach(track => {
        track.paths.forEach(path => {
          switch(path.side){
            case Side.Right: path.side = Side.Left; break;
            case Side.Left: path.side = Side.Right; break;
          }
        })
      });

      tile.flip = !tile.flip;
    }
  }
}
