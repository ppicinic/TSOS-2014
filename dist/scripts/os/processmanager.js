/**
* Created by Phil on 10/3/2014.
*/
var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager(processes) {
            if (typeof processes === "undefined") { processes = new Array(); }
            this.processes = processes;
        }
        ProcessManager.prototype.init = function () {
        };

        /**
        * Adds a PCB to be stored
        * @param pcb the pcb being stored
        * @returns {number} the id of the pcb
        */
        ProcessManager.prototype.add = function (pcb) {
            this.processes[this.processes.length] = pcb;
            return this.processes.length - 1;
        };

        /**
        * Gets the specifed pcb
        * @param i the id of the pcb
        * @returns {*} the pcb
        */
        ProcessManager.prototype.getPcb = function (i) {
            if (i >= this.processes.length) {
                return null;
            }
            return this.processes[i];
        };
        return ProcessManager;
    })();
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
