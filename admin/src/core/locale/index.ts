// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import type { DurationFormat as DF, DurationFormatOptions as DFO, DurationInput as DI } from '@formatjs/intl-durationformat/src/types';

export type { Dict, Keys as DictKeys, Loader as DictLoader } from './dict';

export { Locale, unitStyles } from './locale';
export type { UnitStyle } from './locale';

// TODO: DurationFormat 上线之后可删除。
// https://caniuse.com/?search=durationformat
declare global {
    namespace Intl {
        type DurationFormat = DF;
        type DurationFormatOptions = DFO;
        type DurationInput = DI;
    }
}

