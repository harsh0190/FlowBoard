export default function Badge({

children,

type="default"

}:any){


return(

<span

className={`

px-3
py-1

rounded-full

text-xs
font-medium


${

type==="admin"

?

"bg-purple-100 text-purple-600"

:

"bg-blue-100 text-blue-600"

}

`}

>


{children}


</span>

)

}