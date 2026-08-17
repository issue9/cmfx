// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

export type { Handler as HotkeyHandler } from './context';
export type { Modifier as ModifierKey, Modifiers as ModifierKeys } from './hotkey';
export { Hotkey, modifiers } from './hotkey';
export { HotkeyProvider, type HotkeyProviderProps, useHotkey } from './provider';
