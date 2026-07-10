import { useAppSelector } from "../hooks/redux";

import Card from "../components/ui/Card";

export default function Profile() {
  const { user } = useAppSelector((s) => s.auth);

  return (
    <div>
      <h1
        className="
text-3xl
font-bold
mb-8
"
      >
        Profile
      </h1>

      <Card>
        <div
          className="
flex
items-center
gap-5
"
        >
          <div
            className="
w-20
h-20

rounded-full

bg-indigo-600

text-white

flex
items-center
justify-center

text-3xl
font-bold
"
          >
            {user?.name?.charAt(0)}
          </div>

          <div>
            <h2
              className="
text-2xl
font-bold
"
            >
              {user?.name}
            </h2>

            <p
              className="
text-gray-500
"
            >
              {user?.email}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
