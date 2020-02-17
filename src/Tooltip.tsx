import React from "react";
import "./Tooltip.scss";

function Tooltip(props: any) {
    const data = props.api.getDisplayedRowAtIndex(props.rowIndex).data;
    return <div className='custom-tooltip'>{data.message}</div>;
}
export default Tooltip;
