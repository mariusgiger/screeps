var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSupplier = require('role.supplier');
var roleRepairer = require('role.repairer');
var autoSpawn = require('auto.spawn');
var autoDefense = require('auto.defense');

module.exports.loop = function () {
    
    autoSpawn.run();
    //autoDefense.run(Game.spawns["Spawn1"].room.name);
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'supplier') {
            roleSupplier.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
}