/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('auto.spawn');
 * mod.thing == 'a thing'; // true
 */
 
  var autoSpawn = {
     defaultBody: [WORK,CARRY,MOVE],
     roles: {
       builder: "builder",
       harvester: "harvester",
       upgrader: "upgrader"
     },
     run: function() {
        this.garbageCollector();
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == this.roles.harvester);
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == this.roles.builder);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == this.roles.upgrader);

        if(harvesters.length < 2) {
            this.spawn(this.defaultBody, this.roles.harvester);
        }
        
             
         if(upgraders.length < 1) {
           this.spawn(this.defaultBody, this.roles.upgrader);
        }
        
         if(builders.length < 1) {
          this.spawn(this.defaultBody, this.roles.builder);
        }
   
     },
     garbageCollector: function() {
           for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
         
     },
    spawn: function(creepBody, role) {
        if(Game.spawns['Spawn1'].canCreateCreep(creepBody) === 0) {
            var newName = Game.spawns['Spawn1'].createCreep(creepBody, undefined, {role: role});
            console.log('Spawning new '+role+': ' + newName); 
        }
    }
 };

module.exports = autoSpawn;



   