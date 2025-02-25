import Responses from "./Responses";
import Messages from "./Messages";
import Status from "./Status";
import Trips from "./Trips";

function WhatsApp() {
    return (
        <div className="container align-middle place-self-center">
            <Status />
            <Responses />
            <Trips />
            {/* <Messages/> */}
        </div>
    )
}
export default WhatsApp;