export class Attributes {
    name: string;
    description: string;
    level: number;
    skills: string;

    constructor(name: string, description: string, skills: string = "") {
        this.name = name;
        this.description = description;
        this.level = 10;
        this.skills = skills;
    }
}

export class Skills {
    diplomacy: Attributes;
    espionage: Attributes;
    lore: Attributes;
    operations: Attributes;

    constructor() {
        this.diplomacy = new Attributes(
            "Diplomacy",
            "Forge alliances, Raises Standings; diplomacy is the art of dealing with people sensitively and effectively.",
            "Insight/Persuasion"
        )
        this.espionage = new Attributes(
            "Espionage",
            "The practice of spying to gather political and military information.",
            "Investigation/Stealth"
        )
        this.lore = new Attributes(
            "Lore",
            "Ability to research both magical and historical knowledge.",
            "History/Arcana/Religion"
        )
        this.operations = new Attributes(
            "Operations",
            "Ability to muster new units, build fortifications, and perform many of the basic functions of maintaining a domain.",
            "Insight/Persuasion"
        )
    }
}

export class Defenses {
    communications: Attributes;
    resolve: Attributes;
    resources: Attributes;

    constructor() {
        this.communications = new Attributes("Communications", "A measure of how rapidly and accurately information is transmitted between a domain's officer and followers.")
        this.resolve = new Attributes("Resolve", "Measures the commitment that the followers of a domain have to its cause.")
        this.resources = new Attributes("Resource", "Includes whatever a domain values and collects, whether gold, knowledge, secrets, or things more esoteric.")
    }
}

export class Stats {
    skills: Skills;
    defenses: Defenses;

    constructor() {
        this.skills = new Skills()
        this.defenses = new Defenses()
    }
}