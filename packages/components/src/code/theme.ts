// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { BundledTheme, ThemeRegistrationRaw } from 'shiki/bundle/full';

import styles from './style.module.css';

export type { BundledTheme };

// 定义了 shiki 的主题
export const shikiTheme: ThemeRegistrationRaw = {
	// 以下变量的定义来源于：
	// https://github.com/shikijs/shiki/blob/9260f3fd109eca7bece80c92196f627ccae202d0/packages/core/src/theme-css-variables.ts
	name: styles.shiki,
	bg: 'var(--palette-bg)',
	fg: 'var(--palette-fg)',
	settings: [
		{
			scope: [
				'keyword.operator.accessor',
				'meta.group.braces.round.function.arguments',
				'meta.template.expression',
				'markup.fenced_code meta.embedded.block',
			],
			settings: {
				foreground: 'var(--palette-fg)',
			},
		},
		{
			scope: 'emphasis',
			settings: {
				fontStyle: 'italic',
			},
		},
		{
			scope: ['strong', 'markup.heading.markdown', 'markup.bold.markdown'],
			settings: {
				fontStyle: 'bold',
			},
		},
		{
			scope: ['markup.italic.markdown'],
			settings: {
				fontStyle: 'italic',
			},
		},
		{
			scope: 'meta.link.inline.markdown',
			settings: {
				fontStyle: 'underline',
				foreground: 'var(--palette-2-fg)',
			},
		},
		{
			scope: ['string', 'markup.fenced_code', 'markup.inline'],
			settings: {
				foreground: 'var(--palette-2-fg-low)',
			},
		},
		{
			scope: ['comment', 'string.quoted.docstring.multi'],
			settings: {
				foreground: 'var(--palette-2-fg-high)',
			},
		},
		{
			scope: [
				'constant.numeric',
				'constant.language',
				'constant.other.placeholder',
				'constant.character.format.placeholder',
				'variable.language.this',
				'variable.other.object',
				'variable.other.class',
				'variable.other.constant',
				'meta.property-name',
				'meta.property-value',
				'support',
			],
			settings: {
				foreground: 'var(--palette-3-fg)',
			},
		},
		{
			scope: [
				'keyword',
				'storage.modifier',
				'storage.type',
				'storage.control.clojure',
				'entity.name.function.clojure',
				'entity.name.tag.yaml',
				'support.function.node',
				'support.type.property-name.json',
				'punctuation.separator.key-value',
				'punctuation.definition.template-expression',
			],
			settings: {
				foreground: 'var(--palette-3-fg-low)',
			},
		},
		{
			scope: 'variable.parameter.function',
			settings: {
				foreground: 'var(--palette-3-fg-high)',
			},
		},
		{
			scope: [
				'support.function',
				'entity.name.type',
				'entity.other.inherited-class',
				'meta.function-call',
				'meta.instance.constructor',
				'entity.other.attribute-name',
				'entity.name.function',
				'constant.keyword.clojure',
			],
			settings: {
				foreground: 'var(--palette-4-fg)',
			},
		},
		{
			scope: [
				'entity.name.tag',
				'string.quoted',
				'string.regexp',
				'string.interpolated',
				'string.template',
				'string.unquoted.plain.out.yaml',
				'keyword.other.template',
			],
			settings: {
				foreground: 'var(--palette-4-fg-low)',
			},
		},
		{
			scope: [
				'punctuation.definition.arguments',
				'punctuation.definition.dict',
				'punctuation.separator',
				'meta.function-call.arguments',
			],
			settings: {
				foreground: 'var(--palette-4-fg-high)',
			},
		},
		{
			// [Custom] Markdown links
			scope: ['markup.underline.link', 'punctuation.definition.metadata.markdown'],
			settings: {
				foreground: 'var(--palette-5-fg)',
			},
		},
		{
			// [Custom] Markdown list
			scope: ['beginning.punctuation.definition.list.markdown'],
			settings: {
				foreground: 'var(--palette-5-fg-low)',
			},
		},
		{
			// [Custom] Markdown punctuation definition brackets
			scope: [
				'punctuation.definition.string.begin.markdown',
				'punctuation.definition.string.end.markdown',
				'string.other.link.title.markdown',
				'string.other.link.description.markdown',
			],
			settings: {
				foreground: 'var(--palette-5-fg-high)',
			},
		},
		{
			// [Custom] Diff
			scope: ['markup.inserted', 'meta.diff.header.to-file', 'punctuation.definition.inserted'],
			settings: {
				foreground: 'var(--palette-fg)',
			},
		},
		{
			scope: ['markup.deleted', 'meta.diff.header.from-file', 'punctuation.definition.deleted'],
			settings: {
				foreground: 'var(--palette-fg-low)',
			},
		},
		{
			scope: ['markup.changed', 'punctuation.definition.changed'],
			settings: {
				foreground: 'var(--palette-fg-high)',
			},
		},
	],
};
