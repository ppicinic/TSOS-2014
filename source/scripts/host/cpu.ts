///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public pcb : ProcessControlBlock = null) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public setPcb(newPcb : ProcessControlBlock){
            this.pcb = newPcb;
            this.PC = this.pcb.start;
            this.isExecuting = true;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            console.log("happens");
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if(this.isExecuting){
                if(this.pcb != null){
                    // do next command
                    var command = this.pcb.getBlock(this.PC);
                    this.PC++;
                    this.doCommand(command);
                    this.updateDisplay()


//                    _Console.putText("t");
                    if(this.pcb.isFinished(this.PC)){
                        this.pcb = null;
                        this.isExecuting = false;
                    }
                }
            }
        }

        private updateDisplay() : void{
            console.log(this.Acc);
            document.getElementById("taPC").innerHTML = MemoryManager.decToHex(this.PC);
            document.getElementById("taAcc").innerHTML = MemoryManager.decToHex(this.Acc);
            document.getElementById("taXReg").innerHTML = MemoryManager.decToHex(this.Xreg);
            document.getElementById("taYReg").innerHTML = MemoryManager.decToHex(this.Yreg);
            document.getElementById("taZFlag").innerHTML = MemoryManager.decToHex(this.Zflag);
        }

        private doCommand(command : number) : void {
            switch (command){
                // A9
                case 169:
                    this.Acc = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    break;
            }
        }
    }
}
