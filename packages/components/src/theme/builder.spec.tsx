// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import { expect, test } from 'vitest';

import { palettes } from '@/base';
import { Provider } from '@/context/context.spec';
import SchemeBuilder from './builder';
import styles from './style.module.css';

test('SchemeBuilder', async () => {
    const { container, unmount } = render(() => <SchemeBuilder>abc</SchemeBuilder>, {
        wrapper: Provider,
    });
    await sleep(500); // Provider 是异步的，需要等待其完成加载。
    const c = container.children.item(0)!;
    expect(c).toHaveClass(styles.builder);
    expect(c.querySelectorAll('.'+styles.blocks)).toHaveLength(palettes.length);

    unmount();
});
