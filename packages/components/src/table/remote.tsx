// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Page, Problem, Query, query2Search, REST } from '@cmfx/core';
import { JSX, onMount, splitProps } from 'solid-js';
import IconDelete from '~icons/material-symbols/delete';

import { RefProps } from '@components/base';
import { ConfirmButton } from '@components/button';
import { useLocale } from '@components/context';
import { Props as LoaderProps, Ref as LoaderRef, LoaderTable } from './loader';

/**
 * 数据表中每一行的类型，必须带有 ID 作为其唯一标记。
 */
interface Row {
    id?: string | number;
    [key: string]: unknown;
}

export interface Ref<T extends Row> extends LoaderRef<T> {
    /**
     * 删除指定数据并刷新当前表
     *
     * @param id - 需要删除数据的 id，该值相对于 {@link Props#path} 属性生成删除地址。
     */
    delete(id: T['id']): Promise<void>;

    /**
     * 基于 {@link delete} 提供一个用于删除指定 id 的按钮组件
     */
    DeleteAction(id: T['id']): JSX.Element;
}

export interface Props<T extends Row, Q extends Query> extends Omit<LoaderProps<T, Q>, 'load'|'ref'>, RefProps<Ref<T>> {
    /**
     * 数据的加载地址
     *
     * 由 {@link Ref.DeleteAction} 生成的组件也会基于此值作删除操作
     */
    path: string;

    /**
     * 指定访问后端接口的 {@link REST} 对象
     */
    rest: REST;

    onProblem?: { <PE = never>(p?: Problem<PE>): Promise<void>; };
}

/**
 * 基于远程数据的表格
 *
 * 相对于 {@link LoaderTable}，限制了加载的数据方式只能是特定的远程地址。
 * 但是通过 {@link Ref} 也提供了更多的操作方法。
 */
export function RemoteTable<T extends Row, Q extends Query>(props: Props<T,Q>) {
    const l = useLocale();

    const [_, tableProps] = splitProps(props, ['path', 'ref']);
    const load = props.paging
        ? buildPagingLoadFunc(props.rest, props.path, props.onProblem)
        : buildNoPagingLoadFunc(props.rest, props.path, props.onProblem);
    let ref: LoaderRef<T>;

    onMount(() => {
        if (props.ref) {
            props.ref({
                items() { return ref.items(); },

                async refresh(): Promise<void> { await ref.refresh(); },

                async delete(id: T['id']): Promise<void> {
                    if (id === undefined) { throw new Error('参数 id 必须是一个有效的值'); }

                    const ret = await props.rest.delete(`${props.path}/${id}`);
                    if (!ret.ok) {
                        if (props.onProblem) { await props.onProblem(ret.body); }
                        return;
                    }
                    await ref.refresh();
                },

                DeleteAction(id: T['id']) {
                    if (id === undefined) { throw new Error('参数 id 必须是一个有效的值'); }

                    return <ConfirmButton square rounded palette='error'
                        title={l.t('_c.deleteRow')}
                        onclick={async () => { await this.delete(id); }}
                    ><IconDelete /></ConfirmButton>;
                },

                table() { return ref.table(); },

                root() { return ref.root(); }
            });
        }
    });

    return <LoaderTable ref={el => ref = el} {...tableProps} load={load as any} />;
}

function buildPagingLoadFunc<T extends Row, Q extends Query>(rest: REST, path: string, onProblem?: Props<T,Q>['onProblem']) {
    return async (q: Q): Promise<Page<T> | undefined> => {
        const ret = await rest.get<Page<T>>(path + query2Search(q));
        if (!ret.ok) {
            if ((ret.status !== 404) && onProblem) { onProblem(ret.body); }
            return { count: 0, current: [] };
        }
        return ret.body;
    };
}

function buildNoPagingLoadFunc<T extends Row, Q extends Query>(rest: REST, path: string, onProblem?: Props<T,Q>['onProblem']) {
    return async (q: Q): Promise<Array<T> | undefined> => {
        const ret = await rest.get<Array<T>>(path + query2Search(q));
        if (!ret.ok) {
            if ((ret.status !== 404) && onProblem) { onProblem(ret.body); }
            return [];
        }
        return ret.body;
    };
}
