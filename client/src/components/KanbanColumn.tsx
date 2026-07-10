import {

useDroppable

} from "@dnd-kit/core";


import TaskCard
from "./TaskCard";




export default function KanbanColumn({

id,

title,

tasks

}:any){



const {

setNodeRef

}=useDroppable({

id

});





return(

<div

ref={setNodeRef}


className="
bg-slate-100
rounded-xl
p-5
min-h-150
"

>


<div className="
flex
justify-between
mb-5
">


<h2 className="
font-bold
text-slate-700
">

{title}

</h2>



<span className="
bg-white
px-2
rounded
text-sm
">

{tasks.length}

</span>


</div>






{
    tasks.length===0

?

<p className="
text-gray-400
text-sm
">

No tasks

</p>

:


tasks.map(

(task:any)=>(


<TaskCard

key={task._id}

task={task}

/>


)

)


}



</div>


)

}