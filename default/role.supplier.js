var roleBase = require('role.base');
var roleUpgrader = require('role.upgrader');

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.supplier');
 * mod.thing == 'a thing'; // true
 */

var roleSupplier = {
    run: function(creep) {
        //repair closest structures
        roleBase.run(creep);


        if (creep.memory.supplying && creep.carry.energy == 0) {
            creep.memory.supplying = false;
            creep.say('harvesting');
        }

        if (!creep.memory.supplying && creep.carry.energy == creep.carryCapacity) {
            creep.memory.supplying = true;
            creep.say('delivering');
        }

        // delivering
        if (creep.memory.supplying) {
           
           var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                roleUpgrader.run(creep);
                //roleBase.moveOutOfWay(creep);
            }
        } else {
            roleBase.getEnergyFromContainers(creep);
        }
    } 
};
module.exports = roleSupplier;