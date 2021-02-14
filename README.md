# srpg-studio-eclogia

Discord user AlanaEclogia#9407's SRPG Studio plugins and assets.

Free to use as you want. Instructions are inside the files.

# Contact

Found a bug? Can't understand how to use a plugin? [Find me on the SRPG Studio University Discord server](https://discord.gg/GcTS5EH)

# Plugin & Asset List

**Battle-related plugins**

- BreakableWall changes a unit's affiliation between Ally and Enemy so it can be targeted at all times.
- InvalidateSkillHpThreshold allows invalidate-type skills to only trigger under or above an HP% threshold.
- KnockbackWeapon has a weapon or a skill make the user or the target move away from the other.
- LinkedUnitHP changes a main unit's HP when a sub unit dies.
- SynchronizedHP updates units' HP when one of the units in the group has a HP change.

**Tutorials**
- CoordinatesInDirection teaches you how to check from which cardinal direction a unit was attacked and use the data to change terrain between the two fighters.

**Utils**
- UnitCommand is a template for a custom unit command (one of the options when you select a unit) which checks if the unit has the appropriate custom skill that would make the command available.
- AgainAdjacentItem allows the creation of "Instruments", items that refresh all adjacent allies and allows them to act again.
- PrepScreenStackableItems creates a new prep screen command that merges together items of the same type whose durability is inferior to their maximum durability. The result is max-durability items, with leftover uses in an extra item.

**Graphics**
- Alphabet-extended is the RTP Alphabet with extra symbols and numbers.
- blank-charchip is a charchip for any unit you want to be invisible (like walls if you use units for them). Remember to make copies of it with -a to -c to give the engine alternate colors. Really, it's only there if you do not have a transparency-handling software.
- [McMagister mapchip](https://github.com/McMagister/srpg-studio-stuff/tree/master/32px%20FE-style%20Tileset) edits: Besides rearranging the layout, I added some new tiles. They are licenced under the [Creative Commons Attribution-Share Alike 3.0 License](https://creativecommons.org/licenses/by-sa/3.0/) so you can use them outside SRPG Studio.

# MIT License

Copyright (c) 2020 AlanaEclogia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.