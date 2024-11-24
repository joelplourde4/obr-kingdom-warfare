import OBR, { buildImage, buildLabel, ImageContent, ImageGrid, KeyEvent, Metadata, Tool, ToolAction, ToolContext, ToolCursor, ToolEvent, ToolFilter, ToolIcon, ToolMode, ToolModeFilter } from "@owlbear-rodeo/sdk";

const TOOL_ID: string = "obr.kingdom-warfare/tool";
export const TOOL_METADATA_KEY: string = "com.obr.kingdom-warfare/tool/metadata";

export class PinTool implements Tool {

    id: string = `${TOOL_ID}/tool`;
    
    icons: ToolIcon[] = [
        {
          icon: "/pin.svg",
          label: "Pin",
        },
    ];

    disabled: ToolFilter = {
        roles: ["PLAYER"]
    }

    onClick?: ((context: ToolContext, elementId: string) => boolean | undefined | void | Promise<boolean | undefined | void>) | undefined;
    shortcut?: string | undefined;
    defaultMode?: string | undefined;
    defaultMetadata?: Metadata | undefined;
}

/**
 * A Pin is an interactive object which the players can see in the scene and on hover, displays a rich text.
 */
export class PinMode implements ToolMode {

    public readonly id: string = `${TOOL_ID}/pin`;

    get icons(): ToolIcon[] {
        return [{
            icon: '/pin.svg',
            label: 'Pin Mode',
            filter: {
                activeTools: [`${TOOL_ID}/tool`],
            },
        }];
    }

    shortcut = "P";

    onToolDoubleClick (_: ToolContext, event: ToolEvent) {
        OBR.scene.grid.snapPosition(event.pointerPosition, 1, false, true).then((position) => {
            const pinWidth = 120;
            const pinHeight = 150;

            const imageContent = {
                width: pinWidth,
                height: pinHeight,
                mime: 'image/svg+xml',
                url: 'https://obr-kingdom-warfare.onrender.com/pin.svg'
            } as ImageContent

            const imageGrid = {
                offset: { x: pinWidth / 2, y: pinWidth / 2},
                dpi: 225
            } as ImageGrid

            const pin = buildImage(imageContent, imageGrid)
                .position(position)
                .disableHit(false)
                .locked(true)
                .build();

            const textPosition = {
                x: position.x,
                y: position.y - (pinHeight / 2)
            }

            const text = buildLabel()
                .position(textPosition)
                .visible(false)
                .locked(true)
                .text({
                    plainText: "Hello World!",
                    type: "PLAIN",
                    richText: [],
                    style: {
                        fillColor: "white",
                        fillOpacity: 1,
                        strokeColor: "black",
                        strokeOpacity: 1,
                        strokeWidth: 3,
                        textAlign: "LEFT",
                        textAlignVertical: "BOTTOM",
                        fontFamily: "Arial",
                        fontSize: 16,
                        fontWeight: 10,
                        lineHeight: 1,
                        padding: 10
                    },
                    width: "AUTO",
                    height: "AUTO"
                })
                .style({
                    pointerDirection: "DOWN",
                    backgroundColor: "black",
                    backgroundOpacity: 0.5,
                    cornerRadius: 3,
                    pointerHeight: 15,
                    pointerWidth: 15
                })
                .metadata({
                    [TOOL_METADATA_KEY]: {}
                })
                .attachedTo(pin.id)
                .build();

            OBR.scene.items.addItems([pin, text]);
        });

        return;
    }

    disabled?: ToolFilter | undefined;
    cursors?: ToolCursor[] | undefined;
    preventDrag?: ToolModeFilter | undefined;
    onClick?: ((context: ToolContext, elementId: string) => boolean | undefined | void | Promise<boolean | undefined | void>) | undefined;
    onToolClick?: ((context: ToolContext, event: ToolEvent) => boolean | undefined | void | Promise<boolean | undefined | void>) | undefined;
    onToolDown?: ((context: ToolContext, event: ToolEvent) => void) | undefined;
    onToolMove?: ((context: ToolContext, event: ToolEvent) => void) | undefined;
    onToolUp?: ((context: ToolContext, event: ToolEvent) => void) | undefined;
    onToolDragStart? (context: ToolContext, event: ToolEvent): void;
    onToolDragMove? (context: ToolContext, event: ToolEvent): void;
    onToolDragEnd? (context: ToolContext, event: ToolEvent): void;
    onToolDragCancel?: ((context: ToolContext, event: ToolEvent) => void) | undefined;
    onKeyDown?: ((context: ToolContext, event: KeyEvent) => void) | undefined;
    onKeyUp?: ((context: ToolContext, event: KeyEvent) => void) | undefined;
    onActivate?: ((context: ToolContext) => void) | undefined;
    onDeactivate?: ((context: ToolContext) => void) | undefined;
}