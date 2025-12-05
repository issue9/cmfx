// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Flattenable } from '@cmfx/core';
import { Component, JSX, mergeProps, ParentProps } from 'solid-js';

import { BaseProps, joinClass, Layout } from '@/base';
import { Button, ButtonProps } from '@/button';
import { Spin } from '@/spin';
import { FormContext, FormProvider, useForm } from '@/form/field';
import { FormAPI, Options } from './api';

export interface Props extends BaseProps, FormContext, ParentProps {
    /**
     * 表单位于对话框中
     *
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
    Button(props: ButtonProps): JSX.Element;

    /**
     * 提交按钮
     */
    Submit(props: Omit<ButtonProps, 'type' | 'onclick'>): JSX.Element;

    /**
     * 重置按钮
     */
    Reset(props: Omit<ButtonProps, 'type' | 'onclick'>): JSX.Element;
}

function ButtonAction (props: ButtonProps): JSX.Element {
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
 */
export function createForm<T extends Flattenable, R = never, P = never>(
    options: Options<T, R, P>
): [api: FormAPI<T, R, P>, Form: Component<Props>, actions: Actions] {
    const api = new FormAPI<T, R, P>(options);

    const form = (props: Props) => {
        props = mergeProps(preset, props);

        return <FormProvider layout={props.layout} hasHelp={props.hasHelp} rounded={props.rounded}
            disabled={props.disabled} readonly={props.readonly} labelAlign={props.labelAlign} labelWidth={props.labelWidth}
        >
            <Spin tag="form" spinning={api.submitting()} palette={props.palette}
                class={joinClass(undefined, props.class)} style={props.style} ref={el => {
                    const f = el.element() as HTMLFormElement;
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

        Reset(props: Omit<ButtonProps, 'onclick' | 'type'>): JSX.Element {
            return <ButtonAction {...props} type="reset" />;
        },

        Submit(props: Omit<ButtonProps, 'onclick' | 'type'>): JSX.Element {
            return <ButtonAction {...props} type="submit" />;
        },
    };

    return [api, form, actions];
}
