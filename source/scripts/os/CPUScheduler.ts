


module TSOS {

    export class CPUScheduler{

        constructor(public readyQueue: ProcessControlBlock[] = [],
                    public displayQueue : ProcessControlBlock[] = [],
                    public mode: number = 0,
                    public quantum: number = 6,
                    public tick : number = 0,
                    public hddBack : boolean = false,
                    public hddBackData : number[] = null){

        }

        public init(): void{
            this.updateDisplay();
        }

        public setMode(i : number){
            this.mode = i;
        }

        public getMode() : string{
            if(this.mode == 0){
                return "Round Robin";
            }else if(this.mode == 1){
                return "First Come First Serve";
            }else if(this.mode == 2){
                return "Priority Queue";
            }
            return "";
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

        public shutDown() : void {
            this.readyQueue.splice(0, this.readyQueue.length);
            _CPU.shutDown();
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
            var pcb = null;
            if(this.mode != 2) {
                pcb = this.readyQueue.shift();
            }else{
                var min = 10000000000000000000;
                var x = 0;
                for(var i = 0; i < this.readyQueue.length; i++){
                    if(this.readyQueue[i].getPriority() < min){
                        min = this.readyQueue[i].getPriority();
                        x = i;
                    }
                }
                pcb = this.readyQueue[x];
                this.readyQueue = this.readyQueue.splice(x,1);
            }
            console.log(pcb);
            if(pcb.onDrive()){
                if(!_MemoryManager.memAvailable()){
                    var done = false;
                    var unrunningProccesses : ProcessControlBlock[] = _ProcessManager.showCurrent();
                    for(var i = 0; i < unrunningProccesses.length && !done; i++){
                        if(unrunningProccesses[i].getPID() != pcb.getPID()){
                            if(!unrunningProccesses[i].onDrive()){
                                var pcb2 = unrunningProccesses[i];
                                var x = pcb2.getStart() / 256;
                                var data : number[] = _MemoryManager.getProgramData(x);
                                console.log("wswapped");
                                console.log(data);
                                _HDD.writeFile("swap"+pcb2.getPID(), data, false);
                                pcb2.setDrive(true);
                                _MemoryManager.free(x);
                                done = true;
                            }
                        }
                    }
                    for(var i = 0; i < this.displayQueue.length && !done; i++){
                        if(this.displayQueue[i].getPID() != pcb.getPID()){
                            if(!this.displayQueue[i].onDrive()){
                                var pcb2 = this.displayQueue[i];
                                var x = pcb2.getStart() / 256;
                                var data : number[] = _MemoryManager.getProgramData(x);
                                console.log("wswapped");
                                console.log(data);
                                _HDD.writeFile("swap"+pcb2.getPID(), data, false);
                                pcb2.setDrive(true);
                                _MemoryManager.free(x);
                                done = true;
                            }
                        }
                    }

                }
                var program : number[] = _HDD.readProgram("swap"+pcb.getPID());
                console.log("swapped");
                console.log(program);
                var position = _MemoryManager.loadMemory(program);
                pcb.setStart(position);
                pcb.setDrive(false);
            }
            return pcb;
        }

        public callback(data : number[] = null) : void {
            this.hddBack = true;
            this.hddBackData = data;
        }

        public add(pcb : ProcessControlBlock){
            this.readyQueue.push(pcb);
        }

        public addNew(pcb : ProcessControlBlock){
            this.readyQueue.push(pcb);
            this.displayQueue.push(pcb);
        }

        public display() : void {
            _StdOut.putText("PID    PC   IR   ACC    X    Y     Z");
            for(var i = 0; i < this.displayQueue.length; i++){
                _StdOut.advanceLine();
                var pcb = this.displayQueue[i];
                _StdOut.putText(this.pad3(pcb.getPID().toString()));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad3(MemoryManager.decToHex2(pcb.getPC())));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad2(MemoryManager.decToHex(pcb.getIR())));
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

        public updateDisplay(){

            var output : string = "";
            output += "PID    PC   IR   Acc    X    Y    Z   State";
            if(this.displayQueue.length == 0){
                output += "\nThere are no running processes."
            }
            for(var i = 0; i < this.displayQueue.length; i++){
                var pcb = this.displayQueue[i];
                output += "\n";
                output += this.pad3(pcb.getPID().toString());
                output += "   ";
                output += this.pad3(MemoryManager.decToHex2(pcb.getPC()));
                output += "   ";
                output += this.pad2(MemoryManager.decToHex(pcb.getIR()));
                output += "   ";
                output += this.pad3(MemoryManager.decToHex(pcb.getAcc()));
                output += "   ";
                output += this.pad2(MemoryManager.decToHex(pcb.getXReg()));
                output += "   ";
                output += this.pad2(MemoryManager.decToHex(pcb.getYReg()));
                output += "   ";
                output += this.pad2(MemoryManager.decToHex(pcb.getZFlag()));
                output += "   ";
                output += pcb.getState();

            }
            document.getElementById("taPCBDisplay").innerHTML = output;
        }

        private pad3(text : string) : string {
            if(text.length == 0){
                return "   ";
            }else if(text.length == 1){
                return "  "  + text
            }else if(text.length == 2){
                return " " + text;
            }
            return text;
        }

        private pad2(text : string) : string {
            if(text.length == 0){
                return "  ";
            }else if(text.length == 1){
                return " " + text;
            }
            return text;
        }
    }
}