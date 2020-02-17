import React, { useEffect, useState } from "react";
import { Vega } from "react-vega";
import { Spec } from "vega";
import { DataType } from "./GridTypes";

const initialSpec: Spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 200,
    height: 100,
    autosize: "pad",

    signals: [
        {
            name: "startAngle",
            value: 0
        },
        {
            name: "endAngle",
            value: 6.29
        },
        {
            name: "padAngle",
            value: 0.05
        },
        {
            name: "innerRadius",
            value: 20
        },
        {
            name: "cornerRadius",
            value: 5
        },
        {
            name: "sort",
            value: false
        }
    ],

    data: [
        {
            name: "table",
            values: [],
            transform: [
                {
                    type: "pie",
                    field: "field",
                    startAngle: { signal: "startAngle" },
                    endAngle: { signal: "endAngle" },
                    sort: { signal: "sort" }
                }
            ]
        }
    ],

    scales: [
        {
            name: "color",
            type: "ordinal",
            domain: { data: "table", field: "id" },
            range: { scheme: "category20" }
        }
    ],

    marks: [
        {
            type: "arc",
            from: { data: "table" },
            encode: {
                enter: {
                    fill: { scale: "color", field: "id" },
                    x: { signal: "width / 2" },
                    y: { signal: "height / 2" }
                },
                update: {
                    startAngle: { field: "startAngle" },
                    endAngle: { field: "endAngle" },
                    padAngle: { signal: "padAngle" },
                    innerRadius: { signal: "innerRadius" },
                    outerRadius: { signal: "width / 2" },
                    cornerRadius: { signal: "cornerRadius" }
                }
            }
        }
    ],

    legends: [
        {
            direction: "vertical",
            orient: "right",
            title: "City Population",
            offset: 20,
            stroke: "color",
            encode: {
                symbols: {
                    update: {
                        fill: { value: "transparent" },
                        strokeWidth: { value: 3 },
                        size: { value: 64 },
                        sort: { signal: "sort" }
                    }
                }
            }
        }
    ]
};

const signalListeners = {};

const PieChart = ({ data }: { data: DataType[] }) => {
    const [spec, setSpec] = useState(initialSpec);

    useEffect(() => {
        setSpec({
            ...initialSpec,
            data: [
                {
                    name: "table",
                    values: data
                        .filter(item => !item.removed)
                        .map(item => ({
                            id: `${item.location}: ${item.population}`,
                            field: item.population
                        })),
                    transform: [
                        {
                            type: "pie",
                            field: "field",
                            startAngle: { signal: "startAngle" },
                            endAngle: { signal: "endAngle" },
                            sort: { signal: "sort" }
                        }
                    ]
                }
            ]
        });
    }, [data]);

    return (
        <Vega
            spec={spec}
            renderer='svg'
            signalListeners={signalListeners}
            actions={false}
        />
    );
};

export default PieChart;
