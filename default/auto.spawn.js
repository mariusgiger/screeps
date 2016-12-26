/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('auto.spawn');
 * mod.thing == 'a thing'; // true
 */

var autoSpawn = {
    defaultBody: [WORK, CARRY, MOVE],
    bodies: [
        {
            type: WORK,
            cost: 100
        },
        {
            type: MOVE,
            cost: 50
        }, {
            type: CARRY,
            cost: 50
        }, 
        {
            type: ATTACK,
            cost: 80
        },
        {
            type: RANGED_ATTACK,
            cost: 150
        },
        {
            type: HEAL,
            cost: 250
        },
        {
            type: CLAIM,
            cost: 600
        }, 
        {
            type: TOUGH,
            cost: 10
        }],

    roles: {
        builder: "builder",
        harvester: "harvester",
        upgrader: "upgrader"
    },
    run: function () {
        this.garbageCollector();
        
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == this.roles.harvester);
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == this.roles.builder);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == this.roles.upgrader);
        
        console.log("currently there are. harvesters: " + harvesters.length + ", upgraders: " + upgraders.length + ", builders: " + builders.length);
        
        if (this.currentlySpawning()) {
            return;
        }

        if (harvesters.length < 7 && Game.spawns['Spawn1'].canCreateCreep(this.defaultBody) === 0) {
            this.spawn(this.determineBody(this.roles.harvester), this.roles.harvester);
            return;
        }

        if (upgraders.length < 5 && Game.spawns['Spawn1'].canCreateCreep(this.defaultBody) === 0) {
            this.spawn(this.defaultBody, this.roles.upgrader);
            return;
        }

        if (builders.length < 4 && Game.spawns['Spawn1'].canCreateCreep(this.defaultBody) === 0) {
            this.spawn(this.defaultBody, this.roles.builder);
            return;
        }

    },
    garbageCollector: function () {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

    },
    spawn: function (creepBody, role) {
        if (Game.spawns['Spawn1'].canCreateCreep(creepBody) === 0) {
            var newName = Game.spawns['Spawn1'].createCreep(creepBody, undefined, { role: role });
            console.log('Spawning new ' + role + ': ' + newName);
        } else {
            //console.log("Could not create creep! "+ creepBody)
        }
    },
    getEnergyAvailable: function (room) {
        var targets = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN);
            }
        });

        var totalEnergy = 0;
        for (var i = 0; i < targets.length; i++) {
            totalEnergy += targets[i].energy;
        }

        //console.log("Total energy for spawning creeps " + totalEnergy);
        return totalEnergy;
    },
    currentlySpawning: function() {
        return Game.spawns['Spawn1'].spawning != null;
    },
    determineBody: function(role){
        
    var energy = this.getEnergyAvailable(Game.spawns['Spawn1'].room);   
    console.log(energy)
    var remainingEnergy = energy - 200;
    var body = [WORK, CARRY, MOVE];
    //TODO determine max amount to spend for role
        switch(role) {
            case "harvester": 
                
                    //spend half on work parts
                    var workBoundary = remainingEnergy * 0.3 + 100;
                    for(var i = remainingEnergy; i > workBoundary; i = i - 100) {
                          body.push(WORK);
                          remainingEnergy = remainingEnergy - 100;
                    }
                    
                     //spend quarter on move parts
                    var moveBoundary = remainingEnergy * 0.5 + 50;
                    for(var i = remainingEnergy; i > moveBoundary; i = i - 50) {
                          body.push(MOVE);
                          remainingEnergy = remainingEnergy - 50;
                    }
                    
                      //spend rest on carry parts
                    for(var i = remainingEnergy; i >= 50; i = i - 50) {
                          body.push(CARRY);
                          remainingEnergy = remainingEnergy - 50;
                    }
                    
                    console.log("Determined the following body for role harvester: " + body);
                return body;
                break;
            case "upgrader":
                
                //spend half on work parts
                    var workBoundary = remainingEnergy * 0.5 + 100;
                    for(var i = remainingEnergy; i > workBoundary; i = i - 100) {
                          body.push(WORK);
                          remainingEnergy = remainingEnergy - 100;
                    }
                    
                     //spend quarter on carry parts
                    var moveBoundary = remainingEnergy * 0.5 + 50;
                    for(var i = remainingEnergy; i > moveBoundary; i = i - 50) {
                          body.push(MOVE);
                          remainingEnergy = remainingEnergy - 50;
                    }
                    
                      //spend rest on carry parts
                    for(var i = remainingEnergy; i >= 50; i = i - 50) {
                          body.push(CARRY);
                          remainingEnergy = remainingEnergy - 50;
                    }
                    
                    console.log("Determined the following body for role harvester: " + body);
                   return body;
                break;
            case "builder":
                //spend half on work parts
                    var workBoundary = remainingEnergy * 0.5 + 100;
                    for(var i = remainingEnergy; i > workBoundary; i = i - 100) {
                          body.push(WORK);
                          remainingEnergy = remainingEnergy - 100;
                    }
                    
                     //spend quarter on move parts
                    var moveBoundary = remainingEnergy * 0.5 + 50;
                    for(var i = remainingEnergy; i > moveBoundary; i = i - 50) {
                          body.push(MOVE);
                          remainingEnergy = remainingEnergy - 50;
                    }
                    
                      //spend rest on carry parts
                    for(var i = remainingEnergy; i >= 50; i = i - 50) {
                          body.push(CARRY);
                          remainingEnergy = remainingEnergy - 50;
                    }
                    
                    console.log("Determined the following body for role harvester: " + body);
                   return body;
                break;
        }
    }
};

module.exports = autoSpawn;


