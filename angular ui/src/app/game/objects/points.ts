export class Points {
    entrance: number; 
    highway: number;
    railway: number;
    central: number;
    errors: number;

    constructor(){
        this.clearPoints();
    }

    clearPoints(){
        this.entrance = this.highway = this.railway = this.central = this.errors = 0;
    }
}