// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';
import { sleep } from '@cmfx/core';

import { Provider } from '@/context/context.spec';
import { Spin, Ref } from './spin';
import styles from './style.module.css';

describe(() => {
    test('preset', async () => {
        const { container, unmount } = render(() => <Spin>abc</Spin>);
        const c = container.children.item(0)!;

        expect(c).toHaveClass(styles.spin);
        expect(c).toHaveTextContent('abc');
        expect(c).not.toHaveClass('palette--/');

        unmount();
    });

    test('spinning', async () => {
        const { container, unmount } = render(() => <Spin palette='primary' indicator='def' spinning={true}>abc</Spin>);
        const c = container.children.item(0)!;

        expect(c).toHaveClass(styles.spin);
        expect(c).toHaveTextContent('abc');
        expect(c).toHaveClass('palette--primary');

        unmount();
    });

    test('basic ref', async () => {
        let ref: Ref;
        const { unmount } = render(() => <Spin ref={el => ref = el} />, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();

        unmount();
    });
});
