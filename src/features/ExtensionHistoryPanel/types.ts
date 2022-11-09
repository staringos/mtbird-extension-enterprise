import {IComponentInstance, IExtensionContext, IExtensionDTO} from "@mtbird/shared";

export type ExtensionProps = {
    extension: IExtensionDTO;
    context: IExtensionContext;
    refresh: () => void;
}

export type HistoryListDTO<T> = {
    pageNum: number;
    pageSize: number;
    code: number;
    msg: string;
    data: T[];
    total: number;
}

export type RollbackResultDTO = {}

export type ResponseDTO<DT> = {
    status: number;
    statusText: string;
    headers: Record<string, string> & {
        "set-cookie"?: string[]
    }
    data: DT
}

export type HistoryItemDTO = {
    id: string;
    createdAt: string;
    content: IComponentInstance;
    pageId: string;
    creatorId: string;
    creator: {
        id: string;
        name: string | null;
        nickname: string;
        avatar: string | null;
    }
}

export type HistoryItemDO = {
    id: string;
    pageId: string;
    shortId: string;
    avatar: string | undefined;
    nickname: string;
    date: string;
}

export type HistoryListData = {
    pagination: {
        pageNum: number;
        pageSize: number;
    };
    data: HistoryItemDO[];
    pagedData: Array<HistoryItemDO[] | false>;
    total: number;
}