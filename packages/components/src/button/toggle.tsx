// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';
import IconCollapse from '~icons/material-symbols/collapse-content';
import IconExpand from '~icons/material-symbols/expand-content';
import IconFullScreen from '~icons/material-symbols/fullscreen';
import IconFullScreenExit from '~icons/material-symbols/fullscreen-exit';

import { IconSet } from '@/icon';
import { Props as BaseProps, Button } from './button';
import styles from './style.module.css';
import { presetProps } from './types';

export interface Props extends Omit<BaseProps, 'onclick' | 'children' | 'type'> {
    /**
     * 按钮的类型
     *
     * @reactive
     * @defaultValue 'button'
     */
    type?: Exclude<BaseProps['type'], 'a'>;

    /**
     * 指定按钮的状态
     *
     * @remarks
     * 有些条件下可能会通过外部状态修改按钮的状态，此时可以使用此属性。
     */
    value?: boolean;

    /**
     * 执行切换状态的方法
     *
     * @remarks
     * 该方法应该返回一个 `Promise<boolean>`，用于异步执行切换操作。
     * 当 Promise 解决时，根据返回的值决定显示 {@link on} 或是 {@link off}。
     */
    toggle: { (): Promise<boolean>; };

    /**
     * 状态 1 的图标
     *
     * @reactive
     */
    on: JSX.Element;

    /**
     * 状态 2 的图标
     *
     * @reactive
     */
    off: JSX.Element;
}

/**
 * 可在多种状态切换的按钮
 *
 * @remarks
 * 单一元素切换不同的状态，最容易让人误解的地方是：当前的状态图标表示是当前状态，还是切换后的状态。
 * 所以一般情况下应该使用 {@link GroupButton} 表示不同状态的值，这样会更直接。
 * 除非像全屏这种直接在应用上体现出来的。
 */
export function ToggleButton(props: Props): JSX.Element {
    props = mergeProps(presetProps, { type: 'button' as Props['type'] }, props);
    const [_, btnProps] = splitProps(props, ['toggle', 'on', 'off', 'value']);
    const [val, setVal] = createSignal(props.value);

    return <Button {...btnProps as any} onclick={async () => { setVal(await props.toggle()); }}>
        <IconSet icons={{on: props.on, off: props.off}} value={val() ? 'on' : 'off'} />
    </Button>;
}

export type ToggleFullScreenButtonProps = Omit<Props, 'toggle' | 'on' | 'off' | 'value'>;

/**
 * 切换全屏状态的按钮
 *
 * @remarks
 * 并不是所有的浏览器都支持全屏功能，比如 iOS 系统，在不支持的系统上默认会处于禁用状态。
 */
export function ToggleFullScreenButton(props: ToggleFullScreenButtonProps): JSX.Element {
    props = mergeProps({ disabled: !document.fullscreenEnabled }, props);
    const [fs, setFS] = createSignal(!document.fullscreenElement);

    // 有可能浏览器通过其它方式控制全屏功能
    const change = () => { setFS(!document.fullscreenElement); };
    onMount(() => { document.addEventListener('fullscreenchange', change); });
    onCleanup(() => { document.removeEventListener('fullscreenchange', change); });

    const toggle = async () => {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
            return true;
        } else {
            await document.body.requestFullscreen();
            return false;
        }
    };

    return <ToggleButton {...props} value={fs()}
        toggle={toggle} on={<IconFullScreen />} off={<IconFullScreenExit />} />;
}

export type ToggleFitScreenButtonProps = Omit<Props, 'toggle' | 'on' | 'off' | 'value'> & {
    /**
     * 指定需要扩展的容器
     */
    container: HTMLElement;
};

/**
 * 将指定的容器扩展至整个屏幕大小
 *
 * NOTE: 需要保证当前组件必须在 {@link ToggleFitScreenButtonProps#container} 之内，否则可能会无法退回原来状态的可能。
 */
export function ToggleFitScreenButton(props: ToggleFitScreenButtonProps): JSX.Element {
    const [_, btnProps] = splitProps(props, ['container']);
    const toggle = async () => {
        return props.container.classList.toggle(styles['fit-screen']);
    };

    return <ToggleButton {...btnProps} toggle={toggle} on={<IconCollapse />} off={<IconExpand />} />;
}
