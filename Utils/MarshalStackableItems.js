/*
Item-stacking command for the preparation screen's Manage sub-menu by Eclogia, inspired by LadyRena (aka Claris)
Will merge items having the custom parameter {Stackable: true},
both in the convoy and inside a unit's inventory (no cross-inventory merges).
Uses past the item's max durability are preserved in other items.
There is a prompt to confirm the action and a window for feedback at the end of the command.
*/

(function () {
var alias_configureMarshalItem = MarshalCommandWindow._configureMarshalItem;
MarshalCommandWindow._configureMarshalItem = function(groupArray) {
	alias_configureMarshalItem.call(this, groupArray);
	groupArray.appendObject(MarshalCommand.Merge);
};

var MergeMode = {
	QUESTION: 0,
	INFO: 1
}

MarshalCommand.Merge = defineObject(MarshalBaseCommand,
{
	_infoWindow: null,
	_questionWindow: null,
	_idx1: null,
	_idx2: null,
	aMergeHappened: false,
	
	openCommand: function() {
		this._questionWindow = createWindowObject(QuestionWindow, this);
		this._questionWindow.setQuestionMessage("Merge used items?");
		this._questionWindow.setQuestionActive(true);
		this._infoWindow = createWindowObject(InfoWindow, this);
		
		this.changeCycleMode(MergeMode.QUESTION);
	},
	
	moveCommand: function() {
		var mode = this.getCycleMode();
		var result = MoveResult.CONTINUE;
		
		if (mode == MergeMode.QUESTION) {
			result = this._questionWindow.moveWindow();
			if (result !== MoveResult.CONTINUE) {
				if (this._questionWindow.getQuestionAnswer() === QuestionAnswer.YES) {
					this._stackInPlayerListInventories();
					this._stackConvoy();
					this.changeCycleMode(MergeMode.INFO);
					result = MoveResult.CONTINUE;
				}
			}
		} else if (mode == MergeMode.INFO) {
			result = this._infoWindow.moveWindow();
		}
		
		return result;
	},
	
	drawCommand: function() {
		var mode = this.getCycleMode();
		var x = LayoutControl.getCenterX(-1, this._infoWindow.getWindowWidth());
		var y = LayoutControl.getCenterY(-1, this._infoWindow.getWindowHeight());
		
		if (mode == MergeMode.QUESTION) {
			this._questionWindow.drawWindow(x, y);
		} else if (mode == MergeMode.INFO) {
			if (this.aMergeHappened)
				this._infoWindow.setInfoMessageAndType("Item uses have been merged.", InfoWindowType.INFORMATION);
			else
				this._infoWindow.setInfoMessageAndType("There was no item to merge.", InfoWindowType.INFORMATION);
			this._infoWindow.drawWindow(x, y);
		}
	},
	
	checkCommand: function() {
		return true;
	},
	
	isMarshalScreenCloesed: function() {
		return true;
	},
	
	getInfoWindowType: function() {
		return MarshalInfoWindowType.ITEM;
	},
	
	getCommandName: function() {
		return "Merge Items";
	},
	
	getMarshalDescription: function() {
		return "Merges used items from the same inventory or the convoy together";
	},

	isMergeCommand: function() {
		return true;
	},

	_fetchFirstStackableItemPairInInventory: function(unit) {
		var count = UnitItemControl.getPossessionItemCount(unit);
		UnitItemControl.arrangeItem(unit);
		for (var i = 0; i < count; i++) {
			var item1 = unit.getItem(i);
			if (item1.getLimitMax() === 0 || !item1.custom.Stackable || item1.getLimitMax() === item1.getLimit())
				continue;
			for (var j = i+1; j < count; j++) {
				var item2 = unit.getItem(j);
				if (item1.getName() === item2.getName()){
					this._idx1 = i;
					this._idx2 = j;
					return;
				}
			}
		}
	},

	_stackInInventory: function(unit) {
		var firstItem = unit.getItem(this._idx1);
		var secondItem = unit.getItem(this._idx2);
		var maxDurability = secondItem.getLimitMax();
		var newDurability = secondItem.getLimit() + firstItem.getLimit();
		var overflow = newDurability - maxDurability;
		if (overflow > 0) {
			firstItem.setLimit(maxDurability);
			secondItem.setLimit(overflow);
		} else if (overflow === 0) {
			firstItem.setLimit(maxDurability);
			UnitItemControl.cutItem(unit,this._idx2);
		} else {
			UnitItemControl.cutItem(unit,this._idx2);
		}
		this.aMergeHappened = true;
		this._idx1 = null;
		this._idx2 = null;
	},

	_stackInPlayerListInventories: function() {
		var players = root.getCurrentSession().getPlayerList();
		var count = players.getCount();
		for (var i = 0; i < count; i++) {
			var unit = players.getData(i);
			this._fetchFirstStackableItemPairInInventory(unit);
			while (this._idx1 !== null) {
				this._stackInInventory(unit);
				this._fetchFirstStackableItemPairInInventory(unit);
			}
		}
	},

	_stackConvoy: function() {
		var itemArray = StockItemControl.getStockItemArray();
		StockItemControl.sortItem();
		for (var j = 0; j < itemArray.length -1; j++) {
			var item = itemArray[j];
			if (item.getLimitMax() === 0 || !item.custom.Stackable || item.getLimitMax() === item.getLimit())
				continue;
			var item2 = null;
			for (var i = j +1; i < itemArray.length; i++){
				if (itemArray[i].getName() === item.getName()){
					item2 = itemArray[i];
					break;
				}
			}
			if (item2 !== null){
				var maxDurability = item2.getLimitMax();
				var stockDurability = item2.getLimit();
				if (stockDurability < maxDurability){
					var newDurability = item.getLimit() + stockDurability;
					var overflow = newDurability - maxDurability;
					if(overflow > 0) {
						item2.setLimit(maxDurability);
						item.setLimit(overflow);
					} else if (overflow === 0) {
						item2.setLimit(maxDurability);
						var toRemove = StockItemControl.getIndexFromItem(item);
						StockItemControl.cutStockItem(toRemove);
					} else {
						item2.setLimit(newDurability);
						var toRemove = StockItemControl.getIndexFromItem(item);
						StockItemControl.cutStockItem(toRemove);
					}
					this.aMergeHappened = true;
				} else {
					itemArray.push(item);
				}
			}
			else{
				itemArray.push(item);
			}
			StockItemControl.sortItem();
		}
	}
}
);

	var aliasDrawScreenCycle = MarshalScreen.drawScreenCycle;
	MarshalScreen.drawScreenCycle = function() {
		var object= this._marshalCommandWindow.getObject();
		var mode = this.getCycleMode();
		if (object.isMergeCommand && object.isMergeCommand()) {
			this._drawLeftWindow();
			this._drawRightWindow();
			if (mode === MarshalScreenMode.OPEN) {
				object.drawCommand();
			}
		} else {
			aliasDrawScreenCycle.call(this);
		}
	}
}) ();