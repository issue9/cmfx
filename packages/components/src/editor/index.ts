// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { EditorComponent, type EditorProps, type EditorRef } from './root';

export const Editor = EditorComponent;

export namespace Editor {
	export type Ref = EditorRef;
	export type Props = EditorProps;
}
