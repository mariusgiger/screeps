/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.base');
 * mod.thing == 'a thing'; // true
 */


var roleBase = {
    run: function (creep) {
        var repairTargets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: function (object) {
                return object.hits < object.hitsMax
                    && object.hitsMax - object.hits > REPAIR_POWER;
            }
        });
        repairTargets.sort(function (a, b) { return (a.hits - b.hits) });
        if (repairTargets.length > 0)
        {
            creep.repair(repairTargets[0]);
            //creep.say("repairing");
        }
    },
    getEnergyFromContainers: function (creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0;
            }
        });

        if (containers.length) {
            if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0]);
            }
        }

        return containers.length > 0;
    },
    moveOutOfWay: function(creep) {
         return creep.moveTo(22, 35) === OK;
    }
}

module.exports = roleBase;