// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Dropdown, Table, useLocale } from '@cmfx/components';
import {
    Class, ClassMethod, ClassProperty, Function, Interface, InterfaceMethod,
    InterfaceProperty, Intersection, Literal, Type, Union
} from '@cmfx/vite-plugin-api';
import { createSignal, For, JSX, Match, Show, Switch } from 'solid-js';
import IconDown from '~icons/material-symbols/arrow-drop-down';

import { markdown } from '@docs/utils';
import styles from './style.module.css';

/**
 * 生成 API 表格
 */
export function API(props: { api: Type }): JSX.Element {
    return <section class={styles.api}>
        <h4>{props.api.name}</h4>
        <Show when={props.api.summary}>{summary =><p innerHTML={markdown(summary())} />}</Show>
        <Show when={props.api.remarks}>{remarks =><p innerHTML={markdown(remarks())} />}</Show>

        <Switch>
            <Match when={props.api.kind === 'literal' ? props.api : undefined}>
                {literal => <LiteralBody literal={literal()} />}
            </Match>
            <Match when={props.api.kind === 'class' ? props.api : undefined}>
                {cls => <ClassBody cls={cls()} />}
            </Match>
            <Match when={props.api.kind === 'interface' ? props.api : undefined}>
                {intf => <InterfaceBody intf={intf()} />}
            </Match>
            <Match when={props.api.kind === 'function' ? props.api : undefined}>
                {func => <FunctionBody func={func()} />}
            </Match>
            <Match when={props.api.kind === 'union' ? props.api : undefined}>
                {union => <UnionBody union={union()} />}
            </Match>
            <Match when={props.api.kind === 'intersection' ? props.api : undefined}>
                {intersection => <IntersectionBody intersection={intersection()} />}
            </Match>
        </Switch>
    </section>;
}

function LiteralBody(props: {literal: Literal}): JSX.Element {
    return <p innerHTML={tscode(props.literal.type)} />;
}

function UnionBody(props: {union: Union}): JSX.Element {
    const discriminants: Array<string> = [];
    if (props.union.discriminant) {
        for (const u of props.union.types) {
            if (u.kind === 'interface' || u.kind === 'class') {
                const v = u.properties?.find(p => p.name === props.union.discriminant)!.type!;
                discriminants.push(v);
            } else if (u.kind === 'intersection') {
                for (const i of u.types) {
                    if (i.kind === 'interface' || i.kind === 'class') {
                        const v = i.properties?.find(p => p.name === props.union.discriminant)!.type!;
                        discriminants.push(v);
                    }
                }
            }
        }
    }

    const [properties, setProperties]  = createSignal<Array<InterfaceProperty | ClassProperty>>();
    const [methods, setMethods]  = createSignal<Array<InterfaceMethod | ClassMethod>>();

    const change = (v: string) => {
        for (const p of props.union.types) {
            if (p.kind === 'interface' || p.kind === 'class') {
                if (p.properties && p.properties.length > 0) {
                    if (v === '' || p.properties.find(pp => pp.name === props.union.discriminant)?.type === v) {
                        setProperties(p.properties);
                        setMethods(p.methods);
                    }
                }
            } else if (p.kind === 'intersection') {
                for (const i of p.types) {
                    if (i.kind === 'interface' || i.kind === 'class') {
                        if (i.properties && i.properties.length > 0) {
                            if (v === '' || i.properties.find(pp => pp.name === props.union.discriminant)?.type === v) {
                                setProperties(i.properties);
                                setMethods(i.methods);
                            }
                        }
                    }
                }
            }
        }
    };
    change(discriminants[0] ? discriminants[0] : '');

    return <>
        <TypeParams typeParams={props.union.typeParams} />
        <Properties props={properties()} discriminant={props.union.discriminant} discriminants={discriminants} onchange={change} />
        <Methods methods={methods()} />
    </>;
}

function IntersectionBody(props: {intersection: Intersection}): JSX.Element {
    const properties: Array<InterfaceProperty | ClassProperty> = [];
    const methods: Array<InterfaceMethod | ClassMethod> = [];

    for (const p of props.intersection.types) {
        if (p.kind === 'interface' || p.kind === 'class') {
            if (p.properties && p.properties.length > 0) {
                properties.push(...p.properties);
            }
            if (p.methods && p.methods.length > 0) {
                methods.push(...p.methods);
            }
        }
    }

    return <>
        <TypeParams typeParams={props.intersection.typeParams} />
        <Properties props={properties} />
        <Methods methods={methods} />
    </>;
}

function ClassBody(props: { cls: Class }): JSX.Element {
    return <Intf intf={props.cls} />;
}

function InterfaceBody(props: { intf: Interface }): JSX.Element {
    return <Intf intf={props.intf} />;
}

function FunctionBody(props: { func: Function }): JSX.Element {
    return <Func func={props.func} />;
}

/**
 * {@link Interface} 和 {@link Class} 的展示组件
 */
function Intf(props: { intf: Interface | Class }): JSX.Element {
    return <>
        <TypeParams typeParams={props.intf.typeParams} />
        <Properties props={props.intf.properties} />
        <Methods methods={props.intf.methods} />
    </>;
}

