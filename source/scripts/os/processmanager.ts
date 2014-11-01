/**
 * Created by Phil on 10/3/2014.
 */

module TSOS {

    export class ProcessManager{

        constructor(public processes : Array<ProcessControlBlock> = new Array(),
                    public newPid : number = 0){}

        public init() : void{

        }

        /**
         * Adds a PCB to be stored
         * @param pcb the pcb being stored
         * @returns {number} the id of the pcb
         */
        public add(pcb : ProcessControlBlock): number{
            pcb.setPID(this.newPid++);
            this.processes[this.processes.length] = pcb;
            return pcb.getPID();
        }

        public contains(id : number) : boolean {
            for(var i = 0; i < this.processes.length; i++){
                if(this.processes[i].getPID() == id){
                    return true;
                }
            }
            return false;
        }
        /**
         * Gets the specifed pcb
         * @param i the id of the pcb
         * @returns {*} the pcb
         */
        public getAll() : ProcessControlBlock[]{
            var result = this.processes;
            this.processes = new Array();
            return result;
        }

        public getPcb(id: number):ProcessControlBlock{
            for(var i = 0; i < this.processes.length; i++){
                if(this.processes[i].getPID() == id){
                    var pcb = this.processes[i];
                    this.processes.splice(i, 1);
                    return pcb;
                }
            }
            return this.processes[i];
        }
    }
}