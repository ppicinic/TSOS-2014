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
                    public IR: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public base: number = 0,
                    public limit: number = 0,
                    public isExecuting: boolean = false,
                    public pcb : ProcessControlBlock = null) {

        }

        public init(): void {
            this.PC = 0;
            this.IR = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        /**
         * Sets a PCB to be executed by the CPU
         * @param newPcb
         */
        public setPcb(newPcb : ProcessControlBlock){
            this.pcb = newPcb;
            this.PC = this.pcb.start;
            this.base = this.pcb.start;
            this.limit = this.base + 255;
            this.isExecuting = true;
            this.updateDisplay();
        }

        public cycle(): void {

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            var choice = _CPUScheduler.cycle(this.isExecuting);
//            console.log("cycle: " + choice);
            if(choice == 1){
                _Kernel.krnTrace('Context Switch');
                this.pcb = _CPUScheduler.next();
                this.pcb.setState("Running");
                this.PC = this.pcb.getPC();
                this.Acc = this.pcb.getAcc();
                this.Xreg = this.pcb.getXReg();
                this.Yreg = this.pcb.getYReg();
                this.Zflag = this.pcb.getZFlag();
                this.base = this.pcb.start;
                this.limit = this.base + 255;
                this.isExecuting = true;
                this.updateDisplay();
            }else if(choice == 2){
                _Kernel.krnTrace('Context Switch');
                this.pcb.dumpRegisters(this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag);
                this.pcb.setState("Waiting");
                _CPUScheduler.add(this.pcb);
                this.pcb = _CPUScheduler.next();
                this.pcb.setState("Running");
                this.PC = this.pcb.getPC();
                this.Acc = this.pcb.getAcc();
                this.Xreg = this.pcb.getXReg();
                this.Yreg = this.pcb.getYReg();
                this.Zflag = this.pcb.getZFlag();
                this.base = this.pcb.start;
                this.limit = this.base + 255;
                this.isExecuting = true;
                this.updateDisplay();
            }else if(choice == 3){
                _Kernel.krnTrace('CPU cycle');
                var command = this.pcb.getBlock(this.PC);
                this.PC++;
                this.doCommand(command);
                this.IR = command;
                this.updateDisplay();
                this.pcb.dumpRegisters(this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag);

//                    _Console.putText("t");
                if(this.pcb.isFinished(this.PC)){
                    _CPUScheduler.finish(this.pcb.getPID());
                    this.pcb.setState("Finished");
                    _MemoryManager.free(this.pcb.getStart() / 256);
                    var params = new Array();
                    params.push(DELETE_FILE); //request
                    params.push(OS_REQUEST); //user
                    params.push(0); // as_string
                    params.push(0); // mem loc
                    params.push(0); // cpu callback
                    params.push("swap"+this.pcb.getPID()); //filename
                    params.push(null);//file
                    _KernelInterruptQueue.enqueue(new Interrupt(FSDD_IRQ, params));
                    this.pcb = null;
                    this.isExecuting = false;
                }
                _CPUScheduler.updateDisplay();
            }
//            if(this.isExecuting){
//                if(this.pcb != null){
//                    // do next command
//                    var command = this.pcb.getBlock(this.PC);
//                    this.PC++;
//                    this.doCommand(command);
//                    this.IR = command;
//                    this.updateDisplay()
//
//
////                    _Console.putText("t");
//                    if(this.pcb.isFinished(this.PC)){
//                        this.pcb = null;
//                        this.isExecuting = false;
//                    }
//                }
//            }
        }

        /**
         * Updates the host display
         */
        private updateDisplay() : void{
            document.getElementById("taPC").innerHTML = MemoryManager.decToHex2(this.PC);
            document.getElementById("taIR").innerHTML = MemoryManager.decToHex(this.IR);
            document.getElementById("taAcc").innerHTML = MemoryManager.decToHex(this.Acc);
            document.getElementById("taXReg").innerHTML = MemoryManager.decToHex(this.Xreg);
            document.getElementById("taYReg").innerHTML = MemoryManager.decToHex(this.Yreg);
            document.getElementById("taZFlag").innerHTML = MemoryManager.decToHex(this.Zflag);
        }

        public kill(id : number): void {
            if(this.pcb.getPID() == id){
//                while(!this.pcb.isFinished(this.PC)){
//                    this.PC++;
//                }
//                console.log("happens");
                this.isExecuting = false;
                this.pcb = null;
            }
        }
        /**
         * Handles an opcode and does necessary operations
         * @param command the opcode to execute.
         */
        private doCommand(command : number) : void {
            switch (command){
                // A9
                case 169:
                    this.Acc = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    break;
                // AD
                case 173:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    if(val + this.base > this.limit){
                        _Kernel.krnTrapError("Program exceeded memory boundary.");
                    }
                    this.Acc = _Memory.getMemoryBlock(val + this.base);
                    break;
                // 8D
                case 141:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    if(val + this.base > this.limit){
                        console.log("happens");
                        _Kernel.krnTrapError("Program exceeded memory boundary.");
                    }
                    _MemoryManager.setMemoryBlock(val + this.base, this.Acc);
                    break;
                // 6D
                case 109:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    if(val + this.base > this.limit){
                        _Kernel.krnTrapError("Program exceeded memory boundary.");
                    }
                    var value = _Memory.getMemoryBlock(val + this.base);
                    this.Acc += value;
                    if(this.Acc > 255){
                        this.Acc = 255;
                    }
                    break;
                case 162:
                    this.Xreg = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    break;
                case 160:
                    this.Yreg = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    break;
                // AE
                case 174:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    if(val + this.base > this.limit){
                        _Kernel.krnTrapError("Program exceeded memory boundary.");
                    }
                    this.Xreg = _Memory.getMemoryBlock(val + this.base);
                    break;
                // AC
                case 172:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    if(val + this.base > this.limit){
                        _Kernel.krnTrapError("Program exceeded memory boundary.");
                    }
                    this.Yreg = _Memory.getMemoryBlock(val + this.base);
                    break;
                case 234:
                    break;
                // EC
                case 236:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    if(val + this.base > this.limit){
                        _Kernel.krnTrapError("Program exceeded memory boundary.");
                    }
                    var value = _Memory.getMemoryBlock(val + this.base);
//                    console.log(val);
//                    console.log(value);
                    if(value == this.Xreg){
                        this.Zflag = 255;
                    }else{
                        this.Zflag = 0;
                    }
                    break;
                case 208:
                    var val = _Memory.getMemoryBlock(this.PC);
                    if(this.Zflag == 0){
                        this.PC += val;
                        if(this.PC > this.pcb.getStart() + 256){
                            this.PC -= 256;
                        }
                    }else{
                        this.PC++;
                    }
                    break;
                // EE
                case 238:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    if(val + this.base > this.limit){
                        _Kernel.krnTrapError("Program exceeded memory boundary.");
                    }
                    var value = _Memory.getMemoryBlock(val + this.base);
                    value++;
                    if(value > 255){
                        value = 255;
                    }
                    _MemoryManager.setMemoryBlock(val + this.base, value);
                    break;
                case 0:
                    break;
                case 255:
                    this.sysCall();
                    break;
            }
        }

        /**
         * Does a system call and prints to the console
         */
        public sysCall(){
            switch(this.Xreg){
                case 1:
                    var output : string = "" + this.Yreg;
                    _StdOut.putText(output);
                    break;
                case 2:
//                    console.log("happens");
                    var i = this.Yreg + this.base;
                    if(i > this.limit){
                        _Kernel.krnTrapError("Program exceeded memory boundary.");
                    }
                    var x = _Memory.getMemoryBlock(i);
                    var output = "";
                    i++;
                    while(x != 0){
                        var c = String.fromCharCode(x);
//                        alert(c);
//                        alert(i);
//                        i++;
                        output += c;
                        x = _Memory.getMemoryBlock(i);
                        i++;
                    }
                    _StdOut.putText(output);
                    break;
            }
        }

        public shutDown() : void {
            if(this.pcb != null){
                this.isExecuting = false;
                this.pcb = null;
            }
        }
    }
}
