/**
 * Created by Phil on 10/3/2014.
 */

module TSOS {

    // stores information about a user program
    export class ProcessControlBlock {

        constructor(public start : number,
            public length : number,
            public end : number = 0){
            this.end = this.start + this.length;
        }

        public init() : void{

        }

        /**
         * Gets next block of the program
         * @param pos the position in the program
         * @returns {number} the next piece of code
         */
        public getBlock(pos : number) : number{
            return _MemoryManager.getMemoryBlock(pos);
        }

        /**
         * Tells if the program is at the end
         * @param pos the position the cpu is at
         * @returns {boolean} true if finished, false otherwise
         */
        public isFinished(pos : number) : boolean{
            if(pos >= this.end){
                return true;
            }else{
                return false;
            }
        }
    }
}