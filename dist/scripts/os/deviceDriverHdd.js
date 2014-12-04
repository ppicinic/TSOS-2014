/**
* Created by Phil on 12/3/2014.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverHdd = (function (_super) {
        __extends(DeviceDriverHdd, _super);
        function DeviceDriverHdd() {
            _super.call(this, this.krnHddDriverEntry, this.krnHddDispatchIO);
        }
        DeviceDriverHdd.prototype.krnHddDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };

        DeviceDriverHdd.prototype.krnHddDispatchIO = function (params) {
            var request = params[0];
            var user = params[1] == USER_REQUEST;
            var as_string = params[2] == AS_STRING;
            var mem_loc = params[3];
            var cpu_callback = params[4] == 1;
            var filename = params[5];
            var file = params[6];
            var valid = true;
            console.log(user);
            console.log(filename);
            if (user && request != FORMAT_DRIVE && request != LIST_FILES) {
                var regexp = new RegExp('^[A-Za-z0-9]+[\.][A-Za-z0-9]+$');

                //                if(!filename.search("^[A-Za-z0-9]+\.[A-Za-z0-9]+$")){
                //                    valid = false;
                //                }
                if (!regexp.test(filename)) {
                    valid = false;
                }
            }
            console.log(cpu_callback);
            console.log(valid);
            if (valid) {
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
                } else if (request == CREATE_WRITE_FILE) {
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
                } else if (request == LIST_FILES) {
                    _HDD.listFiles();
                    //                    _StdOut.advanceLine();
                }

                if (user) {
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                }
            } else {
                _StdOut.putText(filename + " is an invalid filename.");
                _StdOut.advanceLine();
                _StdOut.putText(">");
            }
        };
        return DeviceDriverHdd;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverHdd = DeviceDriverHdd;
})(TSOS || (TSOS = {}));
