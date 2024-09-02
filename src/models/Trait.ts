import { Ancestry, Trait } from "./Unit";

export class TraitDefinition {
    name: string
    description: string
    inherit: boolean
    newTrait: Trait | undefined

    constructor(name: string, description: string, inherit: boolean) {
        this.name = name;
        this.description = description;
        this.inherit = inherit;
        this.newTrait = undefined;
    }
}

export class AncestryDefinition {
    trait: Trait
    inherit: boolean

    constructor(trait: Trait, inherit: boolean) {
        this.trait = trait;
        this.inherit = inherit;
    }
}

export const TRAIT_MAP = new Map<Trait, string>([
    [Trait.AMPHIBIOUS, "This unit does not suffer terrain penalties for fighting in water or on land."],
    [Trait.AAAUUUGH, "When this unit breaks, all adjacent units suffer 1 casualty."],
    [Trait.ADAPTABLE, "This unit has advantage on Morale and Command tests."],
    [Trait.BRED_FOR_WAR, "This unit cannot be diminished, and cannot have disadvantage on Morale checks."],
    [Trait.BRUTAL, "Inflicts two casualties on a successful Power check."],
    [Trait.COURAGEOUS, "Once per battle, this unit can choose to succeed at a Morale check it just failed."],
    [Trait.ETERNAL, "This unit cannot be horrified, and it always succeeds on Morale checks to attack undead and fiends."],
    [Trait.FRENZY, "If this unit diminishes an enemy unit, it immediately gains a free attack against that unit"],
    [Trait.HORRIFY, "If this unit inflicts a casualty on an enemy unit, force a DC 15 Morale check. Failure exhausts the unit."],
    [Trait.MARTIAL, "Inflicts two casualties on a successful Power check if this unit' size is greater than their target's."],
    [Trait.MINDLESS, "This unit cannot fail Morale checks."],
    [Trait.RAVENOUS, "While there is a diminished enemy unit, this unit can spend a round feeding on the corpses. Increment their casualty die."],
    [Trait.ROCK_HURLER, "If this unit succeeds on an Attack check, it inflicts 2 casualties, and against fortifications deal 1D6."],
    [Trait.SAVAGE, "This unit has advantage on the first Attack check it makes each battle."],
    [Trait.STALWART, "Enemy battle magic has disadvantage on Power tests against this unit."],
    [Trait.UNDEAD,  "Green and Regular troops must pass a Morale check to attack this unit. Each enemy unit need only do this once."]
]);

export const ANCESTRY_TRAIT_MAP = new Map<Ancestry, Trait[]>([
    [Ancestry.DRAGONBORN, [Trait.COURAGEOUS]],
    [Ancestry.DWARF, [Trait.STALWART]],
    [Ancestry.ELF, [Trait.ETERNAL]],
    [Ancestry.GIANT, [Trait.ROCK_HURLER]],
    [Ancestry.GHOUL, [Trait.UNDEAD, Trait.HORRIFY, Trait.RAVENOUS]],
    [Ancestry.GNOLL, [Trait.FRENZY]],
    [Ancestry.GNOME, []],
    [Ancestry.GOBLINOID, []],
    [Ancestry.HOBGOBLIN, [Trait.BRED_FOR_WAR, Trait.MARTIAL]],
    [Ancestry.HUMAN, [Trait.COURAGEOUS]],
    [Ancestry.KOBOLD, []],
    [Ancestry.LIZARDFOLK, [Trait.AMPHIBIOUS]],
    [Ancestry.OGRE, [Trait.BRUTAL]],
    [Ancestry.ORC, [Trait.SAVAGE]],
    [Ancestry.UNDEAD, [Trait.UNDEAD, Trait.MINDLESS]],
    /*
    [Ancestry.FIEND, ],
    [Ancestry.MONSTROUS, ],
    [Ancestry.SPECIAL, ],
    [Ancestry.TREANT, ],
    [Ancestry.TROLL, ],
    */
]);