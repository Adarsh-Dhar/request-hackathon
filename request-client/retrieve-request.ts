import { RequestNetwork,Types } from "@requestnetwork/request-client.js";
import { useAccount } from "wagmi";
import { useState } from "react";

export const getRequestData = () => {
    const [requests, setRequests] = useState<(Types.IRequestDataWithEvents | undefined)[]>();
    const  userAddress  = useAccount().toString();

    const fetchRequests = async () => {
        const requestClient = new RequestNetwork({
            nodeConnectionConfig: {
                baseURL: "https://sepolia.gateway.request.network/",
            },
        });

        try {
            const requests = await requestClient.fromIdentity({
                type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
                value: userAddress,
            });

            setRequests(requests.map((request) => request.getData()));
            console.log("requests ", requests)
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        }
    };

    return { requests, fetchRequests };
};