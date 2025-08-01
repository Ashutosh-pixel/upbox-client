"use client"
import React from "react";
import {string, z} from "zod";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {signIn, useSession} from "next-auth/react";
import Image from "next/image";
import {assets} from "@/lib/importedFiles";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/redux/store";
import {setUser} from "@/lib/redux/slice/userSlice";

interface authProp{
    type: string
}


const Login: React.FC<authProp> = ({type}) => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const {data: session, status} = useSession();


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

        if(status === "authenticated" && session.provider === "credentials"){
            console.log('first', session)
            setUser(session.user)
        }
        
        //
        // if(res?.ok){
        //     router.push('/');
        // }
        // else{
        //     console.log('Invalid email or password');
        // }
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
                    <div><Image src={assets.googlelogo} alt='googlelogo' width={25} height={25}></Image>
                        <button onClick={() => signIn('google')}>Log in with Google</button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default Login;