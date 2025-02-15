import Responses from "./Responses";
import Messages from "./Messages";
import Status from "./Status";

function WhatsApp(){
    return (
        <div className="lg:flex">
            <Status/>
            <Responses/>
            {/* <Messages/> */}
        </div>
    )
}
export default WhatsApp;