/**
* Created by Phil on 10/3/2014.
*/
var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager(processes, newPid) {
            if (typeof processes === "undefined") { processes = new Array(); }
            if (typeof newPid === "undefined") { newPid = 0; }
            this.processes = processes;
            this.newPid = newPid;
        }
        ProcessManager.prototype.init = function () {
        };

        /**
        * Adds a PCB to be stored
        * @param pcb the pcb being stored
        * @returns {number} the id of the pcb
        */
        ProcessManager.prototype.add = function (pcb) {
            pcb.setPID(this.newPid++);
            this.processes[this.processes.length] = pcb;
            return pcb.getPID();
        };

        ProcessManager.prototype.contains = function (id) {
            for (var i = 0; i < this.processes.length; i++) {
                if (this.processes[i].getPID() == id) {
                    return true;
                }
            }
            return false;
        };

        /**
        * Gets the specifed pcb
        * @param i the id of the pcb
        * @returns {*} the pcb
        */
        ProcessManager.prototype.getPcb = function (id) {
            for (var i = 0; i < this.processes.length; i++) {
                if (this.processes[i].getPID() == id) {
                    var pcb = this.processes[i];
                    this.processes.splice(i, 1);
                    return pcb;
                }
            }
            return this.processes[i];
        };
        return ProcessManager;
    })();
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
