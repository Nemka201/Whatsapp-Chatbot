import Responses from "./Responses";
import Messages from "./Messages";
import Status from "./Status";
import Trips from "./Trips";

function WhatsApp() {
    return (
        <>
            <Status />
            <Responses />
            <Trips />
            {/* <Messages/> */}
        </>
    )
}
export default WhatsApp;