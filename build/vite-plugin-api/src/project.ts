// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { type ModuledNode, type Node, Project, type TypeChecker } from 'ts-morph';

export interface EntryPoint {
	entrypoint: string;

	/**
	 * 用于查询项目内一些非公开的符号
	 */
	getSymbol: (name?: string) => Node | undefined;

	/**
	 * 所有导出成员的列表
	 */
	exports: ReturnType<ModuledNode['getExportedDeclarations']>;
}

export interface APIProject {
	/**
	 * 项目名称
	 */
	name: string;

	checker: TypeChecker;

	/**
	 * 各个入口文件以及与其对应的对象
	 */
	entrypoints: Map<string, EntryPoint>;
}

function newEntryPoint(root: string, prj: Project, entryPoint: string): EntryPoint {
	const outdir = prj.compilerOptions.get().outDir ?? path.join(root, 'lib');
	const dts = prj.addSourceFileAtPath(path.join(outdir, entryPoint));

	return {
		entrypoint: entryPoint,
		getSymbol: (name?: string) => (name ? (dts.getInterface(name) ?? dts.getTypeAlias(name)) : undefined),
		exports: dts.getExportedDeclarations(),
	};
}

export function newProject(root: string, entrypoints: Array<string>): APIProject {
	if (entrypoints.length === 0) {
		entrypoints = ['index.d.ts'];
	}

	const tsconfig = path.join(root, 'tsconfig.json');
	const morphPrj = new Project({
		tsConfigFilePath: tsconfig,
		skipAddingFilesFromTsConfig: true,
	});

	const prj: APIProject = {
		name: JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf-8')).name,
		checker: morphPrj.getTypeChecker(),
		entrypoints: new Map<string, EntryPoint>(),
	};

	for (const point of entrypoints) {
		if (!prj.entrypoints.has(point)) {
			prj.entrypoints.set(point, newEntryPoint(root, morphPrj, point));
		}
	}

	return prj;
}
