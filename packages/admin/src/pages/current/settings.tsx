// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, Description, Divider, FieldAccessor, FieldOptions, Page, RadioGroup, use as useC } from '@cmfx/components';
import { Contrast, Locale, Mode, Scheme, UnitStyle } from '@cmfx/core';
import { JSX } from 'solid-js';

import { use, useLocale } from '@/context';

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

    return <Page title='_i.page.current.settings' class="max-w-sm p--settings">
        <Description icon={/*@once*/'settings_night_sight'} title={l.t('_i.theme.mode')!}>
            {l.t('_i.theme.modeDesc')! }
        </Description>

        <RadioGroup itemHorizontal accessor={modeFA} block={/*@once*/false}
            options={/*@once*/[
                ['system', l.t('_i.theme.system')],
                ['dark', l.t('_i.theme.dark')],
                ['light', l.t('_i.theme.light')]
            ]}
        />

        <Divider />

        <Description icon={/*@once*/'contrast'} title={l.t('_i.theme.contrast')!}>
            {l.t('_i.theme.contrastDesc')! }
        </Description>

        <RadioGroup itemHorizontal accessor={contrastFA} block={/*@once*/false}
            options={/*@once*/[
                ['more', l.t('_i.theme.more')],
                ['nopreference', l.t('_i.theme.nopreference')],
                ['less', l.t('_i.theme.less')]
            ]}
        />

        <Divider />

        <Description icon={/*@once*/'palette'} title={l.t('_i.theme.color')!}>
            {l.t('_i.theme.colorDesc')! }
        </Description>

        <RadioGroup itemHorizontal accessor={schemeFA} block={/*@once*/true} options={/*@once*/schemesOptions}/>

        <Divider />

        <Description icon={/*@once*/'translate'} title={l.t('_i.locale.locale')!}>
            {l.t('_i.locale.localeDesc')! }
        </Description>

        <div class="w-60">
            <Choice accessor={localeFA} options={l.locales} />
        </div>

        <Divider />

        <Description icon={/*@once*/'format_letter_spacing_2'} title={l.t('_i.locale.unitStyle')!}>
            {l.t('_i.locale.unitStyleDesc')! }
        </Description>

        <RadioGroup itemHorizontal accessor={unitFA} block={/*@once*/false} options={/*@once*/[
            ['narrow', l.t('_i.locale.narrow')],
            ['short', l.t('_i.locale.short')],
            ['full', l.t('_i.locale.long')],
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
    return <div class="color-block">
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .2 ${props.s.primary}), oklch(var(--l-low) .4 ${props.s.primary}))`}} />
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .2 ${props.s.secondary}), oklch(var(--l-low) .4 ${props.s.secondary}))`}} />
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .2 ${props.s.tertiary}), oklch(var(--l-low) .4 ${props.s.tertiary}))`}} />
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .1 ${props.s.surface}), oklch(var(--l-low) .3 ${props.s.surface}))`}} />
    </div>;
}
