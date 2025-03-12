// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { BaseProps } from '@/components/base';

/**
 * 所有表单元素共有的属性
 */
export interface Props extends BaseProps {
    title?: string;

    label?: JSX.Element;
    disabled?: boolean;
    readonly?: boolean;
    accessKey?: string;
    tabindex?: number;

    class?: string;
    classList?: JSX.CustomAttributes<HTMLElement>['classList'];
};

/**
 * 表单字段标签的位置
 *
 * - top 在字段的上方；
 * - start 在字段的前方；
 */
export type LabelPos = 'start' | 'top';

/**
 * 定义了 radio、choice 等选项类型中每个选择项的类型。
 *
 * T 表示的是选择项的值类型，要求唯一且可比较。
 */
export type Option<T> = [T, JSX.Element];

/**
 * 选择项的数据类型
 */
export type Options<T> = Array<Option<T>>;

export type InputMode = JSX.HTMLAttributes<HTMLElement>['inputMode'];

// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
export type AutoComplete = 'off' | 'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name' | 'honorific-suffix' | 'nickname' | 'organization-title' | 'username' | 'new-password' | 'current-password' | 'one-time-code' | 'organization' | 'street-address' | 'address-line1' | 'address-line2' | 'address-line3' | 'address-level' | 'address-level3' | 'address-level2' | 'address-level1' | 'country' | 'country-name' | 'postal-code' | 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount' | 'language' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'url' | 'photo' | 'tel' | 'tel-country-code' | 'tel-national' | 'tel-area-code' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-extension' | 'email' | 'impp';
