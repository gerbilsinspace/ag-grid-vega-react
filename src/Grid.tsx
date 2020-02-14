import React, { useState, useEffect } from "react";
import { AgGridReact, AgGridColumnProps } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "./Grid.scss";

import { items } from "./data.json";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import { DataType } from "./GridTypes";

const Grid = () => {
    const [columns, setColumns] = useState<AgGridColumnProps[]>([]);
    const [data, setData] = useState<DataType[]>([]);
    const [filteredData, setFilteredData] = useState<DataType[]>([]);

    useEffect(() => {
        const initialColumns = [
            {
                headerName: "Location",
                field: "location",
                sortable: true,
                filter: "agTextColumnFilter"
            },
            {
                headerName: "Population",
                field: "population",
                sortable: true,
                filter: "agNumberColumnFilter"
            },
            {
                headerName: "Region",
                field: "region",
                sortable: true,
                filter: "agTextColumnFilter"
            }
        ];
        setColumns(initialColumns);
        setData(items);
        setFilteredData(items);
    }, []);

    const onFilterChanged = (params: any) => {
        const filteredItems = params.api
            .getModel()
            .rootNode.childrenAfterFilter.map(
                (item: { data: any }) => item.data
            );
        setFilteredData(filteredItems);
    };

    const onSortChanged = (params: any) => {
        const sortedItems = params.api
            .getModel()
            .rootNode.childrenAfterSort.map((item: { data: any }) => item.data);
        setFilteredData(sortedItems);
    };

    return (
        <>
            <div
                className='ag-theme-balham'
                style={{ height: "200px", width: "620px" }}
            >
                <AgGridReact
                    columnDefs={columns}
                    rowData={data}
                    rowSelection='multiple'
                    animateRows
                    onFilterChanged={onFilterChanged}
                    onSortChanged={onSortChanged}
                />
            </div>

            <BarChart data={filteredData} />
            <div />
            <PieChart data={filteredData} />
        </>
    );
};

export default Grid;
