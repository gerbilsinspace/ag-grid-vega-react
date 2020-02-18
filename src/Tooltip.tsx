import React from "react";
import "./Tooltip.scss";

function Tooltip(props: any) {
    const data = props.api.getDisplayedRowAtIndex(props.rowIndex).data;
    if (data && data.message) {
        return (
            <div className='custom-tooltip'>
                {data &&
                    data.message &&
                    data.message
                        .split(".")
                        .filter((item: string) => item.length > 0)
                        .map((message: string) => (
                            <li key={message}>{message}</li>
                        ))}
            </div>
        );
    }

    return null;
}
export default Tooltip;
