import { Icon } from './types';

const Or: Icon = ({ selected }) => (
	<svg
		width='35px'
		height='21px'
		viewBox='0 0 35 21'
		version='1.1'
		id='svg1'
		fill='#fff'
		stroke='#000'
		strokeWidth={selected ? 2 : 1}
	>
		<defs id='defs1' />
		<g id='layer1'>
			<path
				id='rect1'
				d='m 8,1 c 4,6 4,12 0,18 h 8 c 5,0 13,-5 13,-9 0,-4 -8,-9 -13,-9 z'
			/>
			<path d='M 0,6 H 10' id='path1' />
			<path d='M 0,15 H 10' id='path1-7' />
			<path d='M 29,10 H 35' id='path1-9' />
		</g>
	</svg>
);

export default Or;
