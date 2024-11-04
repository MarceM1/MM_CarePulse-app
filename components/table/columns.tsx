"use client"

import { ColumnDef } from "@tanstack/react-table"

// import { MoreHorizontal } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import StatusBadge from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from "next/image"
import AppointmentModal from "../AppointmentModal"
import { Appointment } from "@/types/appwrite.types"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.



export const columns: ColumnDef<Appointment>[] = [

    {
        header: 'ID',
        cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
    },
    {
        accessorKey: 'patient',
        header: 'Patient',
        cell: ({ row }) => <p className="text-14-medium">{row.original.patient.name}</p>

    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="min-w-[115px]">
                <StatusBadge status={row.original.status} />
            </div>
        )
    },
    {
        accessorKey: "schedule",
        header: "Appointment",
        cell: ({ row }) => <p className="text-14-regular min-w-[100px]">
            {formatDateTime(row.original.schedule).dateTime}
        </p>


    },
    {
        accessorKey: "PrimaryPhysician",
        header: () => 'Doctor',
        cell: ({ row }) => {
            const doctor = Doctors.find((doc)=> doc.name === row.original.primaryPhysician)
            return (
                <div className="flex items-center gap-3">
                    <Image src={doctor.image}
                        alt={doctor.name}
                        width={100}
                        height={100}
                        className="size-8"
                    />
                    <p className="whitespace-nowrap">
                        Dr. {doctor?.name}
                    </p>
                </div>
            )
        }
    },
    {
        id: "actions",
				header: ()=> <div className="pl-4">Actions</div>,
        cell: ({ row:{original:data} }) => {
            

            return (
              <div className="flex gap-1">
								<AppointmentModal 
									type='schedule'
									patientId={data.patient.$id}
									userId={data.userId}
									appointment={data}
									// title='Schedule Appointment'
									// description='Please confirm the following details to schedule'
								/>
								<AppointmentModal 
									type='cancel'
									patientId={data.patient.$id}
									userId={data.userId}
									appointment={data}
									// title='Cancel Appointment'
									// description='Are yo sure you want to cancel this appointment?'
								/>
							</div>

                // <DropdownMenu>
                //     <DropdownMenuTrigger asChild>
                //         <Button variant="ghost" className="h-8 w-8 p-0">
                //             <span className="sr-only">Open menu</span>
                //             <MoreHorizontal className="h-4 w-4" />
                //         </Button>
                //     </DropdownMenuTrigger>
                //     <DropdownMenuContent align="end">
                //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
                //         <DropdownMenuItem
                //             onClick={() => navigator.clipboard.writeText(payment.id)}
                //         >
                //             Copy payment ID
                //         </DropdownMenuItem>
                //         <DropdownMenuSeparator />
                //         <DropdownMenuItem>View customer</DropdownMenuItem>
                //         <DropdownMenuItem>View payment details</DropdownMenuItem>
                //     </DropdownMenuContent>
                // </DropdownMenu>
            )
        },
    },
]
