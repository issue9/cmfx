// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { schemes, type ThemeProps } from '@cmfx/cdk';
import { Tester } from '@cmfx/cdk/testenv';
import { Config } from '@cmfx/core';
import { MemoryRouter } from '@solidjs/router';
import { renderHook, testEffect } from '@solidjs/testing-library';
import { createEffect, type JSX, type ParentProps, splitProps } from 'solid-js';
import { afterAll, describe, expect, test } from 'vitest';

import { buildAccessor, OptionsProvider, useOptions } from './context';
import { initEnv, type Options, type ReqOptions } from './options';

// 提供用于测试的配置项
const options: Options = {
	config: new Config('admin', '', sessionStorage),
	logo: '../../../../apps/admin/public/brand-static.svg',
	scheme: 'green',
	schemes: new Map([
		['green', schemes.green],
		['purple', schemes.purple],
	]),
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

export async function initTestEnv(): Promise<ReqOptions> {
	const [opt, complete] = initEnv(options);

	await testEffect(done => {
		createEffect(() => {
			if (complete()) {
				done();
			}
		});
	});

	return opt;
}

/**
 * 提供了一个用于测试的环境，包含了基础的环境配置。
 */
export function Provider(props: ParentProps<ReqOptions>): JSX.Element {
	const [, p] = splitProps(props, ['children']);
	const Root = () => <OptionsProvider {...p}>{props.children}</OptionsProvider>;
	return <MemoryRouter root={Root}>{[]}</MemoryRouter>;
}

/**
 * 生成基本的组件测试环境
 * @param name - 组件名称，方便定位错误位置；
 * @param r - 生成组件的方法，需要将 props 传递给组件；
 * @param dur - 用于等待组件加载完成，默认为 500 毫秒。
 *
 * @remarks
 * 该类提供了组件测试的基本功能，包括组件的渲染、卸载、以及一些常用的测试方法。
 * NOTE: 实例需要放在 describe 方法中。
 */
export async function createTester(
	name: string,
	r: (props: ThemeProps) => JSX.Element,
	dur: number = 500,
): Promise<Tester> {
	const o = await initTestEnv();
	return await Tester.build(name, r, props => <Provider {...o}>{props.children}</Provider>, dur);
}

test('buildAccessor', async () => {
	const req = await initTestEnv();
	const accessor = buildAccessor(req);
	expect(accessor).not.toBeUndefined();

	accessor.setTitle('t');
	expect(document.title, `t${options.titleSeparator}${options.title}`);
});

describe('useOptions', async () => {
	const o = await initTestEnv();
	const { result, cleanup } = renderHook(() => useOptions(), {
		wrapper: props => <Provider {...o}>{props.children}</Provider>,
	});

	test('get', async () => {
		expect(result).toBeDefined();
		expect(result[0].getDisplayStyle()).toEqual('full');
	});

	test('get/set', () => {
		expect(result[0].getStays()).toEqual(2000);
		result[0].setStays(500);
		expect(result[0].getStays()).toEqual(500);

		afterAll(cleanup);
	});

	afterAll(cleanup);
});