function TypeParams(props: { typeParams: Interface['typeParams'] }): JSX.Element {
    const l = useLocale();

    return <Show when={props.typeParams && props.typeParams.length > 0}>
        <h5>{ l.t('_d.stages.typeParam') }</h5>
        <Table hoverable class={styles.interface}>
            <thead>
                <tr>
                    <th>{l.t('_d.stages.type')}</th>
                    <th>{l.t('_d.stages.constraint')}</th>
                    <th>{l.t('_d.stages.preset')}</th>
                    <th>{l.t('_d.stages.desc')}</th>
                </tr>
            </thead>
            <tbody>
                <For each={props.typeParams}>
                    {p =>
                        <tr>
                            <th>{ p.name }</th>
                            <td innerHTML={tscode(p.type)} />
                            <td innerHTML={tscode(p.init)} />
                            <td innerHTML={markdown(p.summary)} />
                        </tr>
                    }
                </For>
            </tbody>
        </Table>
    </Show>;
}

function Methods(props:{methods: Interface['methods'] | Class['methods']}): JSX.Element {
    const l = useLocale();

    return <Show when={props.methods && props.methods.length > 0}>
        <h5>{ l.t('_d.stages.methods') }</h5>
        <For each={props.methods}>
            {f => <Func func={f} />}
        </For>
    </Show>;
}

interface PropertiesProps {
    props: Class['properties'] | Interface['properties']; // 属性列表

    // 以下为区分联合类型字段的相关属性

    onchange?: (value: string) => void; // 区分联合类型切换时触发的事件
    discriminants?: Array<string>; // 区分联合类型选项列表
    discriminant?: string; // 区分联合类型在 {@link props} 中的列表
}

/**
 * {@link Interface} 和 {@link Class} 的属性展示组件
 */
function Properties(props: PropertiesProps): JSX.Element {
    const l = useLocale();

    return <Show when={props.props && props.props.length > 0}>
        <h5>{ l.t('_d.stages.properties') }</h5>
        <Table hoverable class={styles.interface}>
            <thead>
                <tr>
                    <th>{l.t('_d.stages.property')}</th>
                    <th>{l.t('_d.stages.type')}</th>
                    <th>{l.t('_d.stages.preset')}</th>
                    <th>{l.t('_d.stages.desc')}</th>
                </tr>
            </thead>
            <tbody>
                <For each={props.props}>
                    {field => (
                        <tr>
                            <th>{field.name}
                                <Chips {...field} />
                                <Show when={props.discriminant === field.name}>
                                    <Dropdown align='start' onChange={props.onchange}
                                        items={props.discriminants!.map(v => ({ label: v, value: v, type: 'item' }))}
                                    >
                                        <IconDown class={styles.dropdown} />
                                    </Dropdown>
                                </Show>
                            </th>
                            <td innerHTML={tscode(field.type)} />
                            <td innerHTML={tscode(field.def)} />
                            <td>
                                <Show when={field.summary}>{summary =>
                                    <p innerHTML={markdown(summary())} />
                                }</Show>
                                <Show when={field.remarks}>{remarks =>
                                    <p class={styles.remarks} innerHTML={markdown(remarks())} />
                                }</Show>
                            </td>
                        </tr>
                    )}
                </For>
            </tbody>
        </Table>
    </Show>;
}

/**
 * 单个函数或方法的展示
 */
function Func(props: { func: InterfaceMethod }): JSX.Element {
    const l = useLocale();

    return <div class={styles.func}>
        <p class={styles.signature} innerHTML={tscode(props.func.type)} />

        <TypeParams typeParams={props.func.typeParams} />

        <Table hoverable class={styles.func}>
            <thead>
                <tr>
                    <th>{l.t('_d.stages.parameter')}</th>
                    <th>{l.t('_d.stages.type')}</th>
                    <th>{l.t('_d.stages.preset')}</th>
                    <th>{l.t('_d.stages.desc')}</th>
                </tr>
            </thead>
            <tbody>
                <For each={props.func.params}>
                    {param => <tr>
                        <td>{param.name}</td>
                        <td innerHTML={tscode(param.type)} />
                        <td innerHTML={tscode(param.def)} />
                        <td innerHTML={markdown(param.summary)} />
                    </tr>
                    }
                </For>
                <tr>
                    <td>{l.t('_d.stages.returnValue')}</td>
                    <td innerHTML={tscode(props.func.return.type)} />
                    <td></td>
                    <td innerHTML={markdown(props.func.return.summary)} />
                </tr>
            </tbody>
        </Table>
    </div>;
}

function Chips(props: {reactive?: boolean, readonly?: boolean, getter?: boolean, setter?: boolean}): JSX.Element {
    const l = useLocale();

    return <>
        <Show when={props.reactive}><kbd title={l.t('_d.stages.reactive')}>R</kbd></Show>
        <Show when={props.readonly}><kbd title={l.t('_d.stages.readonly')}>RO</kbd></Show>
        <Show when={props.getter}><kbd title={l.t('_d.stages.getter')}>G</kbd></Show>
        <Show when={props.setter}><kbd title={l.t('_d.stages.setter')}>S</kbd></Show>
    </>;
}

function tscode(code?: string): string {
    return code ? markdown('```ts\n' + code.trim() + '\n```') : '';
}
