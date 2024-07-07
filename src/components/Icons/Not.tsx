import { Icon } from './types';

const Not: Icon = ({ selected }) => (
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
		<g id='layer1'>
			<path id='rect1' d='M 8,17 24.292893,10 8,3 Z' />
			<path d='M 0,10.000639 H 8' id='path1-7' />
			<path d='M 29,10 H 35' id='path1-9' />
		</g>
		<path
			id='path1'
			d='M 29,10 A 2,2 0 0 1 27,12 2,2 0 0 1 25,10 2,2 0 0 1 27,8 2,2 0 0 1 29,10 Z'
		/>
	</svg>
);

export default Not;
