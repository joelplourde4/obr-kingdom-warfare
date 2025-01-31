export class Casuality {
    current: number;
    total: number;

    constructor() {
        this.current = 0;
        this.total = 0;
    }
}

export class DeployedUnit {
    id: string;
    name: string;
    casuality: Casuality;
    exhausted: boolean;
    rallied: boolean;

    opened: boolean;
    color: string;

    constructor(
        id: string,
        name: string,
        casuality: Casuality = new Casuality(),
        exhausted: boolean = false,
        rallied: boolean = false,
        opened: boolean = false,
        color: string = "#000000"
    ) {
        this.id = id;
        this.name = name;
        this.casuality = casuality;
        this.exhausted = exhausted;
        this.rallied = rallied;
        this.opened = opened;
        this.color = color;
    }

    static fromJson(deployedUnit: DeployedUnit) {
        return new DeployedUnit(
            deployedUnit.id,
            deployedUnit.name,
            deployedUnit.casuality,
            deployedUnit.exhausted,
            deployedUnit.rallied,
            deployedUnit.opened,
            deployedUnit.color,
        );
    }
}