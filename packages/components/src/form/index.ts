// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type FormContext, type FormField, type FormState, formStates } from '@cmfx/cdk';
import type { Flattenable } from '@cmfx/core';

import { create } from './create';
import type { FormFieldProps } from './field';
import {
	Array2StringConverter,
	convert,
	Field,
	IsolationField,
	Number2DateConverter,
	String2DateConverter,
	useField,
} from './field';
import type { FormInputProps, FormLabelAlignment, FormMessageProps, FormProps, FormRef } from './form';
import { Button, Form as C, labelAlignments, Message, Reset, Submit, useForm } from './form';
import { type FormPopoverProps, type FormPopoverRef, type FormPopoverType, formPopoverTypes, Popover } from './popover';

export const Form = Object.assign(C, {
	states: formStates,

	Button,
	Field,
	labelAlignments,
	Message,
	Reset,
	Submit,
	useForm,
	useField,
	create,
	convert,
	Number2DateConverter,
	Array2StringConverter,
	String2DateConverter,
	Popover,
	popoverTypes: formPopoverTypes,
	IsolationField,
});

export namespace Form {
	export type State = FormState;
	export type FieldAPI<T> = FormField<T>;
	export type Context<T extends Flattenable = Flattenable, R = unknown, P = never> = FormContext<T, R, P>;

	export type Props<T extends Flattenable, R = unknown, P = never> = FormProps<T, R, P>;
	export type Ref<T extends Flattenable, R = unknown, P = never> = FormRef<T, R, P>;
	export type LabelAlignment = FormLabelAlignment;
	export type MessageProps = FormMessageProps;

	export type InputProps = FormInputProps;
	export type FieldProps<T extends Flattenable> = FormFieldProps<T>;

	export type PopoverProps<T> = FormPopoverProps<T>;
	export type PopoverRef = FormPopoverRef;
	export type PopoverType = FormPopoverType;
}
