import {

Link

} from "react-router-dom";


import Button
from "../components/ui/Button";



export default function NotFound(){


return(

<div className="
h-screen
flex
flex-col
items-center
justify-center
"


>


<h1 className="
text-7xl
font-bold
">

404

</h1>



<p className="
text-gray-500
my-5
">

Page not found

</p>



<Link to="/">


<Button>

Dashboard

</Button>


</Link>



</div>

)

}