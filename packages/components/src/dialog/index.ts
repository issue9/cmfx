// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { AcceptButton, Actions, CancelButton } from './buttons';
import { useDialog } from './context';
import { Dialog as C } from './root';
import { alert, confirm, prompt } from './system';
import { Toolbar } from './toolbar';

export const Dialog = Object.assign(C, {
	alert,
	confirm,
	prompt,
	Toolbar,
	useDialog,
	AcceptButton,
	Actions,
	CancelButton,
});

export namespace Dialog {
	export type Ref = import('./context').DialogRef;
	export type Props = import('./root').DialogProps;

	export type State = import('./toolbar').DialogState;
	export type ToolbarProps = import('./toolbar').DialogToolbarProps;

	export type ActionsProps = import('./buttons').DialogActionsProps;
	export type ButtonProps = import('./buttons').DialogButtonProps;
}
