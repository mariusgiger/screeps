var roleBase = require('role.base');
var roleUpgrader = require('role.harvester'); //TODO change back to upgrader
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
        
        if(creep.memory.currentTicks > 30) {
            creep.memory.noSites = false;
            creep.memory.currentTicks = 0;
        }
        
        if(creep.memory.noSites) {
            roleUpgrader.run(creep);
            return;
        }

        if (creep.memory.constructionSiteId === undefined) { //only gets executed on init
            var constructionSites = this.findConstructionSites(creep);

            if (!constructionSites.length) {
                console.log("no construction sites found");
                creep.memory.noSites = true;
                roleUpgrader.run(creep);
                return;
            }

            creep.memory.constructionSiteId = constructionSites[0].id;
        }

        var constructionSite = Game.getObjectById(creep.memory.constructionSiteId);

        if (!constructionSite) {
            console.log("builder needs new target");
            var constructionSites = this.findConstructionSites(creep);

            if (!constructionSites.length) {
                console.log("no construction sites found");
                creep.memory.noSites = true;
                roleUpgrader.run(creep);
                return;
            }

            creep.memory.constructionSiteId = constructionSites[0].id;
            constructionSite = constructionSites[0];
        }


        if (creep.memory.building) {

            if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSite);
            }
        }
        else {
            roleBase.getEnergyFromContainers(creep);
        }
    },
    findConstructionSites: function (creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        return targets;
    }
};

module.exports = roleBuilder;