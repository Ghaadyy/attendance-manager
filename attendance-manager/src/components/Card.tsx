import { Link } from "react-router-dom";

type CardProps = {
  actionName: string;
  actionPath: string;
  name: string;
  text: string;
};

function Card({ actionName, actionPath, name, text }: CardProps) {
  return (
    <div className="flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-lg transition">
      <div className="p-4 md:p-7">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="mt-2 text-gray-500">{text}</p>
        <Link
          className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
          to={actionPath}
        >
          {actionName}
          <svg
            className="flex-shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default Card;
