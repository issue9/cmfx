// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp, useOptions } from '@/app/context';
import { Choice, Description, Divider, FieldAccessor, Options, Page, RadioGroup } from '@/components';
import { Contrast, Mode, Scheme, Theme, UnitStyle } from '@/core';

export default function(): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();

    const modeFA = FieldAccessor<Mode>('mode', Theme.mode());
    modeFA.onChange((m) => { Theme.setMode(m); });

    const contrastFA = FieldAccessor<Contrast>('contrast', Theme.contrast());
    contrastFA.onChange((m) => { Theme.setContrast(m); });

    const schemesOptions: Options<number> = [];
    for (const s of opt.theme.schemes) {
        schemesOptions.push([s.primary, <ColorBlock s={s} />]);
    }
    const schemeFA = FieldAccessor<number>('scheme', Theme.scheme().primary);
    schemeFA.onChange((c) => {
        Theme.setScheme(opt.theme.schemes.find((s)=>s.primary===c)!);
    });

    const localeFA = FieldAccessor<string>('locale', ctx.locale().match(opt.locales.locales), false);
    localeFA.onChange((v) => { ctx.switchLocale(v); });

    const unitFA = FieldAccessor<UnitStyle>('unit', ctx.locale().unitStyle);
    unitFA.onChange((v) => { ctx.switchUnitStyle(v); });

    return <Page title='_i.page.current.settings' class="max-w-sm">
        <Description icon={/*@once*/'settings_night_sight'} title={ctx.locale().t('_i.theme.mode')!}>
            {ctx.locale().t('_i.theme.modeDesc')! }
        </Description>

        <RadioGroup accessor={modeFA} block={/*@once*/false}
            options={/*@once*/[
                ['system', ctx.locale().t('_i.theme.system')],
                ['dark', ctx.locale().t('_i.theme.dark')],
                ['light', ctx.locale().t('_i.theme.light')]
            ]}
        />

        <Divider />

        <Description icon={/*@once*/'contrast'} title={ctx.locale().t('_i.theme.contrast')!}>
            {ctx.locale().t('_i.theme.contrastDesc')! }
        </Description>

        <RadioGroup accessor={contrastFA} block={/*@once*/false}
            options={/*@once*/[
                ['more', ctx.locale().t('_i.theme.more')],
                ['nopreference', ctx.locale().t('_i.theme.nopreference')],
                ['less', ctx.locale().t('_i.theme.less')]
            ]}
        />

        <Divider />

        <Description icon={/*@once*/'palette'} title={ctx.locale().t('_i.theme.color')!}>
            {ctx.locale().t('_i.theme.colorDesc')! }
        </Description>

        <RadioGroup accessor={schemeFA} block={/*@once*/true} options={/*@once*/schemesOptions}/>

        <Divider />

        <Description icon={/*@once*/'translate'} title={ctx.locale().t('_i.locale.locale')!}>
            {ctx.locale().t('_i.locale.localeDesc')! }
        </Description>

        <div class="w-60">
            <Choice accessor={localeFA} options={ctx.locale().locales} />
        </div>

        <Divider />

        <Description icon={/*@once*/'format_letter_spacing_2'} title={ctx.locale().t('_i.locale.unitStyle')!}>
            {ctx.locale().t('_i.locale.unitStyleDesc')! }
        </Description>

        <RadioGroup accessor={unitFA} block={/*@once*/false} options={/*@once*/[
            ['narrow', ctx.locale().t('_i.locale.narrow')],
            ['short', ctx.locale().t('_i.locale.short')],
            ['full', ctx.locale().t('_i.locale.long')],
        ]}/>

        <div class="ml-1 pl-2 border-l-2 border-palette-bg-low">
            <p>{ ctx.locale().datetime(Date()) }</p>
            <p>{ ctx.locale().duration(1111111223245) }</p>
            <p>{ ctx.locale().bytes(1111223245) }</p>
        </div>
    </Page>;
}

function ColorBlock(props: {s: Scheme}) {
    // NOTE: 颜色的取值需与 core/theme/theme.css 中的设置相同。
    return <div class="flex flex-wrap w-10">
        <span class="w-5 h-5" style={{'background-color': `light-dark(lch(var(--invert-luminance-low) 50 ${props.s.primary}), lch(var(--luminance-low) 100 ${props.s.primary}))`}} />
        <span class="w-5 h-5" style={{'background-color': `light-dark(lch(var(--invert-luminance-low) 50 ${props.s.secondary}), lch(var(--luminance-low) 100 ${props.s.secondary}))`}} />
        <span class="w-5 h-5" style={{'background-color': `light-dark(lch(var(--invert-luminance-low) 50 ${props.s.tertiary}), lch(var(--luminance-low) 100 ${props.s.tertiary}))`}} />
        <span class="w-5 h-5" style={{'background-color': `light-dark(lch(var(--invert-luminance-low) 10 ${props.s.surface}), lch(var(--luminance-low) 100 ${props.s.surface}))`}} />
    </div>;
}
