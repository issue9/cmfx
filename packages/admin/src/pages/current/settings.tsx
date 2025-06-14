// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, Contrast, Description, Divider, FieldAccessor, FieldOptions, joinClass, Mode, Page, RadioGroup, Scheme, use as useC } from '@cmfx/components';
import { Locale, UnitStyle } from '@cmfx/core';
import { JSX } from 'solid-js';
import IconContrast from '~icons/material-symbols/contrast';
import IconFormat from '~icons/material-symbols/format-letter-spacing-2';
import IconPalette from '~icons/material-symbols/palette';
import IconSettings from '~icons/material-symbols/settings-night-sight';
import IconTranslate from '~icons/material-symbols/translate';

import { use, useLocale } from '@/context';
import styles from './style.module.css';

export function Settings(): JSX.Element {
    const [, act, opt] = useC();
    const [, , o] = use();
    const l = useLocale();

    const modeFA = FieldAccessor<Mode>('mode', opt.mode);
    modeFA.onChange((m) => { act.switchMode(m); });

    const contrastFA = FieldAccessor<Contrast>('contrast', opt.contrast);
    contrastFA.onChange((m) => { act.switchContrast(m); });

    const schemesOptions: FieldOptions<number> = [];
    for (const s of o.theme.schemes) {
        schemesOptions.push([s.primary, <ColorBlock s={s} />]);
    }
    const schemeFA = FieldAccessor<number>('scheme', (typeof opt.scheme === 'number') ? opt.scheme : opt.scheme.primary);
    schemeFA.onChange((c) => {
        act.switchScheme(o.theme.schemes.find((s) => s.primary === c)!);
    });

    const localeFA = FieldAccessor<string>('locale', l.match(Locale.languages()), false);
    localeFA.onChange((v) => { act.switchLocale(v); });

    const unitFA = FieldAccessor<UnitStyle>('unit', l.unitStyle);
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

        <Divider />

        <Description icon={/*@once*/IconContrast} title={l.t('_p.settings.contrast')!}>
            {l.t('_p.settings.contrastDesc')! }
        </Description>

        <RadioGroup itemLayout='horizontal' accessor={contrastFA} block={/*@once*/false}
            options={/*@once*/[
                ['more', l.t('_p.settings.more')],
                ['nopreference', l.t('_p.settings.nopreference')],
                ['less', l.t('_p.settings.less')]
            ]}
        />

        <Divider />

        <Description icon={/*@once*/IconPalette} title={l.t('_p.settings.color')!}>
            {l.t('_p.settings.colorDesc')! }
        </Description>

        <RadioGroup itemLayout='horizontal' accessor={schemeFA} block={/*@once*/true} options={/*@once*/schemesOptions}/>

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

function ColorBlock(props: {s: Scheme}): JSX.Element {
    // NOTE: 颜色的取值需与 core/theme/theme.css 中的设置相同。
    return <div class={styles['color-block']}>
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .2 ${props.s.primary}), oklch(var(--l-low) .4 ${props.s.primary}))`}} />
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .2 ${props.s.secondary}), oklch(var(--l-low) .4 ${props.s.secondary}))`}} />
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .2 ${props.s.tertiary}), oklch(var(--l-low) .4 ${props.s.tertiary}))`}} />
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .1 ${props.s.surface}), oklch(var(--l-low) .3 ${props.s.surface}))`}} />
    </div>;
}
