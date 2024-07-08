import useChart, { useChartRefs } from 'hooks/useChart';
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

type ModuleData = {
	label: string;
	type: string;
};

type ModuleProps = {
	selected: boolean;
	data: ModuleData;
};

const Module: FC<ModuleProps> = ({ data, selected }) => {
	const [inputs, setInputs] = useState<string[]>([]);
	const [outputs, setOutputs] = useState<string[]>([]);

	const chart = useChartRefs();

	useEffect(() => {
		const m = chart?.modules?.find((x) => x.type === data.type);

		if (m) {
			setInputs(
				m.nodes.filter((x) => x.type === 'in').map((x) => x.data.label),
			);
			setOutputs(
				m.nodes
					.filter((x) => x.type === 'out')
					.map((x) => x.data.label),
			);
		}
	}, [chart, data.type]);

	return (
		<>
			{inputs.map((i, idx) => (
				<Handle
					type='target'
					id={`in${idx}`}
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
				<div style={nodeLabelStyle}>{data.label}</div>
				<div style={ioContainerStyle}>
					<div style={ioGroupStyle}>
						{inputs.map((i) => (
							<div style={ioStyle}>{i}</div>
						))}
					</div>
					<div style={ioGroupStyle}>
						{outputs.map((o) => (
							<div style={{ ...ioStyle, textAlign: 'right' }}>
								{o}
							</div>
						))}
					</div>
				</div>
			</div>
			{outputs.map((o, idx) => (
				<Handle
					type='source'
					id={`out${idx}`}
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
