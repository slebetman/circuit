import { Module } from 'hooks/useChart';
import generateId from 'lib/generateId';
import { NextRouter } from 'next/router';
import { SetStateAction } from 'react';
import { Edge, Node, ReactFlowInstance } from 'reactflow';

type Setter<t> = (v: SetStateAction<t>) => void;

export const handleNew =
	(
		stopSim: Function,
		setNodes: Setter<any>,
		setEdges: Setter<any>,
		setModules: Setter<any>,
		router: NextRouter
	) =>
	() => {
		stopSim();
		setNodes([]);
		setEdges([]);
		setModules([]);
		router.replace('/');
	};

export const handleSaveDialog = (setMode: Setter<any>) => () => {
	setMode('save');
};

export const handleSave =
	(
		chart: any,
		router: NextRouter,
		setMode: Setter<any>,
		nodes: Node[],
		edges: Edge[],
		modules: any[]
	) =>
	async (name: string) => {
		if (name) {
			await chart.save(name, { nodes, edges, modules });
			router.replace(`/${name}`);
		}

		setMode('chart');
	};

export const handleOpenFolder = (setMode: Setter<any>) => () => {
	setMode('open');
};

export const handleSelectFile =
	(stopSim: Function, setMode: Setter<any>, router: NextRouter) =>
	(f: string) => {
		stopSim();
		setMode('chart');
		router.replace(`/${f}`);
	};

export const handleCompile = (setCodeOpen: Setter<any>) => () => {
	setCodeOpen(true);
};

export const handleSim =
	(startSim: Function, stopSim: Function) => (active: boolean) => {
		if (active) {
			startSim();
		} else {
			stopSim();
		}
	};

export const handleCreateNode =
	(
		setNodes: Setter<Node<any, string | undefined>[]>,
		instance: ReactFlowInstance | null
	) =>
	(actionType: string) => {
		const [type, moduleLabel, moduleType] = actionType.split(':');

		setNodes((prev) => {
			let data: Record<string, any> = {};

			switch (type) {
				case 'comment':
				case 'in':
				case 'out':
					data.label = type;
					break;
				case 'module':
					data.label = moduleLabel;
					data.type = moduleType;
					break;
			}

			return [
				...prev,
				{
					id: `${generateId(instance)}`,
					type,
					data,
					position: {
						x: 0,
						y: 0,
					},
				},
			];
		});
	};

export const handleTools =
	(setNodesPaletteOpen: Setter<any>, setModulesPaletteOpen: Setter<any>) =>
	(toolType: string) => {
		switch (toolType) {
			case 'nodes':
				return setNodesPaletteOpen(true);
			case 'modules':
				return setModulesPaletteOpen(true);
		}
	};

export const handleDeleteModule =
	(
		setModules: Setter<Module[]>,
		instance: ReactFlowInstance | null,
		nodes: Node[]
	) =>
	(type: string) => {
		setModules((prevModules) => {
			const newModules = prevModules.filter((x) => x.type !== type);
			return newModules;
		});
		instance?.deleteElements({
			nodes: nodes.filter(
				(x) => x.type === 'module' && x.data.type === type
			),
		});
	};
