// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import { expect, test } from 'vitest';

import { Spin } from './spin';

test('preset', async () => {
    const { container, unmount } = render(() => <Spin>abc</Spin>);
    const c = container.children.item(0)!;

    expect(c).toHaveClass('c--spin');
    expect(c).toHaveTextContent('abc');
    expect(c).not.toHaveClass('palette--/');

    unmount();
});

test('spinning', async () => {
    const { container, unmount } = render(() => <Spin palette='primary' indicator='def' spinning={true}>abc</Spin>);
    const c = container.children.item(0)!;

    expect(c).toHaveClass('c--spin');
    expect(c).toHaveTextContent('abc');
    expect(c).toHaveClass('palette--primary');
    expect(c).toHaveAttribute('disabled');

    unmount();
});