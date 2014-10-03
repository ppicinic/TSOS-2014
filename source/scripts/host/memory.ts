/**
 * Created by Phil on 10/2/2014.
 */

module TSOS {

    export class Memory{

        constructor(public memory: number[] = []){

        }

        public init(): void{
            for(var i = 0; i < 768; i++){
                this.memory[i] = 0;
            }
        }

        public getMemoryBlock(i) : number {
            return this.memory[i];
        }

        public setMemoryBlock(index: number, value : number){
            this.memory[index] = value;
        }
    }
}