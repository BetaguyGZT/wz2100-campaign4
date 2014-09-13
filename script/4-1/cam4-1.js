// Warzone 2100 Campaign 4 -- cam4-1.js
// Goth Zagog-Thou | Nov 2013 | wz2100.net
// Mission script using the new JS API for Warzone 2100 (version 3.2 or better since backporting the functions into 3.1 didn't work)

// What I'm going to do here is break up each stage of 4-1 into a relevant include file to make debugging and tuning easier & faster
// Probably have Aubergine look everything over for code cleanliness and good practices before release ...

// Includes
include("script/4-1/m1.js_mission"); // M1
include("script/4-1/m2.js_mission"); // M2
include("script/4-1/m3.js_mission"); // M3
include("script/4-1/m4.js_mission"); // M4
include("script/4-1/m5.js_mission"); // M5 (Nexus Attack Event)

// Global variables

// Vehicle templates (so that we don't have to specify them in the data files -- great for compatibility and breaks far less often)

// Special structures (for compatibility also, since object ID's tend to change a lot and break scripts we'll refer to them by label)

// Areas of interest (by label)

// Script guts