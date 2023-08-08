
export class qParams {


    red: string; //Redirect url
    pcolor: string; //Primary color
    log?: string; //Logo
    bg: string; //Background image
    mz: string; //License
    apid: string; //Appointment id
    tok: string; //Token
    fic: string; //Favicon
    cnam:string; //Corporation name
    cord:string; //Corporate ID 

    constructor(red: string = "", pcolor: string = "", log: string = "", bg:string = "", mz: string = "", apid: string = "", tok: string = "", fic:string = "", cnam: string = "", cord: string = "") {
      this.red = red;
      this.pcolor = pcolor;
      this.log = log;
      this.bg = bg;
      this.mz = mz;
      this.apid = apid;
      this.tok = tok;
      this.fic = fic;
      this.cnam = cnam;
      this.cord = cord;

    }
  }