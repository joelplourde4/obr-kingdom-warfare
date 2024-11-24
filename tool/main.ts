import OBR, { buildImage, buildLabel, ImageContent, ImageGrid, Tool, ToolContext, ToolEvent, ToolFilter, ToolIcon, ToolMode } from "@owlbear-rodeo/sdk";

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

    shortcut = "P";
}

/**
 * A Pin is an interactive object which the players can see in the scene and double-click to display a rich text.
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
}