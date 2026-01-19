// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

export { ContextNotFoundError } from './errors';

export { presetOptions } from './options';
export type { Options } from './options';

export { useOptions } from './context';
export type { OptionsSetter } from './context';

export { LocaleProvider, useLocale } from './locale';
export type { Props as LocaleProps } from './locale';

export { ThemeProvider, useTheme } from './theme';
export type { Theme, Props as ThemeProps } from './theme';

export { copy2Clipboard } from './clipboard';

export { run } from './run';
