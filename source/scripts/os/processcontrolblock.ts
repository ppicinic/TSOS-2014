/**
 * Created by Phil on 10/3/2014.
 */

module TSOS {

    export class ProcessControlBlock {

        constructor(public start : number,
            public length : number,
            public pos : number = 0
            ){

        }

        public init() : void{

        }

        public getNextCommand() : string{
            var r = _MemoryManager.getMemoryBlock(this.start + this.pos);
            this.pos++;
            return r;
        }

        public isFinished() : boolean{
            if(this.pos == this.length){
                this.pos = 0;
                return true;
            }else{
                return false;
            }
        }
    }
}