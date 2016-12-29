var roleBase = require('role.base');
var autoSpawn = require('auto.spawn');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        roleBase.run(creep);  //repair closest structures

        if (creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
            creep.say('harvesting');
        }

        if (!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.delivering = true;
            creep.say('delivering');
        }
        
        if(creep.memory.currentTicks > 150) { //reset
            creep.memory.sourceId = undefined;
            creep.memory.deliverTargetId = undefined;
            creep.memory.currentTicks = 0;
        }

        if (creep.memory.delivering) { // delivering
            this.deliver(creep);
        }
        else { // harvesting 
            this.harvest(creep);
        }
    },
    findSources: function (creep) {
        var sources = creep.room.find(FIND_SOURCES, {
            filter: (source) => {
                return source.energy > 0;
            }
        });

        return sources;
    },
    findDeliverTarget: function (creep) {
        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
            }
        });

        if (container) {
            return container;
        }

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });

        return targets ? targets[0] : null;
    },
    isFull: function(structure) {
        switch(structure.structureType) {
            case STRUCTURE_CONTAINER:
                return structure.store[RESOURCE_ENERGY] >= structure.storeCapacity;
                break;
            default:
            return structure.energy >= structure.energyCapacity;
        }  
    },
    harvest: function (creep) {
        if (creep.memory.sourceId === undefined) { //only gets executed on init
            var sources = this.findSources(creep);

            if (!sources.length) {
                console.log("no source with energy found");
                roleBase.moveOutOfWay(creep);
                return;
            }

            creep.memory.sourceId = sources[0].id;
        }

        var source = Game.getObjectById(creep.memory.sourceId);

        if (source.energy === 0) {
            console.log("harvester "+creep.name+ " needs new source");
            var sources = this.findSources(creep);

            if (!sources.length) {
                console.log("no source with energy found");
                roleBase.moveOutOfWay(creep);
                return;
            }

            creep.memory.sourceId = sources[0].id;
            source = sources[0];
        }

        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    },
    deliver: function (creep) {
        if (creep.memory.deliverTargetId === undefined) { //only gets executed on init
            var deliverTarget = this.findDeliverTarget(creep);

            if (!deliverTarget) {
                console.log("no deliver targets found");
                roleBase.moveOutOfWay(creep);
                return;
            }

            creep.memory.deliverTargetId = deliverTarget.id;
        }

        var deliverTarget = Game.getObjectById(creep.memory.deliverTargetId);
        if(this.isFull(deliverTarget)) {
            console.log("harvester "+creep.name+" needs new deliver target");
            var deliverTarget = this.findDeliverTarget(creep);

            if (!deliverTarget) {
                console.log("no deliver targets found");
                roleBase.moveOutOfWay(creep);
                return;
            }

            creep.memory.deliverTargetId = deliverTarget.id;
            deliverTarget = deliverTarget;
        }

        if (creep.transfer(deliverTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(deliverTarget);
        }
    }
};

module.exports = roleHarvester;