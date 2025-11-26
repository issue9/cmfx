// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import type {
    DurationFormat as DF, DurationFormatOptions as DFO, DurationInput as DI
} from '@formatjs/intl-durationformat/src/types';

// TODO: DurationFormat 上线之后可删除。
// https://caniuse.com/?search=durationformat
// https://github.com/microsoft/TypeScript/issues/60608
declare global {
    namespace Intl {
        type DurationFormat = DF;
        type DurationFormatOptions = DFO;
        type DurationInput = DI;
    }
}

export * from './api';
export * from './api/export';
export * from './clipboard';
export * from './config';
export * from './dom';
export * from './locale';
export * from './math';
export * from './time';
export * from './types';
export * from './validation';
