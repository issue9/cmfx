// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps } from 'solid-js';
import { sleep, write2Clipboard } from '@cmfx/core';
import { render } from 'solid-js/web';
import IconOK from '~icons/material-symbols/check';
import IconError from '~icons/material-symbols/error';

import { transitionDuration } from '@/base';
import styles from './style.module.css';
import { useComponents } from '@/context';

let copy2ClipboardInst: typeof copy2Clipboard;

/**
 * 初始化剪切版环境
 */
export default function Clipboard(props: ParentProps): JSX.Element {
    const [, , opt] = useComponents();

    copy2ClipboardInst = async (target: HTMLElement, text: string): Promise<void> => {
        await write2Clipboard(text, async (ok?: boolean) => {
            const rect = target.getBoundingClientRect();

            const overlay = document.createElement('div');
            target.parentElement!.append(overlay); // 插在 body 之下，无法正常显示在弹出对象上。
            overlay.className = styles.overlay;
            overlay.style.top = `${rect.top}px`;
            overlay.style.left = `${rect.left}px`;
            overlay.style.width = `${rect.width}px`;
            overlay.style.height = `${rect.height}px`;
            overlay.style.color = ok ? 'var(--fg)' : 'var(--error-fg)';
            overlay.style.opacity = '0';

            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
            });

            render(() => ok ? <IconOK /> : <IconError />, overlay);

            await sleep(opt.stays);
            overlay.style.opacity = '0';
            await sleep(transitionDuration(target)); // 等待动画完成
            overlay.remove();
        });
    };

    return <>{props.children}</>; // NOTE: <></> 必须要有，否则不会初始化 copy2ClipboardInst？
}

/**
 * 复制内容到剪切版，并在 target 显示复制状态。
 *
 * @param target - 显示复制状态的对象，状态会显示在该对象之上，要求 target.parentElement 不能为空；
 * @param text - 复制的内容；
 */
export async function copy2Clipboard(target: HTMLElement, text: string): Promise<void> {
    return copy2ClipboardInst(target, text);
}
