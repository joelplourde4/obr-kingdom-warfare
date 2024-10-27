import { expect, test } from 'vitest'
import { Regiment } from "../../../../src/models/Unit";

import { militaryUtils } from '../../../../src/mixins/militaryUtils';

test ('moveUnit should work as expected', () => {
    const regiments = [
        {
            id: 1,
            units: [
                {
                    id: "Unit A"
                },
                {
                    id: "Unit B"
                }
            ]
        },
        {
            id: 2,
            units: [
                {
                    id: "Unit C"
                }
            ]
        }
    ] as Regiment[];

    militaryUtils.methods.moveUnit(regiments, 'Unit B', regiments[1]);

    const expectedResult = [
        {
            id: 1,
            units: [
                {
                    id: "Unit A"
                }
            ]
        } as Regiment,
        {
            id: 2,
            units: [
                {
                    id: "Unit C"
                },
                {
                    id: "Unit B"
                }
            ]
        } as Regiment
    ]

    const x = JSON.stringify(expectedResult);
    const y = JSON.stringify(regiments);
    expect(x).toStrictEqual(y);
});

test ('removeRegiment should work as expected (1)', () => {
    const regiments = [
        {
            id: 1,
            units: [
                {
                    id: "Unit A"
                },
                {
                    id: "Unit B"
                }
            ]
        },
        {
            id: 2,
            units: [
                {
                    id: "Unit C"
                }
            ]
        }
    ] as Regiment[];

    militaryUtils.methods.removeRegiment(regiments, regiments[1]);

    const expectedResult = [
        {
            id: 1,
            units: [
                {
                    id: "Unit A"
                },
                {
                    id: "Unit B"
                },
                {
                    id: "Unit C"
                }
            ]
        } as Regiment
    ]

    const x = JSON.stringify(expectedResult);
    const y = JSON.stringify(regiments);
    expect(x).toStrictEqual(y);
});

test ('removeRegiment should work as expected (2)', () => {
    const regiments = [
        {
            id: 1,
            units: [
                {
                    id: "Unit A"
                },
                {
                    id: "Unit B"
                }
            ]
        },
        {
            id: 2,
            units: [
                {
                    id: "Unit C"
                }
            ]
        }
    ] as Regiment[];

    militaryUtils.methods.removeRegiment(regiments, regiments[0]);

    const expectedResult = [
        {
            id: 1,
            units: [
                {
                    id: "Unit C"
                },
                {
                    id: "Unit A"
                },
                {
                    id: "Unit B"
                }
            ]
        } as Regiment
    ]

    const x = JSON.stringify(expectedResult);
    const y = JSON.stringify(regiments);
    expect(x).toStrictEqual(y);
});

test ('addRegiment should work as expected', () => {
    const regiments = [
        {
            id: 1,
            units: [],
            show: false
        }
    ];

    militaryUtils.methods.addRegiment(regiments);

    const expectedResult = [
        {
            id: 1,
            units: [],
            show: false,
        },
        {
            id: 2,
            units: [],
            show: false,
        },
    ]

    const x = JSON.stringify(expectedResult);
    const y = JSON.stringify(regiments);
    expect(x).toStrictEqual(y);
});