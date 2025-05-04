"use client"
import React from "react";
import {z} from "zod";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";

interface authProp{
    type: string
}


const Login: React.FC<authProp> = ({type}) => {
    const router = useRouter();

    const formSchema = z.object({
        email: z.string().email({message: "Invalid Email"}),
        password: z.string().trim().min(5, {message: "Password too short"}).max(20),
    })

    type formValues = z.infer<typeof formSchema>;

    const form = useForm<formValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onsubmit = async (values: formValues) => {
        const res = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password
        })
        console.log("res", res);

        if(res?.ok){
            router.push('/');
        }
        else{
            console.log('Invalid email or password');
        }
    }

    return (
        <div>
            {type && <h1>{type}</h1>}
            {type && <p>Login to stay connected.</p>}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)} className='auth-form'>
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
                    <div>{type && <div><div>Don’t have an account?</div><a href='/signup'> Click here to sign up.</a></div>}</div>
                </form>
            </Form>
        </div>
    )
}

export default Login;