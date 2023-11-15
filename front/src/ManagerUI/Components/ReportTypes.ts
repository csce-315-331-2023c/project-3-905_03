export interface RestockData {
    stock_id: number;
    stock_item: string;
    cost: number;
    stock_quantity: number;
    max_amount: number;
}

export interface SalesPerformanceData {
    item_id: number;
    served_item: string;
    num_sales: number;
}

export interface ExcessData {
    stock_id: number;
    stock_quantity: number;
    sold_quantity: number;
}

export interface InventoryUsageData {
    stock_id: number;
    usage_count: number;
}

export interface FreqPairsData {
    item1: string;
    item2: string;
    occurrences: number;
}

export type ReportData = {
    restockReport?: RestockData[];
    salesReport?: SalesPerformanceData[];
    excessReport?: ExcessData[];
    usageReport?: InventoryUsageData[];
    freqPairsReport?: FreqPairsData[];
};

export const ReportTypeToStateKeyMap = {
    'generateRestockReport': 'restockReport',
    'generateSalesReport': 'salesReport',
    'generateExcessReport': 'excessReport',
    'generateUsageReport': 'usageReport',
    'generateFreqPairsReport': 'freqPairsReport',
};