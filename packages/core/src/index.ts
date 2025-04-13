// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import type { DurationFormat as DF, DurationFormatOptions as DFO, DurationInput as DI } from '@formatjs/intl-durationformat/src/types';

// TODO: DurationFormat 上线之后可删除。
// https://caniuse.com/?search=durationformat
declare global {
    namespace Intl {
        type DurationFormat = DF;
        type DurationFormatOptions = DFO;
        type DurationInput = DI;
    }
}

export * from './api';
export * from './time';

