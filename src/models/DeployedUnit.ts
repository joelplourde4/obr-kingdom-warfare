export class Casuality {
    current: number;
    total: number;

    constructor() {
        this.current = -1;
        this.total = -1;
    }
}

export class DeployedUnit {
    id: string;
    name: string;
    casuality: Casuality;
    exhausted: boolean;
    rallied: boolean;

    constructor(
        id: string,
        name: string,
        casuality: Casuality = new Casuality(),
        exhausted: boolean = false,
        rallied: boolean = false
    ) {
        this.id = id;
        this.name = name;
        this.casuality = casuality;
        this.exhausted = exhausted;
        this.rallied = rallied;
    }

    static fromJson(deployedUnit: DeployedUnit) {
        return new DeployedUnit(
            deployedUnit.id,
            deployedUnit.name,
            deployedUnit.casuality,
            deployedUnit.exhausted,
            deployedUnit.rallied
        );
    }
}