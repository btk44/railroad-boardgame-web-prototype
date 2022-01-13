import { Injectable } from '@angular/core';
import { Side, TileType, PathType } from '../common/constants';
import { Neighbour } from '../objects/neighbour';
import { Path } from '../objects/path';
import { Coordinates } from '../objects/coordinates';
import { Points } from '../objects/points';
import { Tile } from '../objects/tile';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  constructor() {}

  tileMap: Array<Array<Tile>>;

  calculatePoints(map: Array<Array<Tile>>){
    let points = new Points();

    this.tileMap = map;
    points.entrance = this.countEntrancePoints();
    points.central = this.countCentralAreaPoints();
    points.highway = this.countTheLonestHighway();
    points.railway = this.countTheLonestRailway();
    points.errors = this.countErrors();
    this.tileMap = null;

    return points;
  }

  private countEntrancePoints(){
    let entrances: Array<Coordinates> = [{x:0, y:2}, {x:0, y:4}, {x:0, y:6}, {x:2, y:0}, {x:2, y:8}, {x:4, y:0}, {x:4, y:8}, {x:6, y:0}, {x:6, y:8}, {x:8, y:2}, {x:8, y:4}, {x:8, y:6}],
        entranceTrackIds: Array<string> = entrances.map(coords => `${this.tileMap[coords.x][coords.y].tracks[0].id}`),
        entrancePointsMap: Array<number> = [0, 0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 45],
        visitedTileTracks = new Array<string>(),
        points: number = 0,
        currentCount: number = 0,
        oldCount: number = 0;

      entrances.forEach(entrance => {
          let entranceTile = this.tileMap[entrance.x][entrance.y];
          if(visitedTileTracks.indexOf(entranceTile.tracks[0].id) === -1){
              visitedTileTracks.push(entranceTile.tracks[0].id);
              this.lookForEntrance(entranceTile.tracks[0].paths[0].side, entrance.x, entrance.y, visitedTileTracks);
              currentCount = visitedTileTracks.filter(id => entranceTrackIds.indexOf(id) > -1).length - oldCount;
              oldCount += currentCount;
              points += entrancePointsMap[currentCount];
          }
      });

      return points;
  }

  private lookForEntrance(comingFromSide: Side, comingFromX: number, comingFromY: number, visitedTileTracks: Array<string>){
    let neighbour = this.getNeighbour(comingFromSide, comingFromX, comingFromY);
    
    if(!neighbour.tile){
        return;
    } 

    if(neighbour.tile.tracks && neighbour.tile.tracks.length){
        let track = neighbour.tile.tracks.filter(track => track.paths.find(path => path.side === neighbour.adjacentSide))[0]; // zalozenie ze walidacja dziala dobrze pathtype
        if(track && visitedTileTracks.indexOf(track.id) === -1){
            visitedTileTracks.push(track.id);
            track.paths.filter(path => path.side !== neighbour.adjacentSide).forEach(path => {
                this.lookForEntrance(path.side, neighbour.x, neighbour.y, visitedTileTracks);
            });
        }
    }
  }

  private countCentralAreaPoints(){
    let points = 0;

    for(let x = 3; x <= 5; x++){
        for(let y = 3; y <= 5; y++){
            points += this.tileMap[x][y] ? 1 : 0; 
        }
    }

    return points;
  }

  private countTheLonestHighway(){
    return this.countTheLonestWay(PathType.Highway);
  }

  private countTheLonestRailway(){
    return this.countTheLonestWay(PathType.Railway);
  }

  private countTheLonestWay(pathType: PathType){

    let currentLongest = new Array<string>();

    for(let x = 1; x < 8; x++){
      for(let y = 1; y < 8; y++){
        let tile = this.tileMap[x][y];
        if(tile &&  tile.tracks && tile.tracks.length){
          let track = tile.tracks.filter(track => track.paths.some(path => path.type === pathType))[0]; // assumption : there is only one track on the tile that has selected pathtype
          if(track){
            let visitedTiles = new Array<Array<string>>();
            track.paths.forEach((path, index) => {
              if(path.type === pathType){
                let exploredPaths = [path.id];
                visitedTiles[index] = [tile.id];
                this.lookForLongestPath(path.side, pathType, x, y, exploredPaths, visitedTiles[index]);
              }
            })

            let longest = this.getTheLongestArray(visitedTiles);
            if(currentLongest.length < longest.length){
              currentLongest = longest;
            }
          }
        }
      }
    }

    return currentLongest.length;
  }

  private lookForLongestPath(comingFromSide: Side, pathType: PathType, comingFromX: number, comingFromY: number, exploredPaths: Array<string>, visitedTiles: Array<string>){
    let neighbour = this.getNeighbour(comingFromSide, comingFromX, comingFromY);
    
    if(!neighbour.tile || neighbour.tile.type === TileType.Edge || neighbour.tile.type === TileType.Entrance){
        return;
    }

    if(neighbour.tile.tracks && neighbour.tile.tracks.length){
      let track = neighbour.tile.tracks.filter(track => track.paths.find(path => path.side === neighbour.adjacentSide && path.type == pathType))[0];
      if(track){
        let path = track.paths.filter(path => path.side === neighbour.adjacentSide && path.type === pathType)[0];
        if(path){
          exploredPaths.push(path.id);
          let localVisitedTiles = new Array<Array<string>>();
          let otherPaths = track.paths.filter(otherPath => otherPath.side !== neighbour.adjacentSide && otherPath.type === pathType && exploredPaths.indexOf(otherPath.id) === -1);
          
          otherPaths.forEach((otherPath, index) => {
            let localExploredPaths = [].concat(exploredPaths);
          
            localVisitedTiles[index] = [].concat(visitedTiles);
            localExploredPaths.push(otherPath.id);
            if(localVisitedTiles[index].indexOf(neighbour.tile.id) === -1){
              localVisitedTiles[index].push(neighbour.tile.id);
            }
            this.lookForLongestPath(otherPath.side, pathType, neighbour.x, neighbour.y, localExploredPaths, localVisitedTiles[index]);
          });

          if(!otherPaths.length){
            localVisitedTiles[0] = [].concat(visitedTiles);
            if(localVisitedTiles[0].indexOf(neighbour.tile.id) === -1){
              localVisitedTiles[0].push(neighbour.tile.id);
            }
          }
          
          let longest = this.getTheLongestArray(localVisitedTiles);
          longest.filter(tileId => visitedTiles.indexOf(tileId) === -1).forEach(tileId => visitedTiles.push(tileId));
        }
      }
    }
  }

  private countErrors(){
    let errorCount = 0;

    for(let x = 1; x < 8; x++){
      for(let y = 1; y < 8; y++){
        let tile = this.tileMap[x][y];
        if(tile && tile.tracks && tile.tracks.length){
          tile.tracks.forEach(track => {
            track.paths.forEach(path => {
              errorCount += this.isPathCorrect(path, x, y) ? 0 : 1;
            })
          })
        }
      }
    }

    return errorCount;
  }

  private isPathCorrect(comingPath: Path, comingFromX: number, comingFromY: number){
    let neighbour = this.getNeighbour(comingPath.side, comingFromX, comingFromY);

    return neighbour.tile 
        && (neighbour.tile.type === TileType.Edge 
         || neighbour.tile.tracks.filter(track => track.paths.find(path => path.side === neighbour.adjacentSide && path.type === comingPath.type))[0]);
  }

  private getNeighbour(comingFromSide: Side, comingFromX: number, comingFromY: number){
    let side: Side,
        x: number = comingFromX,
        y: number = comingFromY;

    switch(comingFromSide){
        case Side.Top:    side = Side.Bottom; x--; break;
        case Side.Right:  side = Side.Left;   y++; break;
        case Side.Bottom: side = Side.Top;    x++; break;
        case Side.Left:   side = Side.Right;  y--; break;
    }

    return new Neighbour(this.tileMap[x][y], side, x, y);
  }

  private getTheLongestArray(containingArray: Array<Array<string>>): Array<string>{
    let max = -Infinity, 
        index = -1;

    if(!containingArray.length){
        return [];
    }

    containingArray.forEach(function(a, i){
        if (a.length > max) {
            max = a.length;
            index = i;
        }
    });

    return containingArray[index];
  } 

}
