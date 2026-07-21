// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Component } from 'solid-js';

import type { Props } from './props';

const names = [
	'Error401',
	'Error402',
	'Error403',
	'Error404',
	'Error429',
	'Error500',
	'Error503',
	'Error504',
	'Bug',
	'Building',
	'Empty',
	'Login',
	'Offline',
] as const;

/**
 * 定义了当前包中每个插图集中必须包含的插图组件
 */
export type Gallery = Record<(typeof names)[number], Component<Props>>;
