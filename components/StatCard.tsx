import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

interface StatCardProps {
	type: 'appointment' | 'pending' | 'cancelled',
	count: number,
	label: string,
	icon: string
}

const StatCard = ({ type,
	count = 0,
	label,
	icon }: StatCardProps,) => {
	return (
		<div className={cn('stat-card', {
			'bg-appointments': type === 'appointment',
			'bg-pending': type === 'pending',
			'bg-cancelled': type === 'cancelled'
		})}>
			<div className="flex items-center gap-4">
				<Image src={icon} alt='label' width={32} height={32} className='size-8 w-fit'/>
			<h2 className="text-32-bold text-white">{count}</h2>			
			</div>
			<p className="text-14-regular">{label}</p>
		</div>
	)
}

export default StatCard