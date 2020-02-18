import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { DataType } from "./GridTypes";
import * as R from "rambda";
import diff from "deep-diff";

// I want to get three lists. deleted items, added items, and edited items.
// R.difference can let us know when items are in the first list, but
// not in the second list, giving is a mix of edited and removed items,
// and edited and added items, depending on the order of the lists you pass in.

// By getting both of those lists, you can filter out the edited lists by
// running the diff on them again, only getting you just the removed items and
// just the added items. From there we filter out items in the removed and added
// lists, to give just a list of edited items.
const useDataDiff = (itemsOld: any, itemsNew: any) => {
    const [initialData, setInitialData] = useState<DataType[]>([]);
    const [sortedFilteredData, setSortedFilteredData] = useState<DataType[]>(
        []
    );

    useEffect(() => {
        const getId = (item: { id: string }) => item.id;
        const getData = (id: string, newItemIDs: any[], oldItemIDs?: any[]) => {
            const newItems = newItemIDs.find(item => item.id === id);

            if (!oldItemIDs) {
                return newItems;
            }

            const oldItems = oldItemIDs.find(item => item.id === id);

            const result = {
                ...newItems,
                diff: diff(oldItems, newItems),
                message: ""
            };

            result.message = result.diff.reduce(
                (acc: string, diffItem: any) => {
                    const path = diffItem.path.join(" ");
                    return `${acc} ${path} changed from ${diffItem.lhs} to ${diffItem.rhs}.`.trim();
                },
                ""
            );
            return result;
        };

        const editedAndRemovedItems: DataType[] = R.difference(
            itemsOld,
            itemsNew
        );
        const editedAndRemovedItemIDs = editedAndRemovedItems.map(getId);

        const editedAndAddedItems: DataType[] = R.difference(
            itemsNew,
            itemsOld
        );
        const editedAndAddedItemIDs = editedAndAddedItems.map(getId);

        const removedItemIDs = R.difference(
            editedAndRemovedItemIDs,
            editedAndAddedItemIDs
        );
        const removedItems = removedItemIDs.map((id: string) =>
            getData(id, itemsOld)
        );

        const addedItemIDs = R.difference(
            editedAndAddedItemIDs,
            editedAndRemovedItemIDs
        );
        const addedItems = addedItemIDs.map((id: string) =>
            getData(id, itemsNew)
        );

        const editedItems = Array.from(
            new Set(
                [...editedAndRemovedItemIDs, ...editedAndAddedItemIDs].filter(
                    id => ![...removedItemIDs, ...addedItemIDs].includes(id)
                )
            )
        ).map((id: string) => getData(id, itemsNew, itemsOld));

        const items = [
            ...itemsNew.map((item: any) => {
                let result = {
                    ...item,
                    edited: false,
                    added: false,
                    removed: false
                };

                if (editedItems.some(editedItem => editedItem.id === item.id)) {
                    result = {
                        ...result,
                        edited: true
                    };
                }

                if (addedItems.includes(item)) {
                    result = {
                        ...result,
                        added: true
                    };
                }

                console.log(result);

                return result;
            }),

            ...removedItems.map(item => ({
                ...item,
                edited: false,
                added: false,
                removed: true
            }))
        ];

        setInitialData(items);
        setSortedFilteredData(items);
    }, [itemsNew, itemsOld]);

    const result: [
        DataType[],
        DataType[],
        Dispatch<SetStateAction<DataType[]>>
    ] = [initialData, sortedFilteredData, setSortedFilteredData];
    return result;
};

export default useDataDiff;
