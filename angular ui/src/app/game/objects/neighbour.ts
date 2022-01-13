import { Tile } from './tile';
import { Side } from '../common/constants';

export class Neighbour{
    tile: Tile;
    adjacentSide: Side;
    x: number;
    y: number;

    constructor(tile: Tile, side: Side, x: number, y:number) {
        this.tile = tile;
        this.adjacentSide = side;
        this.x = x;
        this.y = y;
    }
}