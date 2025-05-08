'use client'
import React from 'react'
import {z} from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import axios from "axios";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {assets} from "@/lib/importedFiles";
import {signIn} from "next-auth/react";


interface authProp{
    type: string
}

const SignUp: React.FC<authProp> = ({type}) => {
    const router = useRouter();

    const formSchema = z.object({
        name: z.string().trim().min(1, {message: "Name is required."}),
        email: z.string().email({message: "Invalid Email"}),
        password: z.string().trim().min(5, {message: "Password too short"}).max(20),
    })

    type formValues = z.infer<typeof formSchema>;

    const form = useForm<formValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const onsubmit = async (values: formValues) => {
        // signWithEmail(values);
        try {
            await axios.post("http://localhost:3000/api/auth/registration/", values).then((response) => {
                console.log("response", response)
                if(response.data.userId){
                    router.push('/');
                }
            })
        }
        catch (error){
            console.log('Error during submission', error);
        }
    }



  return (
    <div>
        {type && <h1>{type}</h1>}
        {type && <p>Create your Hope UI account.</p>}
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className='auth-form'>
            <FormField 
            control={form.control}
            name="name"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
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
            
            <Button type="submit">{type}</Button>
            <div>{type && <div><div>Already have an Account</div><a href='/signin'>Sign In</a></div>}</div>
            <div><Image src={assets.googlelogo} alt='googlelogo' width={25} height={25}></Image>
                <button onClick={() => signIn('google')}>Sign up with Google</button>
            </div>
        </form>
    </Form>
    </div>
  )
}

export default SignUp