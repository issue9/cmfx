// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import './style.css';

// TODO: safari 不支持 requestIdleCallback，后期可删除。
// https://caniuse.com/?search=requestIdleCallback
window.requestIdleCallback = window.requestIdleCallback || function (cb) {
    var start = Date.now();
    return setTimeout(function () {
        cb({
            didTimeout: false,
            timeRemaining: function () {
                return Math.max(0, 50 - (Date.now() - start));
            },
        });
    }, 1);
};

export * from './appbar';
export * from './avatar';
export * from './backtop';
export * from './badge';
export * from './color';
export * from './transition';
export * from './input';
export * from './base';
export * from './button';
export * from './card';
export * from './chart';
export * from './code';
export * from './context';
export * from './counter';
export * from './datetime';
export * from './dialog';
export * from './divider';
export * from './drawer';
export * from './form';
export * from './icon';
export * from './kit';
export * from './menu';
export * from './messages';
export * from './nav';
export * from './page';
export * from './pagination';
export * from './qrcode';
export * from './result';
export * from './search';
export * from './spin';
export * from './statistic';
export * from './settings';
export * from './tab';
export * from './table';
export * from './theme';
export * from './tooltip';
export * from './typography';
export * from './wizard';
