// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { EditorComponent } from './root';

export const Editor = EditorComponent;

export namespace Editor {
	export type Ref = import('./root').EditorRef;
	export type Props = import('./root').EditorProps;
}
