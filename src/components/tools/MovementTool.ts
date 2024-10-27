import OBR, { buildShape, KeyEvent, ToolContext, ToolCursor, ToolEvent, ToolFilter, ToolIcon, ToolMode, ToolModeFilter } from "@owlbear-rodeo/sdk";

export class MovementTool implements ToolMode {

    public readonly id: string = "hjdfklsdskl;hfakdfsjkkl";

    get icons(): ToolIcon[] {
        return [{
            icon: '/kingdom.svg',
            label: 'Regiment Movement',
            filter: {
                activeTools: ['rodeo.owlbear.tool/measure'],
            },
        }];
    }

    onToolDragStart (context: ToolContext, event: ToolEvent): void {

        // Add a point to the start position.

        // event.pointerPosition;

        OBR.scene.grid.snapPosition(event.pointerPosition, 1, false, true).then((position) => {
            const circle = buildShape()
            .position(position)
                .width(100)
                .height(100)
                .shapeType("CIRCLE")
                .build();
            OBR.scene.items.addItems([circle]);
        });

        console.log('Context: ', context);
        console.log('Event: ', event);
        return;
    };

    onToolDragMove (context: ToolContext, event: ToolEvent): void {
        console.log('Move!!');
        return;
    };

    onToolDragEnd (context: ToolContext, event: ToolEvent): void {
        console.log('End!!');
        return;
    };

    disabled?: ToolFilter | undefined;
    cursors?: ToolCursor[] | undefined;
    preventDrag?: ToolModeFilter | undefined;
    onClick?: ((context: ToolContext, elementId: string) => boolean | undefined | void | Promise<boolean | undefined | void>) | undefined;
    onToolClick?: ((context: ToolContext, event: ToolEvent) => boolean | undefined | void | Promise<boolean | undefined | void>) | undefined;
    onToolDoubleClick?: ((context: ToolContext, event: ToolEvent) => boolean | undefined | void | Promise<boolean | undefined | void>) | undefined;
    onToolDown?: ((context: ToolContext, event: ToolEvent) => void) | undefined;
    onToolMove?: ((context: ToolContext, event: ToolEvent) => void) | undefined;
    onToolUp?: ((context: ToolContext, event: ToolEvent) => void) | undefined;
    onToolDragCancel?: ((context: ToolContext, event: ToolEvent) => void) | undefined;
    onKeyDown?: ((context: ToolContext, event: KeyEvent) => void) | undefined;
    onKeyUp?: ((context: ToolContext, event: KeyEvent) => void) | undefined;
    onActivate?: ((context: ToolContext) => void) | undefined;
    onDeactivate?: ((context: ToolContext) => void) | undefined;
    shortcut?: string | undefined;
}