"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const formSchema = z.object({
    email: z.email().nonempty('email is required'),
    password: z.string().nonempty('password is required')
})
type FormData = z.infer<typeof formSchema>
export function LoginForm({ redirectURL }: { redirectURL?: string | null }) {
    const [isloading, setisloading] = useState(false);
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },

    })

    const router = useRouter()

    async function onSubmit(data: FormData) {

        setisloading(true)
        const response = await signIn("credentials", {
            email: data.email,
            password: data.password,
            callbackUrl: redirectURL?redirectURL:"/products",
            redirect: true,
        })
        if (response?.ok) {
            router.push("/products")
        }
        setisloading(false)

    }

    return (
        <Card className="w-full md:w-[50%] sm:max-w-md">
            <h2 className="mx-auto text-xl md:text-2xl font-semibold text-gray-800">Login</h2>

            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-email">
                                        email
                                    </FieldLabel>
                                    <Input

                                        {...field}
                                        type="email"
                                        id="form-rhf-demo-email"
                                        aria-invalid={fieldState.invalid}

                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-password">
                                        passwowrd
                                    </FieldLabel>
                                    <Input

                                        {...field}
                                        type="password"
                                        id="form-rhf-demo-password"
                                        aria-invalid={fieldState.invalid}

                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button disabled={isloading} className="bg-emerald-500 hover:bg-emerald-600" type="submit" form="form-rhf-demo">
                        {isloading && <div className="w-4 h-4 border-4 border-t-white border-r-transparent rounded-full animate-spin"></div>}
                        Submit
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}