import { GRID_SORT_ENUM } from "../constants/grid.constants";
import { ReportProductModel } from "../models/reports.models";

const sortProductModelAfterName = (a: ReportProductModel, b: ReportProductModel): number => {
    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
}

const sortProductModelAfterType = (a: ReportProductModel, b: ReportProductModel): number => {
    return (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0);
}

const getProductModelSortingFunc = (column: string) => {
    switch (column) {
        case GRID_SORT_ENUM.NAME: return sortProductModelAfterName;
        case GRID_SORT_ENUM.TYPE: return sortProductModelAfterType;
        default: return sortProductModelAfterName;
    }
}

export { sortProductModelAfterName, sortProductModelAfterType, getProductModelSortingFunc };