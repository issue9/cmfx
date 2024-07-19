// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, Divider, FieldAccessor, Options, RadioGroup } from '@/components';
import { changeMode, changeScheme, Mode } from '@/core/theme';
import { Locale, locales, names } from '@/locales';
import { useApp } from './context';

// 预定义的颜色
const colors = [0, 48, 96, 144, 192, 240, 288, 336, 384, 432, 480];

export default function() {
    const ctx = useApp();

    const modeFA = FieldAccessor<Mode>('mode', 'system');
    modeFA.onChange((m) => {
        changeMode(m);
    });

    const colorFA = FieldAccessor<number|undefined>('color', undefined);
    colorFA.onChange((c) => {
        changeScheme(c!);
    });

    const localeFA = FieldAccessor<Array<Locale>>('locale', [locales[0]], false);
    localeFA.onChange((v) => { ctx.locale = v[0]; });

    const colorsOptions: Options<number> = [];
    colors.forEach((color)=>{
        colorsOptions.push([color, <ColorBlock color={color} />]);
    });

    return <div class="app-settings">
        <RadioGroup vertical accessor={modeFA}
            label={ <Label icon="settings_night_sight" title={ ctx.t('_internal.theme.mode')! } desc={ ctx.t('_internal.theme.modeDesc')! } /> }
            options={[
                ['system', <><span class="material-symbols-outlined mr-2">brightness_6</span>{ctx.t('_internal.theme.system')}</>],
                ['dark', <><span class="material-symbols-outlined mr-2">dark_mode</span>{ctx.t('_internal.theme.dark')}</>],
                ['light', <><span class="material-symbols-outlined mr-2">light_mode</span>{ctx.t('_internal.theme.light')}</>]
            ]}
        />

        <Divider />

        <RadioGroup accessor={colorFA} icon = {false} options={colorsOptions}
            label={ <Label icon="palette" title={ ctx.t('_internal.theme.color')! } desc={ ctx.t('_internal.theme.colorDesc')! } /> }
        />

        <Divider />

        <fieldset>
            <legend>
                <Label icon="translate" title={ ctx.t('_internal.locale.locale')! } desc={ ctx.t('_internal.locale.localeDesc')! } />
            </legend>
            <Choice accessor={localeFA} options={names} />
        </fieldset>
    </div>;
}

function Label(props: {icon: string, title: string, desc: string}) {
    return <div class="flex flex-col mb-1">
        <p class="icon-container"><span class="material-symbols-outlined mr-2">{ props.icon }</span>{props.title}</p>
        <span class="text-sm text-left">{props.desc}</span>
    </div>;
}

function ColorBlock(props: {color: number}) {
    return <span style={{
        'background-color': `hsl(${props.color} 50 50)`,
        width: '1rem',
        height: '1rem'
    }} />;
}
