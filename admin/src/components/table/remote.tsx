// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, splitProps } from 'solid-js';

import { AppContext, useApp } from '@/app/context';
import { ConfirmButton } from '@/components/button';
import { Page, Query, query2Search } from '@/core';
import LoaderTable, { Props as LoaderProps, Ref as LoaderRef } from './loader';

export interface Ref<T extends object> extends LoaderRef<T> {
    /**
     * 删除指定数据并刷新当前表
     *
     * @param id 需要删除数据的 id，该值相对于 {@link Props#path} 属性生成删除地址。
     */
    delete<T extends string|number>(id: T): Promise<void>;

    /**
     * 提供一个用于删除指定 id 的按钮组件
     *
     * 访问的地址为 DELETE {@link Props#path}/id。
     */
    DeleteAction<T extends string|number>(id: T): JSX.Element;
}

export interface Props<T extends object, Q extends Query> extends Omit<LoaderProps<T, Q>, 'load'|'ref'> {
    ref?: { (el: Ref<T>): void; };

    /**
     * 数据的加载地址
     *
     * 由 {@link Ref#DeleteAction} 生成的组件也会基于此值作删除操作
     */
    path: string
}

/**
 * 基于远程数据的表格
 *
 * 相对于 {@link LoaderTable}，限制了加载的数据方式只能是特定的远程地址。
 * 但是通过 {@link Ref} 也提供了更多的操作方法。
 */
export default function<T extends object, Q extends Query>(props: Props<T,Q>) {
    const ctx = useApp();
    const [_, tableProps] = splitProps(props, ['path', 'ref']);
    const load = props.paging ? buildPagingLoadFunc(ctx, props.path) : buildNoPagingLoadFunc(ctx, props.path);
    let ref: LoaderRef<T>;

    if (props.ref) {
        props.ref({
            items() { return ref.items(); },
            async refresh(): Promise<void> { await ref.refresh(); },

            async delete<T extends string|number>(id: T): Promise<void> {
                const ret = await ctx.api.delete(`${props.path}/${id}`);
                if (!ret.ok) {
                    await ctx.outputProblem(ret.body);
                    return;
                }
                await ref.refresh();
            },

            DeleteAction (id: string|number) {
                return <ConfirmButton icon rounded palette='error'
                    title={ctx.locale().t('_i.page.deleteItem')}
                    onClick={async () => { await this.delete(id); }}
                >delete</ConfirmButton>;
            }
        });
    }

    return <LoaderTable ref={(el)=>ref=el} {...tableProps} load={load as any} />;
}

function buildPagingLoadFunc<T extends object, Q extends Query>(ctx: AppContext, path: string) {
    return async (q: Q): Promise<Page<T> | undefined> => {
        const ret = await ctx.api.get<Page<T>>(path + query2Search(q));
        if (!ret.ok) {
            if (ret.status !== 404) {
                await ctx.outputProblem(ret.body);
            }
            return { count: 0, current: [] };
        }
        return ret.body;
    };
}

function buildNoPagingLoadFunc<T extends object, Q extends Query>(ctx: AppContext, path: string) {
    return async (q: Q): Promise<Array<T> | undefined> => {
        const ret = await ctx.api.get<Array<T>>(path + query2Search(q));
        if (!ret.ok) {
            if (ret.status !== 404) {
                await ctx.outputProblem(ret.body);
            }
            return [];
        }
        return ret.body;
    };
}
