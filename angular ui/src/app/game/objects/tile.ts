import { TemplateId, TileType } from '../common/constants';
import { Track } from './track';

export class Tile {
    templateId: TemplateId;
    id: string;
    type: TileType;
    tracks: Array<Track>;
    rotation: number;
    flip: boolean;
    isValid: boolean;
    roundNumber: number;
    inUse: boolean;

    constructor(templateId: TemplateId, id: string, type: TileType, tracks: Array<Track>) {
        this.templateId = templateId;
        this.id = id;
        this.type = type;
        this.tracks = tracks;
        this.rotation = 0;
        this.flip = false;
        this.isValid = true;
        this.roundNumber = 0;
        this.inUse = false;
    }
}