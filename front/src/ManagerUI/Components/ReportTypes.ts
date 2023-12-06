/**
 * `RestockData` interface represents the data structure for restock reports.
 */
export interface RestockData {
    stock_id: number;
    stock_item: string;
    cost: number;
    stock_quantity: number;
    max_amount: number;
}

/**
 * `SalesPerformanceData` interface represents the data structure for sales performance reports.
 */
export interface SalesPerformanceData {
    item_id: number;
    served_item: string;
    num_sales: number;
}

/**
 * `ExcessData` interface represents the data structure for excess inventory reports.
 */
export interface ExcessData {
    stock_id: number;
    stock_quantity: number;
    sold_quantity: number;
}

/**
 * `InventoryUsageData` interface represents the data structure for inventory usage reports.
 */
export interface InventoryUsageData {
    stock_id: number;
    usage_count: number;
}

/**
 * `FreqPairsData` interface represents the data structure for frequently paired items reports.
 */
export interface FreqPairsData {
    item1: string;
    item2: string;
    occurrences: number;
}

/**
 * `ReportData` type represents the data structure for all types of reports.
 */
export type ReportData = {
    restockReport?: RestockData[];
    salesReport?: SalesPerformanceData[];
    excessReport?: ExcessData[];
    usageReport?: InventoryUsageData[];
    freqPairsReport?: FreqPairsData[];
};

/**
 * `ReportTypeToStateKeyMap` constant maps report generation function names to their corresponding state keys.
 */
export const ReportTypeToStateKeyMap = {
    'generateRestockReport': 'restockReport',
    'generateSalesReport': 'salesReport',
    'generateExcessReport': 'excessReport',
    'generateUsageReport': 'usageReport',
    'generateFreqPairsReport': 'freqPairsReport',
};