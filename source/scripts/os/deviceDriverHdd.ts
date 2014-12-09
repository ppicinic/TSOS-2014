/**
 * Created by Phil on 12/3/2014.
 */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverHdd extends DeviceDriver {

        /**
         * Creates the fsDD
         */
        constructor() {
            super(this.krnHddDriverEntry, this.krnHddDispatchIO);
        }

        /**
         * Not sure what this really does but is needed?!
         */
        public krnHddDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        /**
         * Handles a keyboard ISR
         * @param params the parameters of the isr
         */
        public krnHddDispatchIO(params) {
            var request : number = <number> params[0];
            var user : boolean = (<number> params[1]) == USER_REQUEST;
            var as_string : boolean =  (<number> params[2]) == AS_STRING;
            var mem_loc : number = <number> params[3];
            var cpu_callback : boolean = (<number> params[4]) == 1;
            var filename : string = <string> params[5];
            var file : number[] = <number[]>params[6];
            var valid : boolean = true;
            console.log(user);
            console.log(filename);
            if(user && request != FORMAT_DRIVE && request != LIST_FILES){
                var regexp = new RegExp('^[A-Za-z0-9]+[\.][A-Za-z0-9]+$');
//                if(!filename.search("^[A-Za-z0-9]+\.[A-Za-z0-9]+$")){
//                    valid = false;
//                }
                if(!regexp.test(filename)){
                    valid = false;
                }
            }
            console.log(cpu_callback);
            console.log(valid);
            if(valid) {
                if (request == FORMAT_DRIVE) {
                    _HDD.format();
                } else if (request == CREATE_FILE) {
                    _HDD.createFile(filename, user);
                    if (cpu_callback) {
                        // do cpu scheduler call back
                    }
                } else if (request == WRITE_FILE) {
                    _HDD.writeFile(filename, file, user);
                    if (cpu_callback) {
                        // do cpu scheduler call back
                        _CPUScheduler.callback();
                    }
                } else if(request == CREATE_WRITE_FILE) {
                    _HDD.createFile(filename, user);
                    console.log(file);
                    _HDD.writeFile(filename, file, user);
                } else if (request == READ_FILE) {
                    if (as_string) {
                        _HDD.readFileAsString(filename);
                    } else {
                        var data = _HDD.readFile(filename);
                        // add to memory this is coming from OS
                        if (cpu_callback) {
                            // do cpu scheduler call back
                        }
                    }

                } else if (request == DELETE_FILE) {
                    _HDD.deleteFile(filename, user);
                } else if(request == LIST_FILES){
                    _HDD.listFiles();
//                    _StdOut.advanceLine();
                }

                if(user){
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                }
            }else{
                _StdOut.putText(filename + " is an invalid filename.");
                _StdOut.advanceLine();
                _StdOut.putText(">");
            }
        }
    }
}