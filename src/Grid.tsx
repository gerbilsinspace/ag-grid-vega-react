import React, { useState, useEffect } from "react";
import { AgGridReact, AgGridColumnProps } from "ag-grid-react";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import Tooltip from "./Tooltip";

import useGridDiff from "./useGridDiff";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "./Grid.scss";

import { itemsOld, itemsNew } from "./data.json";

const Grid = () => {
    const [
        initialData,
        sortedFilteredData,
        setSortedFilteredData
    ] = useGridDiff(itemsOld, itemsNew);

    const [columns, setColumns] = useState<AgGridColumnProps[]>([]);

    useEffect(() => {
        const initialColumns = [
            {
                headerName: "Location",
                field: "location",
                sortable: true,
                filter: "agTextColumnFilter",
                tooltipField: "location",
                tooltipComponent: "customTooltip"
            },
            {
                headerName: "Population",
                field: "population",
                sortable: true,
                filter: "agNumberColumnFilter",
                tooltipField: "population",
                tooltipComponent: "customTooltip"
            },
            {
                headerName: "Region",
                field: "region",
                sortable: true,
                filter: "agTextColumnFilter",
                tooltipField: "region",
                tooltipComponent: "customTooltip"
            }
        ];

        setColumns(initialColumns);
    }, []);

    const onChanged = (params: any, filterType: string = "filter") => {
        const { rootNode } = params.api.getModel();
        const data =
            filterType === "filter"
                ? rootNode.childrenAfterFilter
                : rootNode.childrenAfterSort;
        return setSortedFilteredData(
            data.map((item: { data: any }) => item.data)
        );
    };

    const getRowClass = ({ data }: any) => {
        const { edited, removed, added } = data;
        let classes = "";

        if (edited) {
            classes = classes.concat(" ", "edited");
        }

        if (removed) {
            classes = classes.concat(" ", "removed");
        }

        if (added) {
            classes = classes.concat(" ", "added");
        }

        return classes;
    };

    return (
        <>
            <div
                className='ag-theme-balham'
                style={{ height: "203px", width: "602px" }}
            >
                <AgGridReact
                    columnDefs={columns}
                    rowData={initialData}
                    rowSelection='multiple'
                    animateRows
                    onFilterChanged={params => onChanged(params, "filter")}
                    onSortChanged={params => onChanged(params, "sort")}
                    getRowClass={getRowClass}
                    frameworkComponents={{ customTooltip: Tooltip }}
                />
            </div>

            <BarChart data={sortedFilteredData} />
            <PieChart data={sortedFilteredData} />
        </>
    );
};

export default Grid;
