import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {

loginApi,
registerApi

} from "../features/auth/authApi";


import {

setCredentials

} from "../features/auth/authSlice";


import {

useAppDispatch

} from "../hooks/redux";


import Input from "../components/ui/Input";

import Button from "../components/ui/Button";

import toast from "react-hot-toast";






export default function Auth(){


const dispatch =
useAppDispatch();


const navigate =
useNavigate();



const [mode,setMode] =
useState<"login" | "register">(
"login"
);



const [form,setForm] =
useState({

name:"",
email:"",
password:""

});






async function submit(e:any){


e.preventDefault();


try{


let data;



if(mode==="login"){



data =
await loginApi({

email:form.email,

password:form.password

});



toast.success(
"Welcome back 🚀"
);



}else{



data =
await registerApi(form);



toast.success(
"Account created 🎉"
);



}




dispatch(

setCredentials(data)

);



navigate("/");





}catch(err:any){



if(

mode==="login" &&

err.response?.status===404

){


toast.error(

"User not found. Please register first"

);



setMode(
"register"
);



return;


}




toast.error(

err.response?.data?.message

||

"Something went wrong"

);


}



}









return(

<div

className="
min-h-screen

bg-slate-100

flex
items-center
justify-center

px-5
"

>


<div

className="
w-full
max-w-md
"

>


<h1

className="
text-center
text-5xl
font-bold

mb-10

text-slate-900
"

>

FlowBoard

</h1>







<div

className="
bg-white

rounded-3xl

shadow-xl

p-8
"

>





<div

className="
grid
grid-cols-2

bg-gray-100

rounded-xl

p-1

mb-8
"

>



<button


onClick={()=>setMode("login")}


className={

`

py-3

rounded-lg

font-semibold

transition
cursor-pointer

${

mode==="login"

?

"bg-indigo-600 text-white shadow"

:

"text-gray-500"


}

`

}

>

Login

</button>






<button


onClick={()=>setMode("register")}


className={

`

py-3

rounded-lg

font-semibold

transition
cursor-pointer

${

mode==="register"

?

"bg-indigo-600 text-white shadow"

:

"text-gray-500"


}

`

}

>

Register

</button>



</div>









<form

onSubmit={submit}

className="
space-y-5
"

>



<h2

className="
text-3xl
font-bold
"

>

{

mode==="login"

?

"Welcome Back"

:

"Create Account"

}

</h2>





<p className="
text-gray-500
"

>


{

mode==="login"

?

"Continue your workspace"

:

"Start managing projects"

}


</p>









{

mode==="register"

&&


<Input

placeholder="Name"


value={form.name}


onChange={e=>

setForm({

...form,

name:e.target.value

})

}

/>

}






<Input

placeholder="Email"


value={form.email}


onChange={e=>

setForm({

...form,

email:e.target.value

})

}

/>








<Input

type="password"

placeholder="Password"


value={form.password}



onChange={e=>

setForm({

...form,

password:e.target.value

})

}

/>








<Button

className="
w-full
"

>


{

mode==="login"

?

"Login"

:

"Create Account"

}



</Button>




</form>





</div>



</div>


</div>

)


}