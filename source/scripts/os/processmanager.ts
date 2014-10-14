/**
 * Created by Phil on 10/3/2014.
 */

module TSOS {

    export class ProcessManager{

        constructor(public processes : Array<ProcessControlBlock> = new Array()){}

        public init() : void{

        }

        /**
         * Adds a PCB to be stored
         * @param pcb the pcb being stored
         * @returns {number} the id of the pcb
         */
        public add(pcb : ProcessControlBlock): number{
            this.processes[this.processes.length] = pcb;
            return this.processes.length - 1;
        }

        /**
         * Gets the specifed pcb
         * @param i the id of the pcb
         * @returns {*} the pcb
         */
        public getPcb(i: number):ProcessControlBlock{
            if(i >= this.processes.length){
                return null;
            }
            return this.processes[i];
        }
    }
}