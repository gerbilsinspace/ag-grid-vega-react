import React from "react";

function Tooltip(props: any) {
    const data = props.api.getDisplayedRowAtIndex(props.rowIndex).data;
    return <div className='custom-tooltip'>{data.message}</div>;
}
export default Tooltip;
