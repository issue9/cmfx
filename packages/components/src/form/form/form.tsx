// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Flattenable } from '@cmfx/core';
import { Component, createMemo, mergeProps, ParentProps } from 'solid-js';

import { BaseProps, joinClass, Layout } from '@/base';
import { Spin } from '@/spin';
import { CommonProps, FormProvider } from '@/form/field';
import { FormAPI, Options } from './api';
import styles from './style.module.css';

export interface Props extends BaseProps, CommonProps, ParentProps {
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

/**
 * 生成创建表单的相关功能
 *
 * @param options - 初始化参数；
 * @returns 返回元组，第一个元素为 {@link FormAPI}，第二个元素为 Form 组件；
 */
export function createForm<T extends Flattenable, R = never, P = never>(
    options: Options<T, R, P>
): [api: FormAPI<T, R, P>, Form: Component<Props>] {
    const api = new FormAPI<T, R, P>(options);

    const f = (props: Props) => {
        props = mergeProps(preset, props);

        const cls = createMemo(() => {
            return joinClass(
                undefined,
                styles.form,
                props.layout === 'vertical' ? 'flex-col' : '',
                props.class
            );
        });

        return <FormProvider layout={props.layout} hasHelp={props.hasHelp} rounded={props.rounded}
            disabled={props.disabled} readonly={props.readonly} labelAlign={props.labelAlign} labelWidth={props.labelWidth}
        >
            <Spin tag="form" spinning={api.submitting() || props.disabled}
                palette={props.palette} class={cls()} style={props.style} ref={el => {
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

    return [api, f];
}
