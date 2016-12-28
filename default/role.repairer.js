var roleBase = require('role.base');

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.supplier');
 * mod.thing == 'a thing'; // true
 */

var roleRepairer = {
    run: function(creep) {
        //repair closest structures
        roleBase.run(creep);

        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('harvesting');
        }

        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('repairer repairing');
        }

console.log("repairing");
        // delivering
        if (creep.memory.repairing) {
           
           var repairTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_WALL ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.hits < structure.hitsMax;
                }
            });
            
        repairTargets.sort(function (a, b) { return (a.hits - b.hits) });
        //console.log("repairtargets" + repairTargets.length);
        if (repairTargets.length > 0)
        {
            if(creep.repair(repairTargets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(repairTargets[0]);
            }
            //creep.say("repairing");
        } else {
                roleBase.moveOutOfWay(creep);
            }
        } else {
            roleBase.getEnergyFromContainers(creep);
        }
    } 
};
module.exports = roleRepairer;