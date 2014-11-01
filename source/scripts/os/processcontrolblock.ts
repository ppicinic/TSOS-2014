/**
 * Created by Phil on 10/3/2014.
 */

module TSOS {

    // stores information about a user program
    export class ProcessControlBlock {

        constructor(public start : number,
            public length : number,
            public end : number = 0,
            public PC : number = 0,
            public IR : number = 0,
            public Acc : number = 0,
            public XReg : number = 0,
            public YReg : number = 0,
            public ZFlag : number = 0,
            public PID : number = 0,
            public state : string = "Waiting"){
            this.end = this.start + this.length;
            this.PC = this.start;
        }

        public init() : void{

        }

        public setPID(id) : void{
            this.PID = id;
        }

        public getPID() : number{
            return this.PID;
        }

        public setState(newState : string) : void {
            this.state = newState;
        }

        public getState() : string {
            return this.state;
        }

        public dumpRegisters(pc, ir, acc, x, y, z){
            this.PC = pc;
            this.IR = ir;
            this.Acc = acc;
            this.XReg = x;
            this.YReg = y;
            this.ZFlag = z;
        }

        public getIR() : number {
            return this.IR;
        }

        public getPC() : number {
            return this.PC;
        }

        public getAcc() : number {
            return this.Acc;
        }

        public getXReg() : number {
            return this.XReg;
        }

        public getYReg() : number {
            return this.YReg;
        }

        public getZFlag() : number {
            return this.ZFlag;
        }
        /**
         * Gets next block of the program
         * @param pos the position in the program
         * @returns {number} the next piece of code
         */
        public getBlock(pos : number) : number{
            return _MemoryManager.getMemoryBlock(pos);
        }

        public getStart() : number{
            return this.start;
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