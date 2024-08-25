export class Attributes {
    name: string;
    description: string;
    level: number;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.level = 10;
    }
}

export class Skills {
    diplomacy: Attributes;
    espionage: Attributes;
    lore: Attributes;
    operations: Attributes;

    constructor() {
        this.diplomacy = new Attributes("Diplomacy", "blah 1")
        this.espionage = new Attributes("Espionage", "blah 2")
        this.lore = new Attributes("Lore", "blah")
        this.operations = new Attributes("Operations", "blah")
    }
}

export class Defenses {
    communications: Attributes;
    resolve: Attributes;
    resources: Attributes;

    constructor() {
        this.communications = new Attributes("Communications", "blah 1")
        this.resolve = new Attributes("Resolve", "blah 2")
        this.resources = new Attributes("Resource", "blah")
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