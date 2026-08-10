// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { createClipboardReader, createClipboardWriter, type State } from './clipboard';

describe('ClipboardWriter', async () => {
	// https://github.com/jsdom/jsdom/issues/1568
	// jsodm 本身不支持 clipboard，通过 userEvent 支持 clipboard
	userEvent.setup();

	test('no reset', async () => {
		let s: State | undefined;
		const w = createClipboardWriter(v => (s = v));

		await w.writeText('abc');
		expect(s).toEqual('ok');
	});

	test('reset', async () => {
		let s: State | undefined;
		const w = createClipboardWriter(v => (s = v), 500);

		await w.writeText('abc');
		expect(s).toEqual('ok');

		await sleep(600);
		expect(s).toEqual('pending');
	});
});

describe('ClipboardReader', async () => {
	// https://github.com/jsdom/jsdom/issues/1568
	// jsodm 本身不支持 clipboard，通过 userEvent 支持 clipboard
	userEvent.setup();

	const txt = 'abcd';

	test('no reset', async () => {
		await navigator.clipboard.writeText(txt);
		let s: State | undefined;
		const r = createClipboardReader(v => (s = v));

		expect(await r.readText()).toEqual(txt);
		expect(s).toEqual('ok');
	});

	test('reset', async () => {
		await navigator.clipboard.writeText(txt);
		let s: State | undefined;
		const r = createClipboardReader(v => (s = v), 500);

		expect(await r.readText()).toEqual(txt);
		expect(s).toEqual('ok');

		await sleep(600);
		expect(s).toEqual('pending');
	});
});
