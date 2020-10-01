//Example script that checks from which of the 4 directions a unit was attacked.
//Useful if you want your attack to change tiles in its wake or have a snag fall opposite to you.
//Warning: You must check the coordinates' validity yourself. The results may go off-map.
//Remember to activate the use of variables in your events in Database > Config > Variables > Options.
//Remember that indexes start at 0 and not 1.
//Made by Eclogia

//Note: The Battle Loser is the unit that most recently was KO'd.
//In this example, the loser is an enemy defeated by a player unit (not an ally).
//The deadly attack was done from 3+ range.
//The script will change 2 tile next to the winner and 2 next to the loser. 

//Create 5 variables in the first group of variables (direction, x1, y1, x2, y2)
//Create 2 variables in the Id Variable group (winner & loser)
//Unit > Unit Event > Create Event > Dead.
//Create Event Command > Change Variables > Set Battle Winner Id to Id variable 0
//Create Event Command > Change Variables > Set Battle Loser Id to Id variable 1
//Create Event Command > Execute Script > Execute Code, then copypaste the example script:

var meta = root.getMetaSession();
var idWinner = meta.getVariableTable(5).getVariable(0);
var idLoser = meta.getVariableTable(5).getVariable(1);
var curSession = root.getCurrentSession();
var winner = curSession.getPlayerList().getDataFromId(idWinner);
var loser = curSession.getEnemyList().getDataFromId(idLoser);
var direction = EasyMapUnit._getAdhocDirection(winner, loser);
var vartable = meta.getVariableTable(0);
vartable.setVariable(0, direction);
vartable.setVariable(1, winner.getMapX() + XPoint[direction]);
vartable.setVariable(2, winner.getMapY() + YPoint[direction]);
vartable.setVariable(3, loser.getMapX() - XPoint[direction]);
vartable.setVariable(4, loser.getMapY() - YPoint[direction]);

//Create Event Command > Battle Tab > Control Map Pos
//Specify Target > Click on the field, then on the number fields to set to your coordinate variables
//Operation Change Chip > (select your mapchip change and check Ornament if your tile has transparency)
//Repeat for the other second coordinates 

//In case you want to transform more tiles and you are sure you aren't going out of the map,
//add this script and copy/paste the Control Map Pos events after the previous Event Commands

var vartable = root.getMetaSession().getVariableTable(0);
var direction = vartable.getVariable(0);
vartable.setVariable(1, vartable.getVariable(1) + XPoint[direction]);
vartable.setVariable(2, vartable.getVariable(2) + YPoint[direction]);
vartable.setVariable(3, vartable.getVariable(3) - XPoint[direction]);
vartable.setVariable(4, vartable.getVariable(4) - YPoint[direction]);