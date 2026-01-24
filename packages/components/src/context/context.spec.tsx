// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Config, sleep } from '@cmfx/core';
import { HashRouter } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { JSX, ParentProps } from 'solid-js';
import { afterAll, expect, test } from 'vitest';

import { BaseProps } from '@components/base';
import { schemes } from '@components/theme';
import { buildAccessor, OptionsProvider } from './context';
import { Options, requiredOptions } from './options';

// 提供用于测试的配置项
const options: Options = {
    config: new Config('admin', '', sessionStorage),
    logo: '../../../../apps/admin/public/brand-static.svg',
    systemDialog: false,
    systemNotify: false,
    scheme: 'green',
    schemes: new Map([['green', schemes.green], ['purple', schemes.purple]]),
    mode: 'dark',
    locale: 'zh-Hans',
    displayStyle: 'full',
    messages: { 'zh-Hans': [async () => (await import('@components/messages/zh-Hans.lang')).default] },
    title: 'title',
    titleSeparator: '-',
    pageSize: 20,
    pageSizes: [10, 20, 30],
    stays: 2000,
};

/**
 * 提供了一个用于测试的环境，包含了基础的环境配置。
 */
export function Provider(props: ParentProps) {
    const opt = requiredOptions(options);
    const Root = () => {
        return <OptionsProvider {...opt }>{props.children}</OptionsProvider>;
    };
    return <HashRouter root={Root}>{[]}</HashRouter>;
}

type Result = ReturnType<typeof render>;

/**
 * 提供了组件测试的基本功能
 *
 * @remarks
 * 该类提供了组件测试的基本功能，包括组件的渲染、卸载、以及一些常用的测试方法。
 * NOTE: 实例需要放在 describe 方法中。
 */
export class ComponentTester {
    readonly #component;
    readonly #result: Result;

    private constructor(component: string, result: Result) {
        this.#component = component;
        this.#result = result;
    }

    /**
     * 生成基本的组件测试环境
     * @param name - 组件名称，方便定位错误位置；
     * @param r - 生成组件的方法，需要将 props 传递给组件；
     * @param dur - 用于等待组件加载完成，默认为 500 毫秒。
     */
    static async build(name: string, r: { (props: BaseProps): JSX.Element; }, dur: number = 500): Promise<ComponentTester> {
        const props = { palette: 'primary', 'class': 'custom-cls', style: { '--custom-style': 'red' } } as const;
        const result = render(() => r(props), { wrapper: Provider });

        await sleep(dur); // Provider 是异步的，需要等待其完成加载。
        afterAll(result.unmount);

        return new ComponentTester(name, result);
    }

    /**
     * 获取由 {@link build} 方法生成的渲染结果
     */
    get result(): Result { return this.#result; }

    /**
     * 测试 {@link BaseProps} 是否正确附加在组件上
     *
     * @param root - 组件的根元素，如果未提供，则默认为第一个子元素。
     */
    testProps(root?: Element) {
        if (!root) {
            root = this.#result.container.firstElementChild!;
        }

        expect(
            root.classList.contains('palette--primary'),
            `组件 ${this.#component} 未通过基础属性测试：缺少 palette 'primary'`
        ).toBe(true);

        expect(
            root.classList.contains('custom-cls'),
            `组件 ${this.#component} 未通过基础属性测试：缺少 css 类 'custom-cls'`
        ).toBe(true);

        const style = window.getComputedStyle(root);
        expect(
            style.getPropertyValue('--custom-style'),
            `组件 ${this.#component} 未通过基础属性测试：缺少属性 --custom-style=red`
        ).toEqual('red');
    }
}

test('buildAccessor',  () => {
    const req = requiredOptions(options);
    const accessor = buildAccessor(req);
    expect(accessor).not.toBeUndefined();

    accessor.setTitle('t');
    expect(document.title, 't' + options.titleSeparator + options.title);
});
