import { Activity, Category } from "../models/Crafting";

export const craftingUtils = {
        methods: {
            moveActivity(categories: Category[], activityId: string, targetCategory: Category) {
                let activityToMove: Activity | null = null;
    
                // Find the activity and its current category
                for (const category of categories) {
                    const index = category.activities.findIndex(activity => activity.id === activityId);
                    if (index !== -1) {
                        activityToMove = category.activities[index];
                        // Remove the activity from its current category
                        category.activities.splice(index, 1);
                        break;
                    }
                }
    
                // If the activity was not found, exit the method
                if (!activityToMove) {
                    console.warn(`Activity with name ${activityId} not found.`);
                    return;
                }
    
                // Move the activity to the new category
                targetCategory.activities.push(activityToMove);
            },
            addCategory(categories: Category[]) {
                const categoryId = categories.length + 1;
                categories.push(new Category(categoryId));
            },
            removeCategory(categories: Category[], categoriesToTransferOutOf: Category) {
                this.transferActivities(categories, categoriesToTransferOutOf);
    
                const index = categories.findIndex((x) => x.id == categoriesToTransferOutOf.id);
                categories.splice(index, 1);
    
                this.recalculateCategoriesIds(categories);
            },
            transferActivities(categories: Category[], categoriesToTransferOutOf: Category) {
                // Find or create the target category
                const targetCategory = categories.find(c => c.id !== categoriesToTransferOutOf.id);
                if (!targetCategory) {
                    console.warn("No suitable target category found.");
                    return;
                }
    
                // Move all activities from the category to transfer out of to the target category
                targetCategory.activities.push(...categoriesToTransferOutOf.activities);
    
                // Clear the activities from the original category
                categoriesToTransferOutOf.activities = [];
            },
            recalculateCategoriesIds(categories: Category[]) {
                categories.forEach((category, index) => {
                    // Assign the category Id.
                    category.id = index + 1;
                });
            }
        }
}