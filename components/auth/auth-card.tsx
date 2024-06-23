import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import Socials from "./socilas"
import BackButton from "./back-button"


type AuthCardTypes = {
  children : React.ReactNode,
  CardTitles : string,
  backButtoHref : string,
  backButtonLabel : string,
  showSocials? : boolean
}

export const AuthCard = ({children, CardTitles, backButtoHref, backButtonLabel, showSocials} : AuthCardTypes) => {
  return (
    <div className="container mx-auto">
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>
            {CardTitles}
          </CardTitle>
          <CardDescription>Write Your Email and Password</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {showSocials && <CardFooter>
          <Socials/>
        </CardFooter>}
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtoHref}/>
        </CardFooter>
      </Card>
    </div>
  )
}

