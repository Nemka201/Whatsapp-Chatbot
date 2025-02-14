import Responses from "./Responses";
import Messages from "./Messages";
import Status from "./Status";

function WhatsApp(){
    return (
        <div className="lg:flex">
            <Responses/>
            <Status/>
            {/* <Messages/> */}
        </div>
    )
}
export default WhatsApp;