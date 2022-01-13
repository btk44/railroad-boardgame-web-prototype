import { Injectable } from '@angular/core';
import { Side, TileType } from '../common/constants';
import { Neighbour } from '../objects/neighbour';
import { Path } from '../objects/path';
import { Tile } from '../objects/tile';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor() {}

  tileMap: Array<Array<Tile>>;
  roundNumber: number;

  valildateNewTiles(map: Array<Array<Tile>>, roundNumber: number){
    let newTiles = new Array<Neighbour>();
    this.tileMap = map;
    this.roundNumber = roundNumber;

    this.tileMap.forEach((row, rIndex) => {
      row.forEach((tile, tIndex) => {
        if(tile && tile.type === TileType.Normal && tile.roundNumber === this.roundNumber){
          newTiles.push(new Neighbour(tile, null, rIndex, tIndex));
        }
      });
    });

    newTiles.forEach(newTile => {
      if(newTile.tile && newTile.tile.tracks && newTile.tile.tracks.length){
        let pathMismatch = false,
            isExtendingExistingRoad = false;

        newTile.tile.tracks.forEach(track => {
          track.paths.forEach(path => {
            let neighbour = this.getNeighbour(path.side, newTile.x, newTile.y);
            
            if(neighbour.tile && neighbour.tile.type !== TileType.Edge){
              if(this.isPathMismatch(neighbour,path)){
                pathMismatch = true;
              }

              let visitedTiles = [newTile.tile.id];
              if(!pathMismatch && !isExtendingExistingRoad && this.isExtendingExistingRoad(neighbour, path, visitedTiles)){
                isExtendingExistingRoad = true;
              }
            }
          })
        });

        newTile.tile.isValid = isExtendingExistingRoad && !pathMismatch;
      }
    });

    return newTiles.every(tileContainer => tileContainer.tile.isValid);
  }

  private isPathMismatch(neighbour: Neighbour, comingFromPath: Path){
    let matchingTrack = neighbour.tile.tracks.filter(track => track.paths.find(path => path.side === neighbour.adjacentSide))[0];
    let pathMismatch = matchingTrack && !matchingTrack.paths.some(path => path.side === neighbour.adjacentSide && path.type === comingFromPath.type);

    return matchingTrack && pathMismatch;
  }

  private isExtendingExistingRoad(neighbour: Neighbour, comingFromPath: Path, visitedTiles: Array<string>){
    let isConnection = !!neighbour.tile.tracks.filter(track => track.paths.find(path => path.side === neighbour.adjacentSide && path.type === comingFromPath.type))[0];

    if(!isConnection){
      return false;
    }

    if(neighbour.tile.roundNumber < this.roundNumber){
      return true;
    }

    visitedTiles.push(neighbour.tile.id);
    let isIndirectConnection = false;
    neighbour.tile.tracks.forEach(track => {
      track.paths.filter(path => path.side !== neighbour.adjacentSide).forEach(path => {
        let nextNeighbour = this.getNeighbour(path.side, neighbour.x, neighbour.y);
        if(!isIndirectConnection && nextNeighbour.tile && nextNeighbour.tile.type !== TileType.Edge && visitedTiles.indexOf(nextNeighbour.tile.id) === -1){
          isIndirectConnection = this.isExtendingExistingRoad(nextNeighbour, path, visitedTiles);
        }
      })
    });

    return isIndirectConnection;
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

}
