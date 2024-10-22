export interface PaginateResult<T> {
    items: T;
    itemsCount: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
    offset: number;
}