import { Icon } from './types';

const Nor: Icon = ({ selected }) => (
	<svg
		width='35px'
		height='21px'
		viewBox='0 0 36 21'
		version='1.1'
		id='svg1'
		fill='#fff'
		stroke='#000'
		strokeWidth={selected ? 2 : 1}
	>
		<path
			id='rect1'
			d='m 8,1 c 4,6 4,12 0,18 h 8 c 5,0 13,-5 13,-9 0,-4 -8,-9 -13,-9 z'
		/>
		<path d='M 0,6 H 10' id='path1' />
		<path d='M 0,15 H 10' id='path1-7' />
		<path d='m 33,10 h 2' id='path1-9' />
		<path
			id='path1-2'
			d='m 33,10 a 2,2 0 0 1 -2,2 2,2 0 0 1 -2,-2 2,2 0 0 1 2,-2 2,2 0 0 1 2,2 z'
		/>
	</svg>
);

export default Nor;
