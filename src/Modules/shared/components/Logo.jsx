import EventHubIcon from "../../../assets/EventHubIcon.png";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/myevents")} className="w-full text-left">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-5 border-b border-LineBox">
        <div className="w-7 h-7 shrink-0">
          <img
            className="h-full w-full object-contain"
            src={EventHubIcon}
            alt="EventHub Logo"
          />
        </div>
        <h1 className="hidden sm:block text-white font-jakarta font-black text-lg">
          EventHub
        </h1>
      </div>
    </button>
  );
};

export default Logo;
