"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
	Form,
	FormControl,
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import 'react-phone-number-input/style.css'
import SubmitButton from "../SubmitButton"
import { useEffect, useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes } from "@/constants"
import { RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"





const RegisterForm = ({ user }: { user: User }) => {

	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const form = useForm<z.infer<typeof PatientFormValidation>>({
		resolver: zodResolver(PatientFormValidation),
		defaultValues: {
			...PatientFormValidation,
			name: "",
			email: '',
			phone: ''
		},
	})


	const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
		console.log("Inicio de submit")
		console.log("errores de form:",  form.formState.errors);
		setIsLoading(true);

		// Store file info in form data as
		let formData;
		if (
			values.identificationDocument &&
			values.identificationDocument?.length > 0
		) {
			const blobFile = new Blob([values.identificationDocument[0]], {
				type: values.identificationDocument[0].type,
			});

			formData = new FormData();
			formData.append("blobFile", blobFile);
			formData.append("fileName", values.identificationDocument[0].name);
		}

		try {
			const patient = {
				userId: user.$id,
				name: values.name,
				email: values.email,
				phone: values.phone,
				birthDate: new Date(values.birthDate),
				gender: values.gender,
				address: values.address,
				occupation: values.occupation,
				emergencyContactName: values.emergencyContactName,
				emergencyContactNumber: values.emergencyContactNumber,
				primaryPhysician: values.primaryPhysician,
				insuranceProvider: values.insuranceProvider,
				insurancePolicyNumber: values.insurancePolicyNumber,
				allergies: values.allergies,
				currentMedication: values.currentMedication,
				familyMedicalHistory: values.familyMedicalHistory,
				pastMedicalHistory: values.pastMedicalHistory,
				identificationType: values.identificationType,
				identificationNumber: values.identificationNumber,
				identificationDocument: values.identificationDocument
					? formData
					: undefined,
				privacyConsent: values.privacyConsent,
				treatmentConsent: values.treatmentConsent,
				disclosureConsent: values.disclosureConsent,
			};

			const newPatient = await registerPatient(patient);

			if (newPatient) {
				router.push(`/patients/${user.$id}/new-appointment`);
			}
		} catch (error) {
			console.log(error);
		}

		setIsLoading(false);
	};
	useEffect(() => {
		console.log("Form error: ", form.formState.errors);
	}, [form.formState.errors]);
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
				<section className="space-y-4">
					<h1 className="header">Welcome!</h1>
					<p className="text-dark-700">Let us know more about yourself.</p>
				</section>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<p className="sub-header">Personal Information</p>
					</div>
				</section>

				<CustomFormField
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name='name'
					label="Full Name"
					placeholder='John Doe'
					iconSrc='/assets/icons/user.svg'
					iconAlt='user'
				/>

				<div className="flex flex-col gap-6 lg:flex-row">
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='email'
						label='Email'
						placeholder='johndoe@johndoe.com'
						iconSrc='/assets/icons/email.svg'
						iconAlt='email'
					/>

					<CustomFormField
						fieldType={FormFieldType.PHONE_INPUT}
						control={form.control}
						name='phone'
						label='Phone Number'
						placeholder='(555)123-4567'
						iconAlt='phone number'
					/>
				</div>

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.DATE_PICKER}
						control={form.control}
						name='birthDate'
						label='Date of Birth'
						placeholder='johndoe@johndoe.com'
						iconAlt='birthDate'
					/>

					<CustomFormField
						fieldType={FormFieldType.SKELETON}
						control={form.control}
						name='gender'
						label='Gender'
						iconAlt='gender'
						renderSkeleton={(field) => (
							<FormControl>
								<RadioGroup
									className="flex h-11 gap-6 xl:justify-between"
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									{GenderOptions.map((option) => (
										<div key={option} className="radio-group">
											<RadioGroupItem value={option} id={option} />
											<Label htmlFor={option} className="cursor-pointer">
												{option}
											</Label>
										</div>
									))}
								</RadioGroup>
							</FormControl>
						)}
					/>
				</div>

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='address'
						label='Address'
						placeholder='14th Street, New York'
					/>
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='occupation'
						label='Occupation'
						placeholder='Software Engineer'

					/>
				</div>

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='emergencyContactName'
						label='Emergency contact name'
						placeholder="Guardian's name"
					/>

					<CustomFormField
						fieldType={FormFieldType.PHONE_INPUT}
						control={form.control}
						name='emergencyContactNumber'
						label='Emergency contact number'
						placeholder='(555)123-4567'
					/>
				</div>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<p className="sub-header">Medical Information</p>
					</div>
				</section>
				<CustomFormField
					fieldType={FormFieldType.SELECT}
					control={form.control}
					name='primaryPhysician'
					label='Primary Physician'
					placeholder='Select a physician'
				>
					{Doctors.map((doctor) => (
						<SelectItem key={doctor.name} value={doctor.name}>
							<div className="flex cursor-pointer items-center gap-2">
								<Image src={doctor.image} alt={doctor.name} width={32} height={32} className="rounded-full border border-dark-500" />
								<p>{doctor.name}</p>
							</div>
						</SelectItem>
					))}
				</CustomFormField>

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='insuranceProvider'
						label='Insurance Provider'
						placeholder='BlueCross BlueShield'
					/>
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='insurancePolicyNumber'
						label='Insurance Policy Number'
						placeholder='ABC123456789'

					/>
				</div>

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name='allergies'
						label='Allergies (if any)'
						placeholder='Peanut, Penicilin, Pollen'
					/>
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name='currentMedication'
						label='Current medication (if any)'
						placeholder='Ibuprofen 200mg, Paracetamol 500mg'

					/>
				</div>

				<div className="flex flex-col gap-6 xl:flex-row">
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name='familyMedicalHistory'
						label='Family Medical History'
						placeholder='Mother had brain cancer, Father had heart disease'
					/>
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name='pastMedicalHistory'
						label='Past Medical History'
						placeholder='Appendectomy, Tonsillectomy'

					/>
				</div>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<p className="sub-header">Identification and Verification</p>
					</div>
				</section>
				<CustomFormField
					fieldType={FormFieldType.SELECT}
					control={form.control}
					name='identificationType'
					label='Identification type'
					placeholder='Select an identification type'
				>
					{IdentificationTypes.map((type) => (
						<SelectItem key={type} value={type}>
							{type}
						</SelectItem>
					))}
				</CustomFormField>

				<CustomFormField
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name='identificationNumber'
					label='Identification number'
					placeholder='123456789'

				/>
				<CustomFormField
					fieldType={FormFieldType.SKELETON}
					control={form.control}
					name='identificationDocument'
					label='Scanned copy of identification document'
					iconAlt='gender'
					renderSkeleton={(field) => (
						<FormControl>
							<FileUploader files={field.value} onChange={field.onChange} />
						</FormControl>
					)}
				/>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<p className="sub-header">Consent and Privacy</p>
					</div>
				</section>

				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name='treatmentConsent'
					label='I consent to treatment'
				/>
				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name='disclosureConsent'
					label='I consent to disclosure of information'
				/>
				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name='privacyConsent'
					label='I consent to privacy policy'
				/>

				<SubmitButton className="" isLoading={isLoading} >
					Get Started
				</SubmitButton>
			</form>
		</Form>
	)
}

export default RegisterForm