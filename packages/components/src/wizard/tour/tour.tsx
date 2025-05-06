// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, createMemo, createSignal } from 'solid-js';

import { BaseProps, Palette } from '@/base';
import { Button } from '@/button';
import { Dialog, DialogRef } from '@/dialog';
import { IconSymbol } from '@/icon';
import { Label } from '@/typography';
import { Step, Ref as WizardRef } from '@/wizard/step';

export interface Ref extends WizardRef {
    start(): void;
    complete(): void;
}

export interface Props extends BaseProps {
    /**
     * 指定所有教程步骤
     */
    steps: Array<Step>;

    /**
     * 突出元素的色盘
     */
    accentPalette?: Palette;

    /**
     * 第一个页面的开始按钮上的内容
     */
    start?: JSX.Element;

    /**
     * 最后一页的结束按钮上的内容
     */
    complete?: JSX.Element;

    /**
     * 上一页的按钮上的内容
     */
    prev?: JSX.Element;

    /**
     * 下一页的按钮上的内容
     */
    next?: JSX.Element;

    ref?: { (el: Ref): void; };
}

/**
 * 显示教程的组件
 */
export default function Tour(props: Props): JSX.Element {
    let ref: DialogRef;
    const [index, setIndex] = createSignal(0);
    const curr = createMemo(() => props.steps[index()]);

    const header = createMemo(() => {
        const s = index().toString() + '/' + props.steps.length.toString();
        if (curr().title) {
            return curr().title+'('+s+')';
        }
        return s;
    });

    if (props.ref) {
        props.ref({
            start: () => {
                setIndex(0);
                ref.showModal();
            },

            next: () => setIndex(index() + 1),

            prev: () => setIndex(index() - 1),

            complete: () => {
                setIndex(props.steps.length - 1);
                ref.close();
            }
        });
    }

    return <Dialog class="c--tour" ref={el => ref = el}
        header={<Label icon={(curr() && curr().icon && curr().icon !== true) ? curr().icon as IconSymbol : undefined}>{header()}</Label>}
        actions={<>
            {index() > 0 && <Button onClick={() => setIndex(index() - 1)}>{props.prev || '上一步'}</Button>}
            {index() < props.steps.length - 1 && <Button onClick={() => setIndex(index() + 1)}>{props.next || '下一步'}</Button>}
            {index() === props.steps.length - 1 && <Button onClick={() => ref.close()}>{props.complete || '完成'}</Button>}
        </>}
    >
        {curr()!.content}
    </Dialog>;
}