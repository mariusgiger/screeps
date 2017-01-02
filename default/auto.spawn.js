var stats = require("stats");
var spawn = (function() {
    var defaultBody = [WORK, CARRY, MOVE];
    var maxSpawnEnergyThreshhold = 700;
    var currentSpawn = "Spawn1";
    var roles = {
        builder: "builder",
        harvester: "harvester",
        upgrader: "upgrader",
        repairer: "repairer",
        supplier: "supplier"
    };
    
    function run() {
        garbageCollector();
        
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == roles.harvester);
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == roles.builder);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == roles.upgrader);
        var suppliers = _.filter(Game.creeps, (creep) => creep.memory.role == roles.supplier);
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == roles.repairer);
        
        stats.info("currently there are. harvesters: " + harvesters.length + ", upgraders: " + upgraders.length + ", builders: " + builders.length +", suppliers: "+suppliers.length + " , repairers: "+repairers.length);
        
        if (currentlySpawning()) {
            return;
        }

        if (harvesters.length < 6 && Game.spawns['Spawn1'].canCreateCreep(defaultBody) === 0) {
            Memory.creepNr = Memory.creepNr || -1;
            Memory.creepNr = Memory.creepNr + 1;
            
            spawn(determineBody(roles.harvester), {
                role: roles.harvester,
                creepNr: Memory.creepNr % 5
                });
            return;
        }
        
        if (suppliers.length < 3 && Game.spawns['Spawn1'].canCreateCreep(defaultBody) === 0) {
            spawn(defaultBody, { role: roles.supplier });
            return;
        }

        if (upgraders.length < 2 && Game.spawns['Spawn1'].canCreateCreep(defaultBody) === 0) {
            spawn(defaultBody, { role: roles.upgrader });
            return;
        }

        if (builders.length < 2 && Game.spawns['Spawn1'].canCreateCreep(defaultBody) === 0) {
            spawn(defaultBody, {role: roles.builder});
            return;
        }
        
        if (repairers.length < 2 && Game.spawns['Spawn1'].canCreateCreep(defaultBody) === 0) {
            spawn(defaultBody, {role: roles.repairer});
            return;
        }
    }
    
    function garbageCollector() {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                stats.debug('Clearing non-existing creep memory:' + name);
            }
        }
    }
    
    function spawn(creepBody, opts) {
        if (Game.spawns[currentSpawn].canCreateCreep(creepBody) === OK) {
            var newName = Game.spawns[currentSpawn].createCreep(creepBody, undefined, opts);
            console.log(opts.toString());
            stats.debug('Spawning new ' + opts.role + ': ' + newName);
            return newName;
        } else {
            return null;
        }
    }
    
    function getEnergyAvailable(room) {
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
    }
    
    function currentlySpawning() {
        return Game.spawns[currentSpawn].spawning != null;
    }
    
    function determineBody (role) {
        var energy = getEnergyAvailable(Game.spawns['Spawn1'].room);   
        var remainingEnergy = energy - 200;
        remainingEnergy = remainingEnergy < maxSpawnEnergyThreshhold ? remainingEnergy : maxSpawnEnergyThreshhold;
        console.log("remeng"+ remainingEnergy);
        var body;
        
        switch(role) {
            case roles.harvester: 
                body = computeParts(remainingEnergy, 0.5, 0.25, 0.25);
                break;
            case roles.supplier:
            case roles.builder:
            case roles.repairer:
            case roles.upgrader:
                body = computeParts(remainingEnergy, 0.25, 0.5, 0.25);
                break;    
            default:
                body = computeParts(remainingEnergy);
        }
        
        console.log("Determined the following body for role "+role+" : " + body.toString());
        return body;
    }
    
    function computeParts(energy, work, carry, move) {
        var body = [WORK, CARRY, MOVE];
        
        var max = work + carry + move;
        if(!max || max < 0 || max > 1) {
            stats.error("parts for creep could not be computed because the energy limit was exceeded");
            return defaultBody;
        }
        
        if(work) {
            var boundary = energy - energy * work;
            for(; energy > boundary; energy = energy - 100) {
                body.push(WORK);
            }
        }
        
        if(carry) {
            var boundary = energy - energy * carry;
            for(; energy > boundary; energy = energy - 50) {
                body.push(CARRY);
            }
        }
        
        if(move) {
            var boundary = energy - energy * carry;
            for(; energy > boundary; energy = energy - 50) {
                body.push(MOVE);
            }
        }
        
        return body;
    }
   return {
       run: run,
       getEnergyAvailable: getEnergyAvailable
   };
    
})();

module.exports = spawn;


