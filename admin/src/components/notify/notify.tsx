// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, createUniqueId, For, JSX, mergeProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import { BaseProps, Palette } from '@/components/base';
import { Alert, Props as AlertProps } from './alert';

export type Props = BaseProps;

const presetProps: Readonly<Partial<Props>> = {
    palette: 'error',
};

export const types = ['error', 'warning', 'success', 'info'] as const;

export type Type = typeof types[number];

export const type2Palette: ReadonlyMap<Type, Palette> = new Map<Type, Palette>([
    ['error', 'error'],
    ['warning', 'tertiary'],
    ['success', 'primary'],
    ['info', 'secondary'],
]);

/**
 * 通知组件
 *
 * NOTE: 该组件会在全局注册一个 {@link Window#notify} 方法。
 * 不应该多次调用，且尽可能早地调用该组件，以使 notify 方法处于可用状态。
 */
export  function Notify(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const [msgs, setMsgs] = createSignal<Array<Omit<AlertProps,'del'>>>([]);

    Object.defineProperty(window, 'notify', {
        writable: false,
        value: async (title: string, body?: string, type?: Type, timeout = 5) => {
            const id = createUniqueId();
            let palette: Palette | undefined;
            if (type) { palette = type2Palette.get(type); }
            setMsgs((prev) => [...prev, { title, body, type, id, timeout, palette: palette }]);
        }
    });

    return <Portal>
        <div class={props.palette ? `c--notify palette--${props.palette}` : 'c--notify'}>
            <For each={msgs()}>
                {item =>(
                    <Alert {...item} del={(id)=>{
                        setMsgs((prev) => {
                            return [...prev.filter((n) => { return n.id !== id; })];
                        });
                    }} />
                )}
            </For>
        </div>
    </Portal>;
}
