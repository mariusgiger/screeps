var roleBase = require('role.base');
var roleUpgrader = require('role.upgrader');

var roleRepairer = {
    run: function (creep) {
        roleBase.run(creep);   //repair closest structures
        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('getting energy');
        }

        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('repairing');
        }

        if (creep.memory.repairing) { //repairing

            if (creep.memory.repairTargetId === undefined) { //only gets executed on init
                var repairTargets = this.findRepairStructures(creep);

                if (!repairTargets.length) {
                    console.log("no source with energy found");
                    roleUpgrader.run(creep);
                    return;
                }

                creep.memory.repairTargetId = repairTargets[0].id;
            }

            var repairTarget = Game.getObjectById(creep.memory.repairTargetId);

            if (repairTarget.hits === repairTarget.hitsMax) {
                console.log("repairer needs new target");
                var repairTargets = this.findRepairStructures(creep);

                if (!repairTargets.length) {
                    console.log("no source with energy found");
                    roleUpgrader.run(creep);
                    return;
                }

                creep.memory.repairTargetId = repairTargets[0].id;
                repairTarget = repairTargets[0];
            }

            if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                creep.moveTo(repairTarget);
            }
        } else {
            roleBase.getEnergyFromContainers(creep);
        }
    },
    findRepairStructures: function (creep) {
        var repairTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_WALL ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.hits < structure.hitsMax;
            }
        });

        repairTargets.sort(function (a, b) { return (a.hits - b.hits) });
        return repairTargets;
    }
};
module.exports = roleRepairer;