// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { ConfirmButton, MountProps } from '@cmfx/components';
import IconTask from '~icons/material-symbols/task-alt';
import { Portal } from 'solid-js/web';

import { boolSelector,buttonKindSelector } from '../base';

export default function(props: MountProps) {
    const [kindS, kind] = buttonKindSelector();
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');

    return <div>
        <Portal mount={props.mount}>
            {kindS}
            {disabledS}
            {roundedS}
        </Portal>

        <div class="flex flex-wrap items-center gap-2">
            <ConfirmButton onclick={() => alert('confirm')} disabled={disabled()}
                rounded={rounded()} kind={kind()} palette='tertiary'>click</ConfirmButton>

            <ConfirmButton type='a' prompt={<p>点击确定之后将跳转到指定页面，取消则不跳转</p>} href='/'
                disabled={disabled()} rounded={rounded()} kind={kind()} palette='tertiary' ok={<><IconTask />OK</>}
                cancel='cancel'>anchor</ConfirmButton>

            <ConfirmButton type='a' prompt={<p>同时提供了 onclick 和 href</p>} href='/' disabled={disabled()}
                rounded={rounded()} kind={kind()} palette='tertiary' ok={<><IconTask />OK</>}
                onclick={() => alert('click')}
                cancel='cancel'>click+href</ConfirmButton>
        </div>
    </div>;
}
