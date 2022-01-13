import { PathType, Side } from '../common/constants';

export class Path {
    id: string; 
    type: PathType;
    side: Side;

    constructor (id: string, type: PathType, side: Side){
        this.id = id;
        this.type = type;
        this.side = side;
    }
}