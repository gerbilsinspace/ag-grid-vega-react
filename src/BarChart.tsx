import React, { useEffect, useState } from "react";
import { Vega } from "react-vega";
import { Spec } from "vega";
import { DataType } from "./GridTypes";
import "./BarChart.scss";

const initialSpec: Spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description: "Population",
    title: "Latest City Population from Wikipedia",
    width: 800,
    height: 400,
    padding: { left: 5, right: 5, top: 5, bottom: 5 },

    data: [
        {
            name: "table"
        }
    ],

    signals: [
        {
            name: "tooltip",
            value: {},
            on: [
                { events: "rect:mouseover", update: "datum" },
                { events: "rect:mouseout", update: "{}" }
            ]
        }
    ],

    scales: [
        {
            name: "yscale",
            domain: { data: "table", field: "population" },
            nice: true,
            range: "height"
        },
        {
            name: "xscale",
            type: "band",
            domain: { data: "table", field: "location" },
            range: "width"
        }
    ],

    axes: [
        { orient: "bottom", scale: "xscale", title: "City" },
        { orient: "left", scale: "yscale", labels: true, title: "Population" }
    ],

    marks: [
        {
            type: "rect",
            from: { data: "table" },
            encode: {
                enter: {
                    x: { scale: "xscale", field: "location", offset: 0 },
                    width: { scale: "xscale", band: 1, offset: 0 },
                    y: { scale: "yscale", field: "population" },
                    y2: { scale: "yscale", value: 0 }
                },
                update: {
                    fill: { value: "rebeccapurple" }
                },
                hover: {
                    fill: { value: "#8844bb" }
                }
            }
        },
        {
            type: "text",
            encode: {
                enter: {
                    align: { value: "center" },
                    baseline: { value: "bottom" },
                    fill: { value: "rgba(0, 0, 0, 0.8)" }
                },
                update: {
                    x: {
                        scale: "xscale",
                        signal: "tooltip.location",
                        band: 0.5
                    },
                    y: {
                        scale: "yscale",
                        signal: "tooltip.population",
                        offset: -0.5
                    },
                    text: { signal: "tooltip.population" },
                    fillOpacity: [
                        { test: "datum === tooltip", value: 0 },
                        { value: 1 }
                    ]
                }
            }
        }
    ]
};

const signalListeners = {};

const Visualisations = ({ data }: { data: DataType[] }) => {
    const [spec, setSpec] = useState(initialSpec);

    useEffect(() => {
        setSpec({
            ...initialSpec,
            data: [
                {
                    name: "table",
                    values: data.filter(item => !item.removed)
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

export default Visualisations;
