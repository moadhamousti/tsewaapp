import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"; // Add the import statement for Button
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";




const SignupForm = () => {
    const { toast } = useToast()
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    // const isPending = false;

    const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
    const { mutateAsync: signInAccount,  isPending: isSigninIn} = useSignInAccount();
    const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
        name: "",
        username: "",
        email: "",
        password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);

    if(!newUser) {
        return toast({
            title: "Sign up failed. Pleease try again."})        
    }

    const session = await signInAccount({
        email: values.email,
        password: values.password,
    })

    if(!session) {
        return toast({title:"Something went wrong with the login."});
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
        form.reset()
        navigate("/");
    }else {
        return toast({ title: 'Sign up failed. Please try again.' })
    }

  }

  return (
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" alt="logo" />

            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
            <p className="text-light-3 small-medium ms:base-regular mt-2">To use eWa App please enter your details</p>
        
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input type="text" className="shad-input" placeholder="Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input type="text" className="shad-input" autoComplete="username" placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input type="email" className="shad-input" placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input type="password" className="shad-input" autoComplete="current-password" placeholder="**********" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            <Button type="submit" className="animate-in slide-in-from-top shad-button_primary">
                {isCreatingAccount?(
                    <div className="flex-center gap-2">
                        <Loader/> Loading...
                    </div>
                ):"Sign up"}
            </Button>
            <p className="text-small-regular text-light-2 text-center mt-2">
                Already have an account?
                <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Log in</Link>
            </p>
            </form>
        </div>
      </Form>
  );
};

export default SignupForm;