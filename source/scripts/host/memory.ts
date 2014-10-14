/**
 * Created by Phil on 10/2/2014.
 */

module TSOS {

    // main memory class - stores and loads memory
    export class Memory{

        constructor(public memory: number[] = []){

        }

        public init(): void{
            for(var i = 0; i < 768; i++){
                this.memory[i] = 0;
            }
        }

        /**
         * Gets the memory value at a specified block
         * @param i the block of memory
         * @returns {number} The memory value at the block
         */
        public getMemoryBlock(i) : number {
            return this.memory[i];
        }

        /**
         * Stores a value at specific point in memory
         * @param index the block to store in
         * @param value the value to store
         */
        public setMemoryBlock(index: number, value : number){
            this.memory[index] = value;
        }
    }
}