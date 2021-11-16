import { Response } from "@/types/IData";
import { Table } from "@/types/table";
import { Where } from "@/utils/sql";

type LeftJoinItem = {
    table: Table;
    on?: string;
    columns?: string[]
}

type LeftJoin = LeftJoinItem | LeftJoinItem[]

export interface GetProps {
    table?: Table;
    columns?: string[];
    where?: Where;
    leftJoin?: LeftJoin;
}
export interface CountProps {
    table?: Table;
    where?: Where;
    pageKey?: string;
    leftJoin?: LeftJoin;
}
export interface ListProps {
    table?: Table;
    columns?: string[];
    where?: object;
    order?: string[];
    pageIndex?: number;
    pageSize?: number;
    leftJoin?: LeftJoin;
}
export interface AddProps<T = object> {
    table?: Table;
    data: Partial<T> | Partial<T>[];
}
export interface PutProps<T = object> {
    table?: Table;
    where: Where;
    data: Partial<T> | Partial<T>[];
}
export interface DelProps {
    table?: Table;
    where: Where;
}

export interface BaseServiceImpl {
    tableName?: Table | "";
    get<T extends object>(props: GetProps): Promise<Response<T>>
    count(props: CountProps): Promise<Response<number>>
    list<T extends object>(props: ListProps): Promise<Response<T[]>>
    add<T extends object>(props: AddProps<T>): Promise<Response<T>>
    put<T extends object>(props: PutProps<T>): Promise<Response<T>>
    del(props: DelProps): Promise<Response<unknown>>
    remove(props: DelProps): Promise<Response<unknown>>
}