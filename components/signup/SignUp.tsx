'use client'
import React, { useState } from 'react'
import {z} from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import axios from 'axios'


interface authProp{
    type: string
}

const SignUp: React.FC<authProp> = ({type}) => {

    const [accountID, setAccountID] = useState<string>("");

    const formSchema = z.object({
        firstname: z.string().trim().min(1, {message: "Required"}).max(50),
        lastname: z.string().trim().min(1, {message: "Required"}).max(50),
        email: z.string().email({message: "Invalid Email"}),
        contact: z.string().regex(/^\+?[1-9]\d{1,14}$/, {message: "Invalid contact number"}),
        password: z.string().trim().min(5, {message: "Password too short"}).max(20),
        confirmpassword: z.string().trim().min(5, {message: "Password too short"}).max(20)
    }).refine((data) => data.password === data.confirmpassword, {
        message: "Passwords don't match",
        path: ["confirmpassword"]
    });

    type formValues = z.infer<typeof formSchema>;

    const form = useForm<formValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            contact: "",
            password: "",
            confirmpassword: ""
        }
    })

    const onsubmit = async (values: formValues) => {
        // signWithEmail(values);
        const data = await axios.post("http://localhost:3000/api/signup", values, {
            headers: {
                'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT
            }
        }).then((resp) => resp.data).then((response) => {
            console.log('response', response)
            setAccountID(response.data);
        })
    }



  return (
    <div>
        {type && <h1>{type}</h1>}
        {type && <p>Create your Hope UI account.</p>}
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className='auth-form'>
            <FormField 
            control={form.control}
            name="firstname"
            render={({field}) => (
                <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <input {...field}/>
                    </FormControl>
                    <FormMessage />
                    {/* <FormDescription></FormDescription> */}
                </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="lastname"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <input {...field}/>
                    </FormControl>
                    <FormMessage />
                    {/* <FormDescription></FormDescription> */}
                </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="email"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <input {...field}/>
                    </FormControl>
                    <FormMessage />
                    {/* <FormDescription></FormDescription> */}
                </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="contact"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Contact No.</FormLabel>
                    <FormControl>
                        <input {...field}/>
                    </FormControl>
                    <FormMessage />
                    {/* <FormDescription></FormDescription> */}
                </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="password"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <input {...field}/>
                    </FormControl>
                    <FormMessage />
                    {/* <FormDescription></FormDescription> */}
                </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="confirmpassword"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                        <input {...field}/>
                    </FormControl>
                    <FormMessage />
                    {/* <FormDescription></FormDescription> */}
                </FormItem>
            )}
            />
            
            <Button type="submit">{type}</Button>
            <div>{type && <div><div>Already have an Account</div><Link href='/signin'>Sign In</Link></div>}</div>
        </form>
    </Form>
    </div>
  )
}

export default SignUp