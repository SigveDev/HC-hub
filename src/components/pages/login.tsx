import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants  } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-dvh">
            <div className="grid justify-center grid-cols-1 grid-rows-1 lg:w-1/3 md:w-2/4 sm:w-4/5 h-1/2 grid-gap-2">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="other">Other</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                    <Card className="p-4">
                      <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Log into HC Hub
                            </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="example@hcklikk.com" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Log in</Button>
                      </CardFooter>
                    </Card>
                    </TabsContent>
                    <TabsContent value="other">
                        <Card className="p-4">
                            <CardHeader>
                                <CardTitle>Other</CardTitle>
                                <CardDescription>
                                    Other methods to login
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <a href={import.meta.env.VITE_HC_AUTH_ENDPOINT} className={buttonVariants({ variant: "default" })}>HC Auth</a>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Login;