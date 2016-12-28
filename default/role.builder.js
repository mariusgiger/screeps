var roleBase = require('role.base');
var roleUpgrader = require('role.upgrader');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        roleBase.run(creep);
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }
        
          var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
         if (!targets.length) {
            roleUpgrader.run(creep); 
            return;
         }
        
        

        if (creep.memory.building) {
     
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                
        }
        else {
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0;
                }
            });

            if (!containers.length) {
               /* var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }*/
            } else {
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                }
            }
        }
    },

    build: function (structureType) {
        var extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
    }
};

module.exports = roleBuilder;