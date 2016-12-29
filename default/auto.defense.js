/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('auto.defense');
 * mod.thing == 'a thing'; // true
 */

var defense = {
    run: function (roomName) {
        Memory.myTowers =  Memory.myTowers || {};
        //TODO auto activate save mode
        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);

        var towers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
       
            
        if (hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
            towers.forEach(tower => tower.attack(hostiles[0]));
        } else { //repair
          //  towers.forEach(tower => this.repair(tower));
        }
    }, 
    repair: function(tower) {
        
        if(tower.energy < tower.energyCapacity * 0.5) {
            return;
        }
        
        Memory.myTowers[tower.id] = Memory.myTowers[tower.id] || {};
        
        //TODO avoid stack overflow
             if (Memory.myTowers[tower.id].repairTargetId === undefined) { //only gets executed on init
                var repairTarget = this.findDamagedStructures(tower);
                
                if (!repairTarget) {
                    console.log("tower found no repair structures");
                    return;
                }

                console.log("new repair target for tow" + repairTarget.id);
                Memory.myTowers[tower.id].repairTargetId = repairTarget.id;
            }

            var repairTarget = Game.getObjectById(Memory.myTowers[tower.id].repairTargetId);

            if (repairTarget.hits === repairTarget.hitsMax) {
                console.log("tower needs new repair target");
                 var repairTarget = this.findDamagedStructures(tower);
                
                if (!repairTarget) {
                    console.log("tower found no repair structures");
                    return;
                }

                Memory.myTowers[tower.id].repairTargetId = repairTarget.id;
                repairTarget = repairTarget;
            }
            
           
            tower.repair(repairTarget);
    },
    findDamagedStructures: function(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
        
        return closestDamagedStructure;
    },
    garbageCollector: function() {
        
    }
};

module.exports = defense;