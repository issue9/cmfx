// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { XDivider } from '@/components';
import { useApp } from './context';

export default function() {
    const ctx = useApp();

    return <div class="p-4 min-w-60">
        <XDivider pos='start'>
            <span class="material-symbols-outlined mr-2">settings_night_sight</span>{ ctx.t('_internal.theme.mode') }
        </XDivider>

        <div class="flex flex-col ml-2 mb-4">
            <label class="icon-container">
                <span class="material-symbols-outlined mr-2">dark_mode</span>
                <input type="radio" name="mode" value="dark" />
                {ctx.t('_internal.theme.dark')}
            </label>

            <label class="icon-container">
                <span class="material-symbols-outlined mr-2">light_mode</span>
                <input type="radio" name="mode" value="light" />
                {ctx.t('_internal.theme.light')}
            </label>

            <label class="icon-container">
                <span class="material-symbols-outlined mr-2">brightness_6</span>
                <input type="radio" name="mode" value="system" />
                {ctx.t('_internal.theme.system')}
            </label>
        </div>

        <XDivider pos='start'>
            <span class="material-symbols-outlined mr-2">palette</span>{ ctx.t('_internal.theme.primaryColor') }
        </XDivider>
        abc

        <XDivider pos='start'>
            <span class="material-symbols-outlined mr-2">translate</span>{ ctx.t('_internal.locale.locale') }
        </XDivider>
        abc
    </div >;
}
