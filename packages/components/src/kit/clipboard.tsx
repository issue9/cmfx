// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep, write2Clipboard } from '@cmfx/core';
import { render } from 'solid-js/web';
import IconOK from '~icons/material-symbols/check';
import IconError from '~icons/material-symbols/error';

import { transitionDuration } from '@/base';
import styles from './style.module.css';

/**
 * 复制内容到剪切版，并在 target 显示复制状态。
 *
 * @param target 显示复制状态的对象，状态会显示在该对象之上，并会控制 target 的 opacity 属性让其暂时隐藏；
 * @param text 复制的内容；
 */
export async function copy2Clipboard(target: HTMLElement, text: string) {
    await write2Clipboard(text, async (ok?: boolean) => {
        const rect = target.getBoundingClientRect();

        const overlay = document.createElement('div');
        document.body.append(overlay);
        overlay.className = styles.copied;
        overlay.style.top = `${rect.top}px`;
        overlay.style.left = `${rect.left}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
        overlay.style.color = ok ? 'var(--primary-fg)' : 'var(--error-fg)';
        overlay.style.opacity = '0';

        target.style.transition = 'opacity var(--default-transition-duration) ease-in-out';

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            target.style.opacity = '0';
        });

        render(() => ok ? <IconOK /> : <IconError />, overlay);

        await sleep(2000);
        overlay.style.opacity = '0';
        target.style.opacity = '1';
        await sleep(transitionDuration(300));
        overlay.remove();
    });
}
