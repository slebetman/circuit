import { getChartRef } from 'lib/chartRefs';
import { memo, FC, CSSProperties, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';

const labelFont: CSSProperties = {
	fontSize: '8px',
};

const nodeStyle: CSSProperties = {
	...labelFont,
	width: 'auto',
	border: '1px solid black',
	display: 'flex',
	flexDirection: 'column',
	gap: '2px',
	backgroundColor: '#fff',
};

const nodeLabelStyle: CSSProperties = {
	height: '15px',
	padding: '4px',
	textAlign: 'center',
};

const ioContainerStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	padding: '4px',
	borderTop: '1px solid #ccc',
	gap: '10px',
};

const ioGroupStyle: CSSProperties = {
	...labelFont,
	display: 'flex',
	flexDirection: 'column',
	gap: '0',
};

const ioStyle: CSSProperties = {
	height: '10px',
};

export type ModuleData = {
	label: string;
	type: string;
};

export type ModuleProps = {
	id: string;
	selected: boolean;
	data: ModuleData;
};

type IO = {
	label: string;
	id: string;
};

const Module: FC<ModuleProps> = ({ id, data, selected }) => {
	const [label, setLabel] = useState('');
	const [inputs, setInputs] = useState<IO[]>([]);
	const [outputs, setOutputs] = useState<IO[]>([]);

	const chart = getChartRef();

	useEffect(() => {
		setTimeout(() => {
			const m = chart?.modules?.find((x) => x.type === data.type);

			console.log(chart);

			if (m) {
				setInputs(
					m.nodes
						.filter((x) => x.type === 'in')
						.map((x) => ({
							label: x.data.label,
							id: x.id,
						})),
				);
				setOutputs(
					m.nodes
						.filter((x) => x.type === 'out')
						.map((x) => ({
							label: x.data.label,
							id: x.id,
						})),
				);
				setLabel(m.label);
			}
		}, 1);
	}, [chart, data.type]);

	return (
		<>
			{inputs.map((i, idx) => (
				<Handle
					type='target'
					id={`${id}_${i.id}`}
					key={i.id}
					position={Position.Left}
					style={{
						top: `${28 + idx * 10}px`,
					}}
				/>
			))}
			<div
				style={{
					...nodeStyle,
					borderWidth: selected ? '2px' : '1px',
					marginLeft: selected ? '-1px' : '0px',
				}}
			>
				<div style={nodeLabelStyle}>{label}</div>
				<div style={ioContainerStyle}>
					<div style={ioGroupStyle}>
						{inputs.map((i) => (
							<div style={{ ...ioStyle, textAlign: 'left' }}>
								{i.label}
							</div>
						))}
					</div>
					<div style={ioGroupStyle}>
						{outputs.map((o) => (
							<div style={{ ...ioStyle, textAlign: 'right' }}>
								{o.label}
							</div>
						))}
					</div>
				</div>
			</div>
			{outputs.map((o, idx) => (
				<Handle
					type='source'
					id={`${id}_${o.id}`}
					key={o.id}
					position={Position.Right}
					style={{
						top: `${28 + idx * 10}px`,
					}}
				/>
			))}
		</>
	);
};

export default memo(Module);
