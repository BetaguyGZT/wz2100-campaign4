//
// Skirmish Base Script.
//
// contains the rules for starting and ending a game.
// as well as warning messages.
//
// /////////////////////////////////////////////////////////////////

// Code modified by Shadow Wolf TJC for Warzone 2100: Contingency

// This mod has a built-in tier limiter. By default, this limiter is disabled. However, when other mods are loaded, the limiter can be set to disable T1 or T2 tech.
var tierLimit = 3;
include ("tier1limiter.js");
include ("tier2limiter.js");

// We'll be using these arrays to ensure that the sound effects that we'll be using won't flood the player's ears with redundant info. ;)
var lastDetectTime = [0,0,0,0,0,0,0,0,0];
var lastHitTime = [0,0,0];
var lastDestroyedTime = [0,0,0,0,0];
var powerTimer = [0,0];
var playerDefeated = [0,0,0,0,0,0,0,0,0,0,0,0];

var scavengerPlayer = 7; //We'll need to identify the scavenger player for some of our scripts.

var additionalPower = [0,0,0,0,0,0,0,0,0,0,0,0]; //This mod makes usage of alternate means of getting power, such as wind farms. Players also receive 1 free unit of power every second, so even if they don't have any Oil Derricks, they'll still receive a small trickle of power with which to build new stuff.

if (maxPlayers >= 8)
{
	scavengerPlayer = maxPlayers;
}

var factories = 0;
var droids = 0;

function eventGameInit()
{
	hackNetOff();
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		enableStructure("A0CommandCentre", playnum);		// make structures available to build
		enableStructure("A0LightFactory", playnum);
		enableStructure("A0ResourceExtractor", playnum);
		enableStructure("A0PowerGenerator", playnum);
		enableStructure("A0ResearchFacility", playnum);

		// We need to enable these in order for scripts to be able to generate their templates.
		makeComponentAvailable("CyborgSpade", playnum);
		makeComponentAvailable("CyborgRepair", playnum);
		makeComponentAvailable("CyborgSpade2", playnum);
		makeComponentAvailable("CyborgRepair2", playnum);
		makeComponentAvailable("CyborgSpade3", playnum);
		makeComponentAvailable("CyborgRepair3", playnum);
		makeComponentAvailable("CyborgSpade4", playnum);
		makeComponentAvailable("CyborgRepair4", playnum);
		makeComponentAvailable("CyborgLegs", playnum);
		makeComponentAvailable("Cyb-Wpn-Atmiss", playnum);
		makeComponentAvailable("CyborgCannon", playnum);
		makeComponentAvailable("CyborgChaingun", playnum);
		makeComponentAvailable("CyborgFlamer01", playnum);
		makeComponentAvailable("Cyb-Wpn-Grenade", playnum);
		makeComponentAvailable("Cyb-Hvywpn-A-T", playnum);
		makeComponentAvailable("Cyb-Hvywpn-Acannon", playnum);
		makeComponentAvailable("Cyb-Hvywpn-HPV", playnum);
		makeComponentAvailable("Cyb-Hvywpn-Mcannon", playnum);
		makeComponentAvailable("Cyb-Hvywpn-PulseLsr", playnum);
		makeComponentAvailable("Cyb-Hvywpn-RailGunner", playnum);
		makeComponentAvailable("Cyb-Hvywpn-TK", playnum);
		makeComponentAvailable("Cyb-Wpn-Laser", playnum);
		makeComponentAvailable("Cyb-Wpn-Rail1", playnum);
		makeComponentAvailable("CyborgRocket", playnum);
		makeComponentAvailable("CyborgRotMG", playnum);
		makeComponentAvailable("Cyb-Wpn-Thermite", playnum);
		makeComponentAvailable("CyborgFlamer01", playnum);
		makeComponentAvailable("HvyCybSpade", playnum);
		makeComponentAvailable("HvyCybRepair", playnum);
		makeComponentAvailable("HvyCybSpade2", playnum);
		makeComponentAvailable("HvyCybRepair2", playnum);
		makeComponentAvailable("HvyCybSpade3", playnum);
		makeComponentAvailable("HvyCybRepair3", playnum);
		makeComponentAvailable("HvyCybSpade4", playnum);
		makeComponentAvailable("HvyCybRepair4", playnum);
		makeComponentAvailable("Cyb-Wpn-MortarInc", playnum);
		makeComponentAvailable("HvyCyb-Wpn-MortarRot", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Cannon-HPVAslt", playnum);
		makeComponentAvailable("Cyb-Wpn-Cannon-HPVLgt", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Cannon-Shotgun", playnum);
		makeComponentAvailable("Cyb-Wpn-Cannon-Sniper", playnum);
		makeComponentAvailable("HvyCyb-Wpn-EMP", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Flamer1", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Flamer2", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Flamer3", playnum);
		makeComponentAvailable("Cyb-Wpn-Laser-AP1", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Laser-AP1", playnum);
		makeComponentAvailable("Cyb-Wpn-Laser-AT1", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Laser-AT1", playnum);
		makeComponentAvailable("Cyb-Wpn-Laser-AP3", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Laser-AP3", playnum);
		makeComponentAvailable("Cyb-Wpn-Laser-AT3", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Laser-AT3", playnum);
		makeComponentAvailable("HvyCyb-Wpn-MG3", playnum);
		makeComponentAvailable("HvyCyb-Wpn-MG4", playnum);
		makeComponentAvailable("HvyCyb-Wpn-MG-AntiTank", playnum);
		makeComponentAvailable("HvyCyb-Wpn-MG-AntiTank2", playnum);
		makeComponentAvailable("Cyb-Wpn-MG3Inc", playnum);
		makeComponentAvailable("HvyCyb-Wpn-MG3Inc", playnum);
		makeComponentAvailable("Cyb-Wpn-MG4Inc", playnum);
		makeComponentAvailable("HvyCyb-Wpn-MG4Inc", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Railgun-Gattling", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Railgun-Shotgun", playnum);
		makeComponentAvailable("Cyb-Wpn-Railgun-Sniper", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Railgun-Aslt", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Rocket-Pod", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Rocket-Pod2", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Rocket-Pod3", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Rocket-LtA-T", playnum);
		makeComponentAvailable("Cyb-Wpn-Rocket-HvyA-T", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Rocket-MRL", playnum);
		makeComponentAvailable("Cyb-Wpn-Rocket-Sunburst", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Rocket-Sunburst", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Missile-MdArt", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Missile-LtSAM", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Missile-HvySAM", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Rocket-TopAttack", playnum);
		makeComponentAvailable("Cyb-Wpn-Rocket-Cherub", playnum);
		makeComponentAvailable("HvyCyb-Wpn-Rocket-Cherub", playnum);
		makeComponentAvailable("Cyb-Wpn-SpyTurret01", playnum);
		makeComponentAvailable("Cyb-Wpn-SpyTurret02", playnum);
		makeComponentAvailable("Cyb-Wpn-SpyTurret03", playnum);
		makeComponentAvailable("HvyCyb-Wpn-SpyTurretNEXUS", playnum);

		setStructureLimits("A0CommandCentre", 1, playnum);	// set structure limits
		setStructureLimits("A0LightFactory", 10, playnum);
		setStructureLimits("A0PowerGenerator", 64, playnum);
		setStructureLimits("A0ResearchFacility", 10, playnum);
		setStructureLimits("A0ComDroidControl", 128, playnum);
		setStructureLimits("A0CyborgFactory", 10, playnum);
		setStructureLimits("A0VTolFactory1", 10, playnum);
		setStructureLimits("A0LasSatCommand", 1, playnum);
	}
	applyLimitSet();	// set limit options

	const numCleanTech = 4;	// do x for clean	
	const numBaseTech = 18; // do x for base
	var techlist = new Array(
		"R-Vehicle-Prop-Wheels",
		"R-Sys-Spade1Mk1",
		"R-Vehicle-Body01",
		"R-Comp-SynapticLink",
		"R-Vehicle-Body04",
		"R-Wpn-MG1Mk1",
		"R-Defense-TankTrap01",
		"R-Defense-TankTrapGate",
		"R-Defense-TowerConst01",
		"R-Sys-Engineering01",
		"R-Vehicle-Prop-Halftracks",
		"R-Wpn-MG-Accuracy01",
		"R-Wpn-MG-Damage01",
		"R-Wpn-MG-ROF01",
		"R-Wpn-Cannon1Mk1",
		"R-Wpn-MG2Mk1",
		"R-Struc-RepairFacility",
		"R-Struc-PowerModuleMk1",
		"R-Wpn-MG3Mk1",
		"R-Wpn-Cannon-Accuracy01",
		"R-Wpn-Flamer01Mk1",
		"R-Wpn-Rocket05-MiniPod",
		"R-Wpn-Mortar01Lt",
		"R-Vehicle-Engine01",
		"R-Sys-Sensor-Turret01",
		"R-Sys-MobileRepairTurret01",
		"R-Comp-CommandTurret01",
		"R-Struc-CommandRelay",
		"R-Defense-EmplConst01",
		"R-Defense-HardcreteWall",
		"R-Defense-HardcreteGate",
		"R-Defense-TowerConst02",
		"R-Defense-BunkerConst01",
		"R-Defense-WallTowerConst01",
		"R-Struc-Research-Module",
		"R-Struc-Factory-Module",
		"R-Struc-Factory-Cyborg",
		"R-Struc-Research-Upgrade01");

	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		enableResearch("R-Vehicle-Body04", playnum);
		enableResearch("R-Vehicle-Prop-Halftracks", playnum);
		enableResearch("R-Defense-TankTrap01", playnum);
		enableResearch("R-Wpn-MG1Mk1", playnum);
		enableResearch("R-Sys-Engineering01", playnum);
		enableResearch("R-Defense-TowerConst01", playnum);

		if (tierLimit >= 3)
		{
			debug("All T3 technologies enabled.");
			completeResearch("R-T2Limiter",playnum);
		}
		else
		{
			debug("All T3 technologies are locked");
		}
		if (tierLimit >= 2)
		{
			debug("All T2 technologies enabled.");
			completeResearch("R-T1Limiter",playnum);
		}
		else
		{
			debug("All T2 technologies are locked");
		}
		
		//Give all players 1250 power, regardless of game type, though give INSANE AIs 2500 power instead, as well as the Engineering tech for free.
		
		if (playerData[playnum].difficulty == INSANE)
		{
			setPower(2500, playnum);
			completeResearch("R-Sys-Engineering01",playnum);
		}
		else
		{
			setPower(1250, playnum);
		}
			
		if (baseType == CAMP_CLEAN)
		{
			for (var count = 0; count < numCleanTech; count++)
			{
				completeResearch(techlist[count], playnum);
			}
			// Remove all structures from the player, even if an INSANE AI.
			var structs = enumStruct(playnum);
			for (var i = 0; i < structs.length; i++)
			{
				var s = structs[i];
				removeStruct(s);
			}
			if (playnum == selectedPlayer)
			{
				setMiniMap(false); // hide minimap since no HQ
				setDesign(false); // and disallow design
			}
		}
		else if (baseType == CAMP_BASE)
		{
			for (var count = 0; count < numBaseTech; count++)
			{
				completeResearch(techlist[count], playnum);
			}
			// Keep only some structures
			var structs = enumStruct(playnum);
			for (var i = 0; i < structs.length; i++)
			{
				var s = structs[i];
				if (s.stattype == WALL || s.stattype == DEFENSE || s.stattype == GATE || s.stattype == CYBORG_FACTORY || s.stattype == COMMAND_CONTROL)
				{
					removeStruct(s);
				}
			}
		}
		else // CAMP_WALLS
		{
			for (var count = 0; count < techlist.length; count++)
			{
				completeResearch(techlist[count], playnum);
			}
		}	
		//Set missing players' playerDefeated flags to 1 so that the "player defeated" message doesn't play on game start.
		factories = enumStruct(playnum,CYBORG_FACTORY).length + enumStruct(playnum,FACTORY).length + enumStruct(playnum,VTOL_FACTORY).length;
		droids = enumDroid(playnum).length;
		if (factories == 0 && droids == 0)
		{
			playerDefeated[playnum] = 1;
		}
	}
	
	setPower(250, scavengerPlayer); //Give Scavengers a little power at the start so that they would build Cranes more uniformly, though this would also make the Ultimate Scavenger AI a bit more dangerous early on.

	hackNetOn();
	setTimer("checkEndConditions", 1000);
	setTimer("sitRep", 1000);
	setTimer("givePower", 1000);
}

// /////////////////////////////////////////////////////////////////
// END CONDITIONS
function checkEndConditions()
{
	factories = enumStruct(me,CYBORG_FACTORY).length + enumStruct(me,FACTORY).length + enumStruct(me,VTOL_FACTORY).length;
	droids = enumDroid(me).length;

	// Losing Conditions
	if (droids == 0 && factories == 0)
	{
		var gameLost = true;
		if (playerDefeated[selectedPlayer] == 0) //Inform the player that he/she is out of the game.
		{
			playerDefeated[selectedPlayer] = 1;
			playSound("pcv470.ogg");
		}

		/* If teams enabled check if all team members have lost  */
		if (alliancesType == ALLIANCES_TEAMS)
		{
			for (var playnum = 0; playnum < maxPlayers; playnum++)
			{
				if (playnum != me && allianceExistsBetween(me, playnum))
				{
					factories = enumStruct(playnum,CYBORG_FACTORY).length + enumStruct(playnum,FACTORY).length + enumStruct(playnum,VTOL_FACTORY).length;
					droids = enumDroid(playnum).length;
					if (droids > 0 || factories > 0)
					{
						gameLost = false;	// someone from our team still alive
						break;
					}
				}
			}
		}

		if (gameLost)
		{
			gameOverMessage(false);
			removeTimer("checkEndConditions");
			return;
		}
	}
	
	// Winning Conditions
	var gamewon = true;

	// check if all enemies defeated
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (playnum != me && !allianceExistsBetween(me, playnum))	// checking enemy player
		{
			factories = enumStruct(playnum,CYBORG_FACTORY).length + enumStruct(playnum,FACTORY).length + enumStruct(playnum,VTOL_FACTORY).length; // nope
			droids = enumDroid(playnum).length;
			if (droids == 0 && factories == 0)
			{
				if (playerDefeated[playnum] == 0) //Inform the player that an enemy player has been defeated.
				{
					playerDefeated[playnum] = 1;
					playSound("pcv646.ogg");
				}
			}
			else if (droids > 0 || factories > 0)
			{
				gamewon = false;	//one of the enemies still alive
				break;
			}
		}
	}

	if (gamewon)
	{
		gameOverMessage(true);
		removeTimer("checkEndConditions");
	}
}

// /////////////////////////////////////////////////////////////////
// Give all players a little power every second. More power is given if the player built more wind farms. INSANE AIs receive more power from Wind Turbines than other players, as well as additional power from each Oil Derrick they own.

function givePower()
{
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		var windFarms = enumStruct(playnum, "WindFarm");
		var activeWindFarms = 0;
		var activeDerricks = 0;
		for (var i=0; i < windFarms.length; i++)
		{
			if (windFarms[i].status = BUILT)
				activeWindFarms+=1;
		}
		if (playerData[playnum].difficulty == INSANE)
		{
			var Derricks = enumStruct(playnum, "A0ResourceExtractor");
			for (var i=0; i < windFarms.length; i++)
			{
				if (Derricks[i].status = BUILT)
					activeDerricks+=1;
			}
			additionalPower[playnum] += ((activeWindFarms*2)+activeDerricks+20)*.1;
		}
		else
		{
			additionalPower[playnum] += (activeWindFarms+10)*.1;
		}
		while (additionalPower[playnum] >= 1)
		{
			setPower(playerPower(playnum)+1, playnum);
			additionalPower[playnum] -= 1;
		}
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

function eventStructureBuilt(struct)
{
	if (struct.player == selectedPlayer)
	{
		if (struct.type == STRUCTURE && struct.stattype == HQ)
		{
			setMiniMap(true); // show minimap
			setDesign(true); // permit designs
		}
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