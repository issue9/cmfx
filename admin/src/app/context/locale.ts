// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import '@formatjs/intl-durationformat/polyfill';
import { match } from '@formatjs/intl-localematcher';
import prettyBytes from 'pretty-bytes';

import { Options as buildOptions } from '@/app/options';
import { API } from '@/core';
import { create } from '@/messages';

export function buildLocale(opt: Required<buildOptions>, api: API) {
    let locale = new Intl.Locale(navigator.language);

    const { reload, t } = create(opt.locales.fallback, opt.locales.messages);
    reload(locale.language);

    const dateFormater = new Intl.DateTimeFormat(locale, {timeStyle: 'short', dateStyle:'short'});

    const durationFormater = new (Intl as any).DurationFormat(locale, {
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
    });

    return {
        t,

        get locale(): Intl.Locale { return locale; },

        /**
         * 查找 locales 中与当前的语言最配的一个 ID，若是实在无法匹配，则返回 und。
         */
        match(locales: Array<string>) {
            return match([locale.toString()], locales, 'und');
        },

        /**
         * 切换本地化信息
         */
        switch(localeID: string) {
            locale = new Intl.Locale(localeID);
            document.documentElement.lang = this.locale.toString();
            reload(this.locale.language);
            api.locale = this.locale.toString();
        },

        /**
         * 返回支持的本地化列表
         */
        get locales() {
            const l = new Intl.DisplayNames(this.locale,{type:'language',languageDisplay:'dialect'});
            const loc = opt.locales.locales.map((id) => { return [id, l.of(id)] as [string, string]; });
            return loc;
        },

        /**
         * 返回本地化的时间
         * @param d 时间，如果是 number 类型，表示的是毫秒；
         * @returns 根据本地化格式的字符串
         */
        date(d?: Date | string | number): string {
            if (d === undefined) { return ''; }
            return dateFormater.format(new Date(d));
        },

        /**
         *返回本地化的时间区间
         */
        duration(val?: number | string): string {
            if (!val) { return ''; };
            return durationFormater.format({ nanoseconds: val });
        },

        /**
         * 返回本地化的字节数
         * @param bytes 需要格式化的字节数量
         * @param minimumFractionDigits 最小的精度，默认值为 3。
         */
        bytes(bytes: number, minimumFractionDigits?: number): string {
            return prettyBytes(bytes, { locale: locale.language, space: true, minimumFractionDigits });
        },
    };
}
