// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, Description, Divider, fieldAccessor, joinClass, Mode, Page, RadioGroup, SchemeSelector, use as useC } from '@cmfx/components';
import { Locale, UnitStyle } from '@cmfx/core';
import { JSX, Show } from 'solid-js';
import IconFormat from '~icons/material-symbols/format-letter-spacing-2';
import IconPalette from '~icons/material-symbols/palette';
import IconSettings from '~icons/material-symbols/settings-night-sight';
import IconTranslate from '~icons/material-symbols/translate';

import { useLocale } from '@/context';
import styles from './style.module.css';

export function Settings(): JSX.Element {
    const [, act, opt] = useC();
    const l = useLocale();

    const modeFA = fieldAccessor<Mode>('mode', opt.mode ?? 'system');
    modeFA.onChange((m) => { act.switchMode(m); });

    const localeFA = fieldAccessor<string>('locale', l.match(Locale.languages()), false);
    localeFA.onChange((v) => { act.switchLocale(v); });

    const unitFA = fieldAccessor<UnitStyle>('unit', l.unitStyle);
    unitFA.onChange((v) => { act.switchUnitStyle(v); });

    return <Page title='_p.current.settings' class={ joinClass('max-w-sm', styles.settings) }>
        <Description icon={/*@once*/IconSettings} title={l.t('_p.settings.mode')!}>
            {l.t('_p.settings.modeDesc')! }
        </Description>

        <RadioGroup itemLayout='horizontal' accessor={modeFA} block={/*@once*/false}
            options={/*@once*/[
                ['system', l.t('_p.settings.system')],
                ['dark', l.t('_p.settings.dark')],
                ['light', l.t('_p.settings.light')]
            ]}
        />

        <Show when={opt.schemes && opt.scheme}>
            <Divider />

            <Description icon={/*@once*/IconPalette} title={l.t('_p.settings.color')!}>
                {l.t('_p.settings.colorDesc')! }
            </Description>

            <SchemeSelector schemes={opt.schemes!} value={opt.scheme!} onChange={(val)=> act.switchScheme(val)} />
        </Show>

        <Divider />

        <Description icon={/*@once*/IconTranslate} title={l.t('_p.settings.locale')!}>
            {l.t('_p.settings.localeDesc')! }
        </Description>

        <div class="w-60">
            <Choice accessor={localeFA} options={l.locales} />
        </div>

        <Divider />

        <Description icon={/*@once*/IconFormat} title={l.t('_p.settings.unitStyle')!}>
            {l.t('_p.settings.unitStyleDesc')! }
        </Description>

        <RadioGroup itemLayout='horizontal' accessor={unitFA} block={/*@once*/false} options={/*@once*/[
            ['narrow', l.t('_p.settings.narrow')],
            ['short', l.t('_p.settings.short')],
            ['full', l.t('_p.settings.long')],
        ]}/>

        <div class="ml-1 pl-2 border-l-2 border-palette-bg-low">
            <p>{ l.datetime(Date()) }</p>
            <p>{ l.duration(1111111223245) }</p>
            <p>{ l.bytes(1111223245) }</p>
        </div>
    </Page>;
}
