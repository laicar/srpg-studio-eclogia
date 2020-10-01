//Give an Invalid-type skill the custom parameter {triggerUnderHp: true, triggerHpPercentage: 50} to have it trigger only under half HP.
//false would have it trigger over half HP rather than "all the time" since you don't need to put a parameter for "all the time".
//Note that being exactly at the percentage HP works for both ways in this implementation.
//This plugin is a wild logic ride so please report bugs if you find any!
//Plugin by Eclogia with LadyRena's advice

var HpPercentageCheck = {
	under: function(unit, percentage) {
		var result = unit.getHp() <= Math.round(RealBonus.getMhp(unit) * percentage / 100);
		return result;
	},

	over: function(unit, percentage) {
		var result = unit.getHp() >= Math.round(RealBonus.getMhp(unit) * percentage / 100);
		return result;
	}
};

(function() {
	var alias0 = CriticalCalculator.isCritical;
	CriticalCalculator.isCritical = function(active, passive, weapon, percent) {
		var result = alias0.call(this, active, passive, weapon, percent);
		var skill = SkillControl.getBattleSkillFromFlag(passive, active, SkillType.INVALID, InvalidFlag.CRITICAL);
		if (skill !== null) {
			var hpCheck = false;
			var affectedByPlugin = typeof skill.custom.triggerUnderHp !== 'undefined';
			if (skill.custom.triggerUnderHp) {
				hpCheck = HpPercentageCheck.under(passive, skill.custom.triggerHpPercentage);
			} else if (affectedByPlugin) {
				hpCheck = HpPercentageCheck.over(passive, skill.custom.triggerHpPercentage);
			} else {
				return result;
			}
			result = !(!affectedByPlugin || hpCheck);
		}
		return result;
	};

	var alias1 = DamageCalculator.isHalveAttackBreak;
	DamageCalculator.isHalveAttackBreak = function(active, passive, weapon, isCritical, trueHitValue) {
		var result = alias1.call(this, active, passive, weapon, isCritical, trueHitValue);
		var skill = SkillControl.getBattleSkillFromFlag(active, passive, SkillType.INVALID, InvalidFlag.HALVEATTACKBREAK);
		if (skill !== null) {
			var hpCheck = false;
			var affectedByPlugin = typeof skill.custom.triggerUnderHp !== 'undefined';
			if (skill.custom.triggerUnderHp) {
				hpCheck = HpPercentageCheck.under(active, skill.custom.triggerHpPercentage);
			} else if (affectedByPlugin) {
				hpCheck = HpPercentageCheck.over(active, skill.custom.triggerHpPercentage);
			} else {
				return result;
			}
			result = !affectedByPlugin || hpCheck;
		}
		return result;
	};

	var alias2 = DamageCalculator.isEffective;
	DamageCalculator.isEffective = function(active, passive, weapon, isCritical, trueHitValue) {
		var result = alias2.call(this, active, passive, weapon, isCritical, trueHitValue);
		var skill = SkillControl.getBattleSkillFromFlag(passive, active, SkillType.INVALID, InvalidFlag.EFFECTIVE);
		if (skill !== null) {
			var hpCheck = false;
			var affectedByPlugin = typeof skill.custom.triggerUnderHp !== 'undefined';
			if (skill.custom.triggerUnderHp) {
				hpCheck = HpPercentageCheck.under(passive, skill.custom.triggerHpPercentage);
			} else if (affectedByPlugin) {
				hpCheck = HpPercentageCheck.over(passive, skill.custom.triggerHpPercentage);
			} else {
				return result;
			}
			var hasEffGuard = !affectedByPlugin || hpCheck;
			result = !hasEffGuard && ItemControl.isEffectiveData(passive, weapon);
		}
		return result;
	};

	var alias3 = SkillRandomizer._isSkillInvokedInternal;
	SkillRandomizer._isSkillInvokedInternal = function(active, passive, skill) {
		var result = alias3.call(this, active, passive, skill);
		var skill = SkillControl.getBattleSkillFromFlag(passive, active, SkillType.INVALID, InvalidFlag.SKILL);
		if (skill !== null) {
			var hpCheck = false;
			var affectedByPlugin = typeof skill.custom.triggerUnderHp !== 'undefined';
			if (skill.custom.triggerUnderHp) {
				hpCheck = HpPercentageCheck.under(passive, skill.custom.triggerHpPercentage);
			} else if (affectedByPlugin) {
				hpCheck = HpPercentageCheck.over(passive, skill.custom.triggerHpPercentage);
			} else {
				return result;
			}
			result = !(!affectedByPlugin || hpCheck);
		}
		return result;
	};

	var alias4 = StateControl.isStateBlocked;
	StateControl.isStateBlocked = function(unit, targetUnit, state) {
		var result = alias4.call(this, unit, targetUnit, state);
		if (state !== null && state.isBadState()) {
			var skill = SkillControl.getBattleSkillFromFlag(unit, targetUnit, SkillType.INVALID, InvalidFlag.BADSTATE);
			if (skill !== null) {
				var hpCheck = false;
				var affectedByPlugin = typeof skill.custom.triggerUnderHp !== 'undefined';
				if (skill.custom.triggerUnderHp) {
					hpCheck = HpPercentageCheck.under(targetUnit, skill.custom.triggerHpPercentage);
				} else if (affectedByPlugin) {
					hpCheck = HpPercentageCheck.over(targetUnit, skill.custom.triggerHpPercentage);
				} else {
					return result;
				}
				result = !affectedByPlugin || hpCheck;
			}
		}
		return result;
	};

	var alias5 = NormalAttackOrderBuilder._isSealAttackBreak;
	NormalAttackOrderBuilder._isSealAttackBreak = function(virtualActive, virtualPassive) {
		var result = alias5.call(this, virtualActive, virtualPassive);
		var skill = SkillControl.getBattleSkillFromFlag(virtualActive.unitSelf, virtualPassive.unitSelf, SkillType.INVALID, InvalidFlag.SEALATTACKBREAK);
		if (!result && skill !== null) {
			var hpCheck = false;
			var affectedByPlugin = typeof skill.custom.triggerUnderHp !== 'undefined';
			if (skill.custom.triggerUnderHp) {
				hpCheck = HpPercentageCheck.under(virtualPassive.unitSelf, skill.custom.triggerHpPercentage);
			} else if (affectedByPlugin) {
				hpCheck = HpPercentageCheck.over(virtualPassive.unitSelf, skill.custom.triggerHpPercentage);
			} else {
				return result;
			}
			result = !affectedByPlugin || hpCheck;
		}
		return result;
	};
})();