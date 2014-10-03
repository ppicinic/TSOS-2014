/**
 * Created by Phil on 10/3/2014.
 */

module TSOS {

    export class ProcessControlBlock {

        constructor(public start : number,
            public length : number,
            public end : number = 0){
            this.end = this.start + this.length;
        }

        public init() : void{

        }

        public getBlock(pos : number) : number{
            return _MemoryManager.getMemoryBlock(pos);
        }

        public isFinished(pos : number) : boolean{
            if(pos == this.end){
                return true;
            }else{
                return false;
            }
        }
    }
}