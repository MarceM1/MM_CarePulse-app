"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import 'react-phone-number-input/style.css'
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton'
}



const PatientForm = () => {

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      name: "",
      email: '',
      phone: ''
    },
  })


  async function onSubmit({ name, email, phone }: z.infer<typeof PatientFormValidation>) {
   console.log(name, email, phone)

    setIsLoading(true)

    try {
      //console.log("inicio del try en patientForm")

       const userData = {
         name, email, phone
       }

       //console.log("userData: ", userData)

       const user = await createUser(userData)

       //console.log("user: ", user)


      if(user) router.push(`/patients/${user.$id}/register`)

    } catch (error) {
      console.log('Error en onSubmit del PatientForm: ', error)
    } finally {
      setIsLoading(false)
    }

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there!</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='name'
          label='Fullname'
          placeholder='John Doe'
          iconSrc='/assets/icons/user.svg'
          iconAlt='user'
        />

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

        <SubmitButton className="" isLoading={isLoading} >
          Get Started
        </SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm