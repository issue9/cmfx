// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { splitProps } from 'solid-js';

import { useApp } from '@/app/context';
import { Page } from '@/core';
import Datatable, { Props as BaseProps } from './datatable';
import { Query, query2Search } from './search';

export interface Props<T extends object, Q extends Query> extends Omit<BaseProps<T, Q>, 'load'> {
    /**
     * 数据的远程路径
     */
    path: string;
};

/**
 * 用于加载远程数据到当前表
 */
export default function<T extends object, Q extends Query>(props: Props<T, Q>) {
    const ctx = useApp();
    const [_, tblProps] = splitProps(props, ['path']);

    let load: BaseProps<T, Q>['load'];
    if (props.paging) {
        load = async (q: Q): Promise<Page<T> | undefined> => {
            const ret = await ctx.get<Page<T>>(props.path + '?' + query2Search(q));
            if (!ret.ok) {
                ctx.outputProblem(ret.status, ret.body);
                return {count: 0, current: []};
            }
            return ret.body;
        };
    } else {
        load = async (q: Q): Promise<Array<T> | undefined> => {
            const ret = await ctx.get<Array<T>>(props.path + '?' + query2Search(q));
            if (!ret.ok) {
                ctx.outputProblem(ret.status, ret.body);
                return [];
            }
            return ret.body;
        };
    }

    return <Datatable load={load} {...tblProps} />;
}
