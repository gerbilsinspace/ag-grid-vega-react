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
const useDataDiff = (oldItems: any, newItems: any) => {
    const [initialData, setInitialData] = useState<DataType[]>([]);
    const [sortedFilteredData, setSortedFilteredData] = useState<DataType[]>(
        []
    );

    useEffect(() => {
        const getId = (item: { id: string }) => item.id;
        const doesItemMatchId = (firstId: string) => (item: { id: string }) =>
            firstId === item.id;

        const getData = (id: string, newItems: any[] = []) =>
            newItems.find(doesItemMatchId(id));

        const getDiff = (item: any, oldItems: any[]) =>
            diff(item, oldItems.find(doesItemMatchId(item.id)));

        // R.difference can only tell us what items are
        // in one array but are not in another. By flipping
        // the order, we get a copy of removed and added items,
        // but they are mixed up with other edited items.
        const editedAndRemovedItems: DataType[] = R.difference(
            oldItems,
            newItems
        );
        const editedAndRemovedItemIDs = editedAndRemovedItems.map(getId);

        const editedAndAddedItems: DataType[] = R.difference(
            newItems,
            oldItems
        );
        const editedAndAddedItemIDs = editedAndAddedItems.map(getId);

        // Thankfully, by running R.difference on the diff will seperate out
        // removed items and added items from edited items. By flipping the
        // of arrays we pass, we get either removed items or added items.
        const removedItemIDs = R.difference(
            editedAndRemovedItemIDs,
            editedAndAddedItemIDs
        );

        const removedItems = removedItemIDs.map((id: string) =>
            getData(id, oldItems)
        );

        const addedItemIDs = R.difference(
            editedAndAddedItemIDs,
            editedAndRemovedItemIDs
        );
        const addedItems = addedItemIDs.map((id: string) =>
            getData(id, newItems)
        );

        // Now we have removed and added items, we can get the edited
        // items by getting items which were not in the first two lists.
        // We add a set to de duplicate the list.
        const editedItemIDs = Array.from(
            new Set(
                [...editedAndRemovedItemIDs, ...editedAndAddedItemIDs].filter(
                    id => ![...removedItemIDs, ...addedItemIDs].includes(id)
                )
            )
        );

        const editedItems = editedItemIDs.map((id: string) => {
            const data = getData(id, newItems);
            return {
                ...data,
                diff: getDiff(data, oldItems)
            };
        });

        const items = [
            ...newItems.map((item: any) => {
                let result = {
                    ...item,
                    edited: false,
                    added: false,
                    removed: false
                };

                const editedItem = editedItems.find(
                    editedItem => editedItem.id === item.id
                );

                if (editedItem) {
                    result = {
                        ...result,
                        ...editedItem,
                        edited: true
                    };

                    result.message = result.diff.reduce(
                        (acc: string, diffItem: any) => {
                            const path = diffItem.path.join(" ");
                            const capitalizedPath =
                                path.charAt(0).toUpperCase() + path.substr(1);
                            return `${acc} ${capitalizedPath} changed from ${diffItem.lhs} to ${diffItem.rhs}.`.trim();
                        },
                        ""
                    );
                }

                if (addedItems.includes(item)) {
                    result = {
                        ...result,
                        added: true,
                        message: "Item added"
                    };
                }

                return result;
            }),

            ...removedItems.map(item => ({
                ...item,
                edited: false,
                added: false,
                removed: true,
                message: "Item removed"
            }))
        ];

        setInitialData(items);
        setSortedFilteredData(items);
    }, [newItems, oldItems]);

    const result: [
        DataType[],
        DataType[],
        Dispatch<SetStateAction<DataType[]>>
    ] = [initialData, sortedFilteredData, setSortedFilteredData];
    return result;
};

export default useDataDiff;
