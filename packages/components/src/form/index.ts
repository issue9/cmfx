// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable } from '@cmfx/core';

import { API, type FormFieldAccessor } from './api';
import { create } from './create';
import type { FormDataProps, FormFieldContext, FormFieldProps } from './field';
import {
	Array2StringConverter,
	convert,
	Field,
	FieldProvider,
	Number2DateConverter,
	String2DateConverter,
	useField,
} from './field';
import type { FormLabelAlignment, FormMessageProps, FormProps, FormRef } from './form';
import { Button, Form as C, labelAlignments, Message, Reset, Submit, useForm } from './form';
import { type FormPopoverProps, type FormPopoverRef, Popover } from './popover';

export const Form = Object.assign(C, {
	Button,
	Field,
	labelAlignments,
	Message,
	Reset,
	Submit,
	useForm,
	create,
	API,
	FieldProvider,
	useField,
	convert,
	Number2DateConverter,
	Array2StringConverter,
	String2DateConverter,
	Popover,
});

export namespace Form {
	export type FieldAccessor<T> = FormFieldAccessor<T>;
	export type Props<T extends Flattenable, R = unknown, P = never> = FormProps<T, R, P>;
	export type Ref = FormRef;
	export type LabelAlignment = FormLabelAlignment;
	export type MessageProps = FormMessageProps;
	export type FieldContext<T> = FormFieldContext<T>;
	export type DataProps = FormDataProps;
	export type FieldProps<T extends Flattenable> = FormFieldProps<T>;
	export type PopoverProps = FormPopoverProps;
	export type PopoverRef = FormPopoverRef;
}
