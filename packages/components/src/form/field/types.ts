// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { AvailableEnumType, BaseProps, Enums, Layout, Locale } from '@/base';

export interface Props extends BaseProps {
    title?: string;
    label?: JSX.Element;
    class?: string;
}

/**
 * 所有表单元素共有的属性
 */
export type FieldBaseProps = Props & {
    /**
     * 内容排版方式，一般会影响 label 与主体内容的排列。
     */
    layout?: Layout; 

    disabled?: boolean;
    readonly?: boolean;
    tabindex?: number;

    /**
     * 提示信息
     *
     * 该内容显示在 helpArea 区别。
     */
    help?: JSX.Element;
};

/**
 * 定义了 radio、choice 等选项类型中每个选择项的类型。
 *
 *  - 0 为选择项的值；
 *  - 1 为选择项对应的显示对象；
 *
 * @template K 表示的是选择项的值类型，要求唯一且可比较。
 */
export type Option<K extends AvailableEnumType> = [key: K, title: JSX.Element];

/**
 * 选择项的数据类型
 *
 * @template K 表示的是选择项的值类型，要求唯一且可比较。
 */
export type Options<T extends AvailableEnumType> = Array<Option<T>>;

/**
 * input 组件的 inputMode 属性的可选值
 */
export type InputMode = JSX.HTMLAttributes<HTMLElement>['inputMode'];

/**
 * input 组件的 autoComplete 属性
 *
 * https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
 */
export type AutoComplete = 'off' | 'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name'
    | 'honorific-suffix' | 'nickname' | 'organization-title' | 'username' | 'new-password' | 'current-password'
    | 'one-time-code' | 'organization' | 'street-address' | 'address-line1' | 'address-line2' | 'address-line3'
    | 'address-level' | 'address-level3' | 'address-level2' | 'address-level1' | 'country' | 'country-name'
    | 'postal-code' | 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' | 'cc-number' | 'cc-exp'
    | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount' | 'language'
    | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'url' | 'photo' | 'tel' | 'tel-country-code' | 'tel-national'
    | 'tel-area-code' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-extension' | 'email' | 'impp';


/**
 * 将枚举值转换成 {@link Options} 类型
 *
 * @template K 表示的是选择项的值类型，要求唯一且可比较。
 * @template T 枚举值对应名称的翻译 ID；
 */
export function translateEnums2Options<K extends string | number, T extends string = string>(e: Enums<K, T>, l: Locale): Options<K> {
    return e.map(v => [v[0], l.t(v[1])]);
}
