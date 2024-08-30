// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, splitProps } from 'solid-js';

import { AppContext, useApp } from '@/app/context';
import { ConfirmButton } from '@/components/button';
import { Page } from '@/core';
import LoaderTable, { Methods as LoaderMethods, Props as LoaderProps } from './loader';
import { Query, query2Search } from './search';

export interface Methods extends LoaderMethods {
    /**
     * 提供一个用于删除指定 id 的按钮组件
     */
    DeleteAction(id: string | number): JSX.Element;
}

export interface Props<T extends object, Q extends Query> extends Omit<LoaderProps<T,Q>, 'load'|'ref'> {
    ref?: { (el: Methods): void; };

    /**
     * 数据的加载地址
     *
     * 由 {@link Methods#DeleteAction} 生成的组件也会基于此值作删除操作
     */
    path: string
}

/**
 * 基于远程数据的表格
 *
 * 相对于 {@link LoaderTable}，限制了加载的数据方式只能是特定的远程地址。
 * 但是通过 {@link Methods} 也提供了更多的操作方法。
 */
export default function<T extends object, Q extends Query>(props: Props<T,Q>) {
    const ctx = useApp();
    const [_, tableProps] = splitProps(props, ['path', 'ref']);
    const load = props.paging ? buildPagingLoadFunc(ctx, props.path) : buildNoPagingLoadFunc(ctx, props.path);
    let ref: LoaderMethods;

    if (props.ref) {
        props.ref({
            refresh: async () => { await ref.refresh(); },

            DeleteAction: (id: string|number) => {
                return <ConfirmButton icon rounded pos="bottomright" palette='error' title={ctx.t('_i.page.deleteItem')} onClick={async () => {
                    const ret = await ctx.delete(`${props.path}/${id}`);
                    if (!ret.ok) {
                        ctx.outputProblem(ret.status, ret.body);
                        return;
                    }
                    await ref.refresh();
                }}>delete</ConfirmButton>;
            }
        });
    }

    return <LoaderTable ref={(el)=>ref=el} {...tableProps} load={load as any} />;
}

function buildPagingLoadFunc<T extends object, Q extends Query>(ctx: AppContext, path: string) {
    return async (q: Q): Promise<Page<T> | undefined> => {
        const ret = await ctx.get<Page<T>>(path + '?' + query2Search(q));
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return { count: 0, current: [] };
        }
        return ret.body;
    };
}

function buildNoPagingLoadFunc<T extends object, Q extends Query>(ctx: AppContext, path: string) {
    return async (q: Q): Promise<Array<T> | undefined> => {
        const ret = await ctx.get<Array<T>>(path + '?' + query2Search(q));
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return [];
        }
        return ret.body;
    };
}
