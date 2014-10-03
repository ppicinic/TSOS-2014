/**
 * Created by Phil on 10/3/2014.
 */

module TSOS {

    export class ProcessManager{

        constructor(public processes : Array<ProcessControlBlock> = new Array()){}

        public init() : void{

        }

        public add(pcb : ProcessControlBlock): number{
            this.processes[this.processes.length] = pcb;
            return this.processes.length - 1;
        }

        public getPcb(i: number):ProcessControlBlock{
            if(i >= this.processes.length){
                return null;
            }
            return this.processes[i];
        }
    }
}