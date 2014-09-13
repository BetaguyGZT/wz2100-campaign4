// rules.js -- violated by Goth for Campaign 4 | Nearly-final version | September 2013 | wz2100.net

// General rules for the campaign
// Enable basic things needed by the player
// Starting in Warzone 3.2 (or roundabouts, whenever Cam 4 gets ported to .js) individual mission scrips will be in /scripts/cam4-[whatever]/main.js or
// something to that effect. Whatever the convention ends up being.

// Includes
include("script/4-1/cam4-1.js"); // the main mission script for 4-1 -- has its' own includes. We're including it here for the global variables. (Do we need to?)

// "Weapon Paths" Research includes
include("script/research.js_inc"); // For Goth's MP-like research implementation for Campaign mode -- individual weapon paths make the scripts easier to work with. Please note that we're using Contingency, USM and the Extra Objects (mainly Berg's stuff) here.
include("script/researchMG.js_path"); // MG Path
include("script/researchMO.js_path"); // Mortars Path**
include("script/researchRO.js_path"); // Rockets Path
include("script/researchFL.js_path"); // Flamers Path
include("script/researchCN.js_path"); // Cannons Path**
include("script/researchEN.js_path"); // Lasers Path
include("script/researchRA.js_path"); // Railguns Path**
include("script/researchAR.js_path"); // Artillery Path**
include("script/researchAA.js_path"); // Anti-Aircraft Path -- not everyone will use these
include("script/researchBO.js_path"); // VTOL Bombs Path -- not everyone will use these either
// ** indicates that it needs tuning and community testing

// SitRep
// We'll be using these arrays to ensure that the sound effects that we'll be using won't flood the player's ears with redundant info.
var lastDetectTime = [0,0,0,0,0,0,0,0,0];
var lastHitTime = [0,0,0];
var lastDestroyedTime = [0,0,0,0,0];
var powerTimer = [0,0];
var playerDefeated = [0,0,0,0,0,0,0,0,0,0,0,0];
var factories = 0;
var droids = 0;
var scavengerPlayer = 4;

//Set missing players' playerDefeated flags to 1 so that the "player defeated" message doesn't play on game start.
factories = enumStruct(selectedPlayer,CYBORG_FACTORY).length + enumStruct(selectedPlayer,FACTORY).length + enumStruct(selectedPlayer,VTOL_FACTORY).length;
droids = enumDroid(selectedPlayer).length;
if (factories == 0 && droids == 0)
{
	playerDefeated[selectedPlayer] = 1;
}

function eventStartLevel()
{
	// Disable design if no Command Centre -- we're using the Minimap toggle elsewhere, so just turn it off here.
	setMiniMap(true);
	setDesign(false);

	enableStructure("A0CommandCentre", selectedPlayer);		// make structures available to build
	enableStructure("A0LightFactory", selectedPlayer);
	enableStructure("A0ResourceExtractor", selectedPlayer);
	enableStructure("A0PowerGenerator", selectedPlayer);
	enableStructure("A0ResearchFacility", selectedPlayer);

	// We need to enable these in order for scripts to be able to generate their templates.
	makeComponentAvailable("CyborgSpade", selectedPlayer);
	makeComponentAvailable("CyborgRepair", selectedPlayer);
	makeComponentAvailable("CyborgSpade2", selectedPlayer);
	makeComponentAvailable("CyborgRepair2", selectedPlayer);
	makeComponentAvailable("CyborgSpade3", selectedPlayer);
	makeComponentAvailable("CyborgRepair3", selectedPlayer);
	makeComponentAvailable("CyborgSpade4", selectedPlayer);
	makeComponentAvailable("CyborgRepair4", selectedPlayer);
	makeComponentAvailable("CyborgLegs", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Atmiss", selectedPlayer);
	makeComponentAvailable("CyborgCannon", selectedPlayer);
	makeComponentAvailable("CyborgChaingun", selectedPlayer);
	makeComponentAvailable("CyborgFlamer01", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Grenade", selectedPlayer);
	makeComponentAvailable("Cyb-Hvywpn-A-T", selectedPlayer);
	makeComponentAvailable("Cyb-Hvywpn-Acannon", selectedPlayer);
	makeComponentAvailable("Cyb-Hvywpn-HPV", selectedPlayer);
	makeComponentAvailable("Cyb-Hvywpn-Mcannon", selectedPlayer);
	makeComponentAvailable("Cyb-Hvywpn-PulseLsr", selectedPlayer);
	makeComponentAvailable("Cyb-Hvywpn-RailGunner", selectedPlayer);
	makeComponentAvailable("Cyb-Hvywpn-TK", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Laser", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Rail1", selectedPlayer);
	makeComponentAvailable("CyborgRocket", selectedPlayer);
	makeComponentAvailable("CyborgRotMG", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Thermite", selectedPlayer);
	makeComponentAvailable("CyborgFlamer01", selectedPlayer);
	makeComponentAvailable("HvyCybSpade", selectedPlayer);
	makeComponentAvailable("HvyCybRepair", selectedPlayer);
	makeComponentAvailable("HvyCybSpade2", selectedPlayer);
	makeComponentAvailable("HvyCybRepair2", selectedPlayer);
	makeComponentAvailable("HvyCybSpade3", selectedPlayer);
	makeComponentAvailable("HvyCybRepair3", selectedPlayer);
	makeComponentAvailable("HvyCybSpade4", selectedPlayer);
	makeComponentAvailable("HvyCybRepair4", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-MortarInc", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-MortarRot", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Cannon-HPVAslt", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Cannon-HPVLgt", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Cannon-Shotgun", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Cannon-Sniper", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-EMP", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Flamer1", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Flamer2", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Flamer3", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Laser-AP1", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Laser-AP1", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Laser-AT1", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Laser-AT1", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Laser-AP3", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Laser-AP3", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Laser-AT3", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Laser-AT3", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-MG3", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-MG4", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-MG-AntiTank", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-MG-AntiTank2", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-MG3Inc", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-MG3Inc", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-MG4Inc", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-MG4Inc", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Railgun-Gattling", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Railgun-Shotgun", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Railgun-Sniper", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Railgun-Aslt", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Rocket-Pod", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Rocket-Pod2", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Rocket-Pod3", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Rocket-LtA-T", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Rocket-HvyA-T", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Rocket-MRL", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Rocket-Sunburst", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Rocket-Sunburst", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Missile-MdArt", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Missile-LtSAM", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Missile-HvySAM", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Rocket-TopAttack", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-Rocket-Cherub", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-Rocket-Cherub", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-SpyTurret01", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-SpyTurret02", selectedPlayer);
	makeComponentAvailable("Cyb-Wpn-SpyTurret03", selectedPlayer);
	makeComponentAvailable("HvyCyb-Wpn-SpyTurretNEXUS", selectedPlayer);
	
	setStructureLimits("A0CommandCentre", 1, selectedPlayer);	// set structure limits
	setStructureLimits("A0LightFactory", 10, selectedPlayer);
	setStructureLimits("A0PowerGenerator", 64, selectedPlayer);
	setStructureLimits("A0ResearchFacility", 10, selectedPlayer);
	setStructureLimits("A0ComDroidControl", 16, selectedPlayer);
	setStructureLimits("A0CyborgFactory", 10, selectedPlayer);
	setStructureLimits("A0VTolFactory1", 10, selectedPlayer);
	setStructureLimits("A0LasSatCommand", 1, selectedPlayer);
	applyLimitSet();	// set limit options
	
	enableTemplate("ConstructionDroid"); // To fix bug #16 in Cam 4
	
	// Startup research
	completeResearch("R-Vehicle-Prop-Wheels", selectedPlayer);
	completeResearch("R-Sys-Spade1Mk1", selectedPlayer);
	completeResearch("R-Vehicle-Body01", selectedPlayer);
	completeResearch("R-Comp-SynapticLink", selectedPlayer);
	enableResearch("R-Sys-Engineering01", selectedPlayer);
	enableResearch("R-Defense-TankTrap01", selectedPlayer);
	enableResearch("R-Vehicle-Body04", selectedPlayer);
	enableResearch("R-Sys-Spade1Hvy", selectedPlayer);
	// Now for weapon paths -- See research.js_inc for the rest of the tree - we just enable the weapon paths at game start.
	enableResearch("R-PATH-Wpn-MG", selectedPlayer);
	enableResearch("R-PATH-Wpn-Mortar", selectedPlayer);
	enableResearch("R-PATH-Wpn-Rocket", selectedPlayer);
	enableResearch("R-PATH-Wpn-Flame", selectedPlayer);
	enableResearch("R-PATH-Wpn-Cannon", selectedPlayer);
	enableResearch("R-PATH-Wpn-Energy", selectedPlayer);
	enableResearch("R-PATH-Wpn-Railgun", selectedPlayer);
	enableResearch("R-PATH-Wpn-Arty", selectedPlayer);
	enableResearch("R-PATH-Wpn-AA", selectedPlayer);
		
	var structlist = enumStruct(me, HQ);
	for (var i = 0; i < structlist.length; i++)
	{
		// Simulate build events to enable unit design when an HQ exists
		eventStructureBuilt(structlist[i]);
	}
	structlist = enumStructOffWorld(me, HQ);
	for (var i = 0; i < structlist.length; i++)
	{
		eventStructureBuilt(structlist[i]);
	}
	
	setTimer("checkEndConditions", 1000);
	setTimer("sitRep", 1000);
	setTimer("checkResearchFlags", 1000);
	console("Rules.js is asking if this thing is on?", "Looks like it is!");
}

// The rest of the stuff needed by rules.js
function eventStructureBuilt(struct)
{
	if (struct.player == selectedPlayer && struct.type == STRUCTURE && struct.stattype == HQ)
	{
		// Enable unit design and minimap when an HQ gets built
		setMiniMap(true);
		setDesign(true);
	}
}

// /////////////////////////////////////////////////////////////////
// WARNING MESSAGES
// Enemy Detected
function eventObjectSeen(viewer, detectedObj)
{
	if (detectedObj.player != selectedPlayer && allianceExistsBetween(selectedPlayer,detectedObj.player) != true && (viewer.player == selectedPlayer || allianceExistsBetween(selectedPlayer,viewer.player))) //Does the viewer belong to either the player or one of his/her allies, and is the detected object an enemy object?
	{
		if (detectedObj.type == DROID) //Enemy unit detected
		{
			if (detectedObj.player == scavengerPlayer) //Scavenger unit detected
			{
				if (gameTime > lastDetectTime[0] + 3000)
				{
					playSound("pcv373.ogg", detectedObj.x, detectedObj.y, detectedObj.z);
				}
				lastDetectTime[0] = gameTime;
			}
			else if (detectedObj.droidType == DROID_TRANSPORTER || detectedObj.droidType == DROID_SUPERTRANSPORTER) //Enemy transport detected
			{
				if (gameTime > lastDetectTime[1] + 3000)
				{
					playSound("pcv388.ogg", detectedObj.x, detectedObj.y, detectedObj.z);
				}
				lastDetectTime[1] = gameTime;
			}
			else if (detectedObj.isVTOL) //Enemy VTOL detected
			{
				if (gameTime > lastDetectTime[2] + 3000)
				{
					playSound("pcv388.ogg", detectedObj.x, detectedObj.y, detectedObj.z);
				}
				lastDetectTime[2] = gameTime;
			}
			else if (detectedObj.hasIndirect && detectedObj.range > 2000) //Enemy artillery detected. NOTE: We need to exclude the more short-ranged indirect-fire units, like Mini-Rocket Arrays.
			{
				if (gameTime > lastDetectTime[3] + 3000)
				{
					playSound("pcv387.ogg", detectedObj.x, detectedObj.y, detectedObj.z);
				}
				lastDetectTime[3] = gameTime;
			}
			else
			{
				if (gameTime > lastDetectTime[4] + 3000) //Play generic enemy unit detected sound
				{
					playSound("pcv378.ogg", detectedObj.x, detectedObj.y, detectedObj.z);
				}
				lastDetectTime[4] = gameTime;
			}
		}
		else if (detectedObj.type == STRUCTURE && detectedObj.stattype != WALL && detectedObj.stattype != GATE) //Enemy structure detected (excluding walls or gates)
		{
			if (detectedObj.player == scavengerPlayer && !(detectedObj.hasIndirect && detectedObj.range > 2000)) //Scavenger structure detected
			{
				if (detectedObj.stattype == DEFENSE) //Scavenger defense detected
				{
					if (gameTime > lastDetectTime[5] + 3000)
					{
						playSound("pcv375.ogg", detectedObj.x, detectedObj.y, detectedObj.z);
					}
					lastDetectTime[5] = gameTime;
				}
				else //Scavenger base detected
				{
					if (gameTime > lastDetectTime[6] + 3000)
					{
						playSound("pcv374.ogg", detectedObj.x, detectedObj.y, detectedObj.z);
					}
					lastDetectTime[6] = gameTime;
				}
			}
			else if (detectedObj.hasIndirect && detectedObj.range > 2000) //Enemy artillery detected. NOTE: We need to exclude the more short-ranged indirect-fire units, like Mini-Rocket Arrays.
			{
				if (gameTime > lastDetectTime[7] + 3000)
				{
					playSound("pcv387.ogg", detectedObj.x, detectedObj.y, detectedObj.z);
				}
				lastDetectTime[7] = gameTime;
			}
			else //Enemy player's structure detected
			{
				if (gameTime > lastDetectTime[8] + 3000)
				{
					playSound("pcv379.ogg", detectedObj.x, detectedObj.y, detectedObj.z);
				}
				lastDetectTime[8] = gameTime;
			}
		}
	}
}

// Under Attack
function eventAttacked(victimObj, attackerObj)
{
	if (victimObj.type == STRUCTURE) //Structure under attack
	{
		if (victimObj.stattype == RESOURCE_EXTRACTOR && gameTime > lastHitTime[0] + 5000) //Derrick under attack
		{
			lastHitTime[0] = gameTime;
			playSound("pcv345.ogg", victimObj.x, victimObj.y, victimObj.z);	// show position if still alive
		}
		else if (gameTime > lastHitTime[1] + 5000)//Generic structure under attack
		{
			lastHitTime[1] = gameTime;
			playSound("pcv337.ogg", victimObj.x, victimObj.y, victimObj.z);
		}
	}
	else if (victimObj.type == DROID && gameTime > lastHitTime[2] + 5000) //Unit under attack
	{
		lastHitTime[2] = gameTime;
		playSound("pcv399.ogg", victimObj.x, victimObj.y, victimObj.z);
	}
}

function eventDestroyed(victim)
{
	if (victim.player == selectedPlayer)
	{
		if (victim.type == DROID && gameTime > lastDestroyedTime[0] + 3000) //Unit destroyed
		{
			playSound("pcv400.ogg", victim.x, victim.y, victim.z);
			lastDestroyedTime[0] = gameTime;
		}
		else if (victim.type == STRUCTURE)
		{
			if (victim.stattype == RESOURCE_EXTRACTOR && gameTime > lastDestroyedTime[1] + 3000) //Oil derrick destroyed
			{
				playSound("pcv346.ogg", victim.x, victim.y, victim.z);
				lastDestroyedTime[1] = gameTime;
			}
			else if (victim.stattype == POWER_GEN && gameTime > lastDestroyedTime[2] + 3000) //Power generator destroyed
			{
				playSound("pcv342.ogg", victim.x, victim.y, victim.z);
				lastDestroyedTime[2] = gameTime;
			}
			else if ((victim.stattype == LASSAT || victim.name == "Laser Satellite Command Post") && gameTime > lastDestroyedTime[3] + 3000) //LasSat Command Post destroyed
			{
				playSound("pcv651a.ogg", victim.x, victim.y, victim.z);
				lastDestroyedTime[3] = gameTime;
			}
			else
			{
				if (gameTime > lastDestroyedTime[4] + 3000) //Play generic structure destroyed sound
				{
					playSound("pcv620.ogg", victim.x, victim.y, victim.z);
					lastDestroyedTime[4] = gameTime;
				}
				if (victim.stattype == HQ && !enumStruct(selectedPlayer,HQ).length) //HQ destroyed
				{
					setMiniMap(false); // hide minimap if HQ is destroyed
					setDesign(false); // and disallow design
				}
			}
		}
	}
}

function eventObjectTransfer(transObj,prevOwner)
{
	if (transObj.type == DROID)
	{
		orderDroid(transObj,DORDER_STOP); //Tell the droid to stop what it's doing when being transferred.
	}
}

// /////////////////////////////////////////////////////////////////
// Display miscellaneous situations to player that cannot be called by other known events.

function sitRep()
{
	if (playerPower(selectedPlayer) < 1 && gameTime > powerTimer[0]+15000)
	{
		playSound("pcv343.ogg"); //Warn the player that his/her power is low.
		powerTimer[0] = gameTime;
	}
	if (enumStruct(selectedPlayer,RESOURCE_EXTRACTOR).length > enumStruct(selectedPlayer,POWER_GEN).length*4 && gameTime > powerTimer[1]+15000)
	{
		playSound("pcv349.ogg"); //Warn the player that he/she needs more power generators.
		powerTimer[1] = gameTime;
	}
}

// Check research flags
function checkResearchFlags()
{
	// Level 2
	if (resPathMG == 2)
	{
		enableResearch("R-Wpn-MG-Accuracy04", selectedPlayer);
		enableResearch("R-Wpn-MG-Damage04", selectedPlayer);
		enableResearch("R-Wpn-MG-ROF04", selectedPlayer);
	}
	if (resPathMor == 2)
	{
		enableResearch("R-Wpn-Artillery-Damage04", selectedPlayer);
		enableResearch("R-Wpn-Artillery-ROF04", selectedPlayer);
		enableResearch("R-Wpn-Artillery-Accuracy04", selectedPlayer);
	}
	if (resPathRocket == 2)
	{
		enableResearch("R-Wpn-Rocket-Damage04", selectedPlayer);
		enableResearch("R-Wpn-Rocket-ROF04", selectedPlayer);
		enableResearch("R-Wpn-Rocket-Accuracy04", selectedPlayer);
	}
	if (resPathCannon == 2)
	{
		enableResearch("R-Wpn-Cannon-Damage04", selectedPlayer);
		enableResearch("R-Wpn-Cannon-ROF04", selectedPlayer);
		enableResearch("R-Wpn-Cannon-Accuracy04", selectedPlayer);
	}
	if (resPathFlame == 2)
	{
		enableResearch("R-Wpn-Flamer-Damage04", selectedPlayer);
		enableResearch("R-Wpn-Flamer-ROF04", selectedPlayer);
	}
	if (resPathArty == 2)
	{
		enableResearch("R-Wpn-Howitzer-Damage03", selectedPlayer);
		enableResearch("R-Wpn-Howitzer-ROF02", selectedPlayer);
		enableResearch("R-Wpn-Howitzer-Accuracy02", selectedPlayer);
	}
	if (resPathLaser == 2)
	{
		enableResearch("R-Wpn-Energy-Accuracy04", selectedPlayer);
		enableResearch("R-Wpn-Energy-ROF04", selectedPlayer);
		enableResearch("R-Wpn-Energy-Damage04", selectedPlayer);
	}
	if (resPathRail == 2)
	{
		enableResearch("R-Wpn-Rail-Accuracy03", selectedPlayer);
		enableResearch("R-Wpn-Rail-Damage03", selectedPlayer);
		enableResearch("R-Wpn-Rail-ROF03", selectedPlayer);
	}
	// Level 3
	if (resPathMG == 3) // MG Path Level 3
	{
		enableResearch("R-Wpn-MG-Accuracy07", selectedPlayer);
		enableResearch("R-Wpn-MG-Damage07", selectedPlayer);
		enableResearch("R-Wpn-MG-ROF07", selectedPlayer);
	}
	if (resPathMor == 3) // Mortars Path Level 3
	{
		enableResearch("R-Wpn-Artillery-Damage07", selectedPlayer);
		enableResearch("R-Wpn-Artillery-ROF07", selectedPlayer);
		enableResearch("R-Wpn-Artillery-Accuracy07", selectedPlayer);
	}
	if (resPathRocket == 3) // Rockets Path Level 3
	{
		enableResearch("R-Wpn-Rocket-Damage07", selectedPlayer);
		enableResearch("R-Wpn-Rocket-ROF07", selectedPlayer);
		enableResearch("R-Wpn-Rocket-Accuracy07", selectedPlayer);
	}
	if (resPathCannon == 3) // Cannons Path Level 3
	{
		enableResearch("R-Wpn-Cannon-Damage07", selectedPlayer);
		enableResearch("R-Wpn-Cannon-ROF07", selectedPlayer);
		enableResearch("R-Wpn-Cannon-Accuracy07", selectedPlayer);
	}
	if (resPathFlame == 3) // Flamers Path Level 3
	{
		enableResearch("R-Wpn-Flamer-Damage07", selectedPlayer);
		enableResearch("R-Wpn-Flamer-ROF07", selectedPlayer);
	}
	if (resPathArty == 3)
	{
		enableResearch("R-Wpn-Howitzer-Damage04", selectedPlayer);
		enableResearch("R-Wpn-Howitzer-ROF03", selectedPlayer);
		enableResearch("R-Wpn-Howitzer-Accuracy03", selectedPlayer);
	}
	if (resPathRail == 3)
	{
		enableResearch("R-Wpn-Rail-Accuracy04", selectedPlayer);
		enableResearch("R-Wpn-Rail-Damage04", selectedPlayer);
		enableResearch("R-Wpn-Rail-ROF04", selectedPlayer);
	}
	if (resPathLaser == 3)
	{
		enableResearch("R-Wpn-Energy-Accuracy07", selectedPlayer);
		enableResearch("R-Wpn-Energy-ROF07", selectedPlayer);
		enableResearch("R-Wpn-Energy-Damage07", selectedPlayer);
	}
	// Level 4
	if (resPathMG == 4) // MG Path Level 4
	{
		enableResearch("R-Wpn-MG-AntiTank", selectedPlayer); // Best MG that is NOT a combo one
		enableResearch("R-Defense-Super-Machinegun", selectedPlayer); // Do Fortresses too since it's likely we've researched the Fortress base structure by this point
		enableResearch("R-Defense-Super-MachinegunPlas", selectedPlayer);
		resPathMG == 5 // Flag it to disable
	}
	if (resPathMor == 4) // Mortars Path Level 4
	{
		enableResearch("R-Wpn-Mortar-Gauss", selectedPlayer); // Best Mortar line that is NOT a combo one
		enableResearch("R-Defense-Super-Mortar", selectedPlayer); 
		enableResearch("R-Defense-Super-MortarPlas", selectedPlayer); 
		enableResearch("R-Defense-Super-MortarRamjet", selectedPlayer); 
		enableResearch("R-Defense-Super-MortarGauss", selectedPlayer); 
		enableResearch("R-Defense-Super-MortarGaussPlas", selectedPlayer); 
		enableResearch("R-Defense-Super-MortarGaussRamjet", selectedPlayer); 
		resPathMor == 5 // Flag it to disable
	}
	if (resPathRocket == 4) // Rockets Path Level 4
	{
		enableResearch("R-Wpn-Rocket-TopAttack", selectedPlayer); // Best Rocket that is NOT a combo one
		enableResearch("R-Defense-Super-Rocket", selectedPlayer); // Space KITAAAAAA! (Kamen Rider fans will know the reference .. )
		enableResearch("R-Defense-Super-Missile", selectedPlayer);
		enableResearch("R-Defense-Super-MissileArray", selectedPlayer);
		enableResearch("R-Defense-Super-MissileArrayPlas", selectedPlayer);
		resPathRocket == 5 // Flag it to disable the upgrade checks
	}
	if (resPathCannon == 4) // Cannons Path Level 4
	{
		enableResearch("R-Wpn-PlasmaCannon", selectedPlayer); // Best Cannon that is NOT a combo one
		enableResearch("R-Defense-Super-RotCannon", selectedPlayer);
		enableResearch("R-Defense-Super-PlasCannon", selectedPlayer);
		enableResearch("R-Defense-Super-Cannon", selectedPlayer);
		resPathCannon == 5 // Flag it to disable the upgrade checks
	}
	if (resPathFlame == 4) // Flamers Path Level 4
	{
		enableResearch("R-Wpn-Flamer-PlasCan-TankDest", selectedPlayer); // Best Flamer that is NOT a combo one
		enableResearch("R-Defense-Super-FlamerPlasma", selectedPlayer);
		resPathFlame == 5 // Flag it to disable the upgrade checks
	}
	if (resPathArty == 4) // Howitzers Level 4
	{
		enableResearch("R-Wpn-Howitzer-Damage05", selectedPlayer);
		enableResearch("R-Wpn-Howitzer-ROF04", selectedPlayer);
		enableResearch("R-Defense-Super-Howitzer", selectedPlayer);
		enableResearch("R-Defense-Super-HowitzerPlas", selectedPlayer);
		enableResearch("R-Defense-Super-HowitzerRamjet", selectedPlayer);
		enableResearch("R-Defense-Super-HowitzerGauss", selectedPlayer);
		enableResearch("R-Defense-Super-HowitzerGaussPlas", selectedPlayer);
		enableResearch("R-Defense-Super-HowitzerGaussRamjet", selectedPlayer);
		resPathArty == 5 // Flag it to disable the upgrade checks
	}
	if (resPathRail == 4) // Doing Level 4 Rail a little differently...
	{
		enableResearch("R-Wpn-Rail-Accuracy06", selectedPlayer);
		enableResearch("R-Wpn-Rail-Damage06", selectedPlayer);
		enableResearch("R-Wpn-Rail-ROF06", selectedPlayer);
		resPathRail== 5 // Flag it to disable the upgrade checks
	}
}
