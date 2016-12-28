var roleBase = require('role.base');
var roleUpgrader = require('role.upgrader');

var roleSupplier = {
    run: function (creep) {
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

            if (creep.memory.supplyTargetId === undefined) { //only gets executed on init
                var supplyTargets = this.findSupplyTargets(creep);

                if (!supplyTargets.length) {
                    console.log("no supply targets found");
                    roleUpgrader.run(creep);
                    return;
                }

                creep.memory.supplyTargetId = supplyTargets[0].id;
            }

            var supplyTarget = Game.getObjectById(creep.memory.supplyTargetId);

            if (supplyTarget.energy >= supplyTarget.energyCapacity) {
                console.log("supplier " + creep.name + " needs new target");

                var supplyTargets = this.findSupplyTargets(creep);

                if (!sources.length) {
                    console.log("no source with energy found");
                    roleUpgrader.run(creep);
                    return;
                }

                creep.memory.supplyTargetId = supplyTargets[0].id;
                supplyTarget = supplyTargets[0];
            }

            if (creep.transfer(supplyTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(supplyTarget);
            }

        } else {
            roleBase.getEnergyFromContainers(creep);
        }
    },
    findSupplyTargets: function (creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });

        return targets;
    }
};
module.exports = roleSupplier;