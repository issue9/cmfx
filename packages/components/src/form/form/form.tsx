// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Flattenable } from '@cmfx/core';
import { Component, createEffect, createUniqueId, JSX, mergeProps, ParentProps, Show, splitProps } from 'solid-js';

import { BaseProps, joinClass, Layout, Palette } from '@components/base';
import { Button } from '@components/button';
import { BProps } from '@components/button/button';
import { useLocale } from '@components/context';
import { FormContext, FormProvider, useForm } from '@components/form/field';
import { Spin } from '@components/spin';
import { FormAPI, Options } from './api';
import styles from './style.module.css';

export interface Props extends BaseProps, FormContext, ParentProps {
    /**
     * 表单位于对话框中
     *
     * @remarks
     * 如果指定了该属性，那么表单的 submit 按钮将会关闭对话框，
     * 且 submit 按钮的 value 属性会传递给 dialog.returnValue。
     */
    inDialog?: boolean;
}

const preset: Props = {
    layout: 'horizontal' as Layout,
    hasHelp: true,
} as const;

export interface Actions {
    /**
     * 普通的按钮，但是可以跟随 {@link FormContext#rounded} 属性变化
     */
    Button(props: BProps): JSX.Element;

    /**
     * 提交按钮
     *
     * @remarks
     * 如果指定了 {@link FormContext#inDialog} 属性，那么表单的 submit 按钮将会关闭所在的对话框，
     * 且 submit 按钮的 value 属性会传递给 dialog.returnValue。
     * 按钮可以在表单之外，点击时会正确触发对应的表单事件。
     */
    Submit(props: Omit<BProps, 'type' | 'onclick'>): JSX.Element;

    /**
     * 重置按钮
     *
     * @remarks
     * 按钮可以在表单之外，点击时会正确触发对应的表单事件。
     */
    Reset(props: Omit<BProps, 'type' | 'onclick'>): JSX.Element;

    /**
     * 显示整个表单的错误信息
     *
     * @param props - 组件属性，默认值为 `{ palette: 'error' as Palette }`
     */
    Message(props: BaseProps): JSX.Element;
}

function ButtonAction (props: BProps): JSX.Element {
    const f = useForm();
    return <Button {...mergeProps({ disabled: f.disabled, rounded: f.rounded }, props)} />;
}

/**
 * 生成创建表单的相关功能
 *
 * @param options - 初始化参数；
 * @returns 返回元组，包含以下元素：
 *  - 0 {@link FormAPI} 实例；
 *  - 1 Form 组件；
 *  - 2 表单常用的一些操作按钮；
 * @typeParam T - 表示需要提交的对象类型；
 * @typeParam R - 表示服务端返回的类型；
 * @typeParam P - 表示服务端出错是返回的 {@link Problem#extension} 类型；
 */
export function createForm<T extends Flattenable, R = never, P = never>(
    options: Options<T, R, P>
): [api: FormAPI<T, R, P>, Form: Component<Props>, actions: Actions] {
    const api = new FormAPI<T, R, P>(options);

    const id = createUniqueId();

    const form = (props: Props) => {
        props = mergeProps(preset, props);
        const l = useLocale();

        createEffect(() => { // 保证验证器的语言正确
            const v = api.validator();
            if (v) { v.changeLocale(l); }
        });

        if (options.load) { api.load(); }

        return <FormProvider layout={props.layout} hasHelp={props.hasHelp} rounded={props.rounded}
            disabled={props.disabled} readonly={props.readonly}
            labelAlign={props.labelAlign} labelWidth={props.labelWidth}
        >
            <Spin id={id} tag="form" spinning={api.spinning()} palette={props.palette}
                class={joinClass(undefined, props.class)} style={props.style} ref={el => {
                    const f = el.root() as HTMLFormElement;
                    if (props.inDialog) { f.method = 'dialog'; }

                    f.addEventListener('reset', e => {
                        api.reset();
                        e.preventDefault();
                    });
                    f.addEventListener('submit', e => {
                        api.submit();
                        e.preventDefault();
                    });
                }}
            >
                {props.children}
            </Spin>
        </FormProvider>;
    };

    const actions: Actions = {
        Button: ButtonAction,

        Reset(props: Omit<BProps, 'onclick' | 'type'>): JSX.Element {
            const [_, otherProps] = splitProps(props, ['disabled']);
            return <ButtonAction form={id} {...otherProps} type="reset" disabled={props.disabled ?? api.isPreset()} />;
        },

        Submit(props: Omit<BProps, 'onclick' | 'type'>): JSX.Element {
            return <ButtonAction form={id} {...props} type="submit" />;
        },

        Message(props: BaseProps): JSX.Element {
            props = mergeProps({ palette: 'error' as Palette }, props );
            return <Show when={api.getError()}>
                {err =>
                    <div class={joinClass(props.palette, styles.error, props.class)} style={props.style}>{err()}</div>
                }
            </Show>;
        }
    };

    return [api, form, actions];
}
