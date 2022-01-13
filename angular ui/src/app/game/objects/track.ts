import { Path } from './path';

export class Track {
    id: string;
    paths: Array<Path>;

    constructor(id: string, paths: Array<Path>) {
        this.id = id;
        this.paths = paths;
    }
}