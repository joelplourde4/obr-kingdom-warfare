import { Regiment, Unit } from "../models/Unit";

export const militaryUtils = {
    methods: {
        moveUnit(regiments: Regiment[], unitId: string, targetRegiment: Regiment) {
            let unitToMove: Unit | null = null;

            // Find the unit and its current regiment
            for (const regiment of regiments) {
                const index = regiment.units.findIndex(unit => unit.id === unitId);
                if (index !== -1) {
                    unitToMove = regiment.units[index];
                    // Remove the unit from its current regiment
                    regiment.units.splice(index, 1);
                    break;
                }
            }

            // If the unit was not found, exit the method
            if (!unitToMove) {
                console.warn(`Unit with name ${unitId} not found.`);
                return;
            }

            // Move the unit to the new regiment
            targetRegiment.units.push(unitToMove);
        },
        addRegiment(regiments: Regiment[]) {
            const regimentId = regiments.length + 1;
            regiments.push(new Regiment(regimentId));
        },
        removeRegiment(regiments: Regiment[], regimentToTransferOutOf: Regiment) {
            this.transferUnits(regiments, regimentToTransferOutOf);

            const index = regiments.findIndex((x) => x.id == regimentToTransferOutOf.id);
            regiments.splice(index, 1);

            this.recalculateRegimentIds(regiments);
        },
        transferUnits(regiments: Regiment[], regimentToTransferOutOf: Regiment) {
            // Find or create the target regiment
            const targetRegiment = regiments.find(r => r.id !== regimentToTransferOutOf.id);
            if (!targetRegiment) {
                console.warn("No suitable target regiment found.");
                return;
            }

            // Move all units from the regiment to transfer out of to the target regiment
            targetRegiment.units.push(...regimentToTransferOutOf.units);

            // Clear the units from the original regiment
            regimentToTransferOutOf.units = [];
        },
        recalculateRegimentIds(regiments: Regiment[]) {
            regiments.forEach((regiment, index) => {
                // Assign the regiment Id.
                regiment.id = index + 1;
            });
        }
    }
}