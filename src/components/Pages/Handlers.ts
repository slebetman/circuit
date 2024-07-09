import generateId from 'lib/generateId';
import { NextRouter } from 'next/router';
import { SetStateAction } from 'react';
import { Edge, Node, ReactFlowInstance } from 'reactflow';

type Setter<t> = (v: SetStateAction<t>) => void;

const handleNew =
	(
		stopSim: Function,
		setNodes: Setter<any>,
		setEdges: Setter<any>,
		router: NextRouter
	) =>
	() => {
		stopSim();
		setNodes([]);
		setEdges([]);
		router.replace('/');
	};

const handleSaveDialog = (setMode: Setter<any>) => () => {
	setMode('save');
};

const handleSave =
	(
		chart: any,
		router: NextRouter,
		setMode: Setter<any>,
		nodes: Node[],
		edges: Edge[],
		modules: any[]
	) =>
	(name: string) => {
		if (name) {
			chart.setName(name);
			chart.save({ nodes, edges, modules });
			router.replace(`/${name}`);
		}

		setMode('chart');
	};

const handleOpenFolder = (setMode: Setter<any>) => () => {
	setMode('open');
};

const handleSelectFile =
	(stopSim: Function, setMode: Setter<any>, router: NextRouter) =>
	(f: string) => {
		stopSim();
		setMode('chart');
		router.replace(`/${f}`);
	};

const handleCompile = (setCodeOpen: Setter<any>) => () => {
	setCodeOpen(true);
};

const handleSim =
	(startSim: Function, stopSim: Function) => (active: boolean) => {
		if (active) {
			startSim();
		} else {
			stopSim();
		}
	};

const handleCreateNode =
	(
		setNodes: Setter<Node<any, string | undefined>[]>,
		instance: ReactFlowInstance | null
	) =>
	(actionType: string) => {
		setNodes((prev) => {
			let data: Record<string, any> = {};

			switch (actionType) {
				case 'comment':
				case 'in':
				case 'out':
					data.label = actionType;
					break;
			}

			return [
				...prev,
				{
					id: `${generateId(instance)}`,
					type: actionType,
					data,
					position: {
						x: 0,
						y: 0,
					},
				},
			];
		});
	};

const handleTools =
	(setNodesPaletteOpen: Setter<any>, setModulesPaletteOpen: Setter<any>) =>
	(toolType: string) => {
		switch (toolType) {
			case 'nodes':
				return setNodesPaletteOpen(true);
			case 'modules':
				return setModulesPaletteOpen(true);
		}
	};

const handlers = {
	handleCompile,
	handleNew,
	handleOpenFolder,
	handleSave,
	handleSaveDialog,
	handleSelectFile,
	handleSim,
	handleCreateNode,
	handleTools,
};

export default handlers;
