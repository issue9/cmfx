// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, mergeProps, splitProps } from 'solid-js';

import { Corner } from '@/components/base';
import { Dropdown } from '@/components/dropdown';
import { Value } from '@/components/tree/item';
import { Props as BaseProps, defaultProps as defaultBaseProps, default as Panel } from './panel';

export interface Props extends Omit<BaseProps, 'onChange'> {
    activator: JSX.Element;

    pos?: Corner;

    /**
     * 当选择项发生变化时触发的事件
     *
     * 如果返回了 true，表示不需要关闭弹出的菜单，否则会自动关闭弹出菜单。
     */
    onChange?: { (selected: Value, old?: Value): boolean | undefined; };
}

const defaultProps: Readonly<Partial<Props>> = {
    ...(defaultBaseProps as any),
    pos: 'bottomleft' as Corner
};

/**
 * 下拉菜单组件
 */
export default function(props: Props): JSX.Element {
    props = mergeProps(defaultProps, props);
    const [visible, setVisible] = createSignal(false);

    const [_, panelProps] = splitProps(props, ['pos', 'activator', 'onChange', 'children']);

    let onchange: BaseProps['onChange'];
    if (props.onChange) {
        onchange = (selected: Value, old?: Value) => {
            if (!props.onChange!(selected, old)) {
                setVisible(false);
            }
        }
    }

    return <Dropdown visible={visible()} setVisible={setVisible} activator={props.activator} pos={props.pos} class="z-[2000]">
        <Panel onChange={onchange} {...panelProps}>{props.children}</Panel>
    </Dropdown>;
}
