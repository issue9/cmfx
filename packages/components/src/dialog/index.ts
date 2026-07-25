// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { AcceptButton, Actions, CancelButton, type DialogActionsProps, type DialogButtonProps } from './buttons';
import { type DialogRef, useDialog } from './context';
import { Dialog as C, type DialogProps } from './root';
import { alert, confirm, prompt } from './system';
import { type DialogState, type DialogToolbarProps, Toolbar } from './toolbar';

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
	export type Ref = DialogRef;
	export type Props = DialogProps;

	export type State = DialogState;
	export type ToolbarProps = DialogToolbarProps;

	export type ActionsProps = DialogActionsProps;
	export type ButtonProps = DialogButtonProps;
}
