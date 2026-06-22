// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable } from '@cmfx/core';

import { API } from './api';
import { create } from './create';
import {
	Array2StringConverter,
	convert,
	Field,
	FieldProvider,
	Number2DateConverter,
	String2DateConverter,
	useField,
} from './field';
import { Button, Form as C, labelAlignments, Message, Reset, Submit, useForm } from './form';

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
});

export namespace Form {
	export type FieldAccessor<T> = import('./api').FormFieldAccessor<T>;
	export type Props<T extends Flattenable, R = unknown, P = never> = import('./form').FormProps<T, R, P>;
	export type Ref = import('./form').FormRef;
	export type LabelAlignment = import('./form').FormLabelAlignment;
	export type MessageProps = import('./form').FormMessageProps;
	export type FieldContext<T> = import('./field').FormFieldContext<T>;
	export type DataProps = import('./field').FormDataProps;
	export type FieldProps<T extends Flattenable> = import('./field').FormFieldProps<T>;
}
