


module TSOS {

    export class CPUScheduler{

        constructor(public readyQueue: ProcessControlBlock[] = [],
                    public displayQueue : ProcessControlBlock[] = [],
                    public mode: number = 0,
                    public quantum: number = 6,
                    public tick : number = 0){

        }

        public init(): void{

        }

        // 0 do nothing
        // 1 grab a pcb
        // 2 context switch pcb
        // 3 execute one cycle
        public cycle(executing : boolean ): number {
            if(executing){
                if(this.mode == 0){
                    if(this.tick == this.quantum){
                        this.tick = 0;
                        return 2;
                    }else{
                        this.tick++;
                        return 3;
                    }
                }
            }else{
                if(!this.isEmpty()){
                    return 1;
                }
            }
            return 0;
        }

        public setQuantum(quant : number): void{
            this.quantum = quant;
        }

        public addAll(pcbs : ProcessControlBlock[]){
            for(var i = 0; i < pcbs.length; i++) {
                this.readyQueue.push(pcbs[i]);
                this.displayQueue.push(pcbs[i]);
            }
        }



        public kill(id : number) : void {
            var x = -1;
            for(var i = 0; i < this.readyQueue.length; i++){
                if(this.readyQueue[i].getPID() == id){
                    x = i;
                }
            }
            if(x == -1){
                //check CPU
                _CPU.kill(id);
            }else{
                this.readyQueue.splice(x, 1);
            }
            var y = -1;
            for(var i = 0; i < this.displayQueue.length; i++){
                if(this.displayQueue[i].getPID() == id){
                    y = i;
                }
            }
            this.displayQueue.splice(y, 1);
        }

        public finish(id : number){
            var x = -1;
            for(var i = 0; i < this.displayQueue.length; i++){
                if(this.displayQueue[i].getPID() == id){
                    x = i;
                }
            }
            this.displayQueue.splice(x, 1);
        }

        public isEmpty(): boolean{
            return this.readyQueue.length == 0;
        }
        public next(): ProcessControlBlock{
            return this.readyQueue.shift();
        }

        public add(pcb : ProcessControlBlock){
            this.readyQueue.push(pcb);
        }

        public addNew(pcb : ProcessControlBlock){
            this.readyQueue.push(pcb);
            this.displayQueue.push(pcb);
        }

        public display() : void {
            _StdOut.putText("PID    PC   ACC    X    Y     Z");
            for(var i = 0; i < this.displayQueue.length; i++){
                _StdOut.advanceLine();
                var pcb = this.displayQueue[i];
                _StdOut.putText(this.pad3(pcb.getPID().toString()));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad3(MemoryManager.decToHex2(pcb.getPC())));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad3(MemoryManager.decToHex(pcb.getAcc())));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad2(MemoryManager.decToHex(pcb.getXReg())));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad2(MemoryManager.decToHex(pcb.getYReg())));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad2(MemoryManager.decToHex(pcb.getZFlag())));
            }
        }

        private pad3(text : string) : string {
            if(text.length == 0){
                _StdOut.putText("   ");
            }else if(text.length == 1){
                _StdOut.putText("  ");
            }else if(text.length == 2){
                _StdOut.putText(" ");
            }
            return text;
        }

        private pad2(text : string) : string {
            if(text.length == 0){
                _StdOut.putText("  ");
            }else if(text.length == 1){
                _StdOut.putText(" ");
            }
            return text;
        }
    }
}