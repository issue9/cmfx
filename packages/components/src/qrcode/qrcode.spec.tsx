// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import { expect, test, describe } from 'vitest';
import { sleep } from '@cmfx/core';

import { QRCode, Ref } from './qrcode';
import styles from './style.module.css';
import { Provider } from '@/context/context.spec';

describe('QRCode', async () => {
    test('qrcode', async () => {
        const { container, unmount } = render(() => <QRCode cornerDotType='square' errorCorrectionLevel='L' cornerSquareType='dots' value='123' />);
        const c = container.children.item(0)!;
        expect(c).toHaveClass(styles.qrcode);

        unmount();
    });

    test('ref', async () => {
        let ref: Ref;
        const { unmount } = render(() => <QRCode ref={el => ref = el} cornerDotType='square' errorCorrectionLevel='L' cornerSquareType='dots' value='123' />, {
            wrapper: Provider,
        });

        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.qrCodeStyling()).not.toBeUndefined();

        unmount();
    });
});
