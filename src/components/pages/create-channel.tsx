import { useEffect, useState } from "react";
import { createChannel, uploadPFP } from "@/lib/Appwrite";

const CreateChannel = ({ user, subscribedTo, likedTo, log, channel }: any) => {
    const [username, setUsername] = useState<string>("");
    const [pfp, setPfp] = useState<string>("");
    const [file, setFile] = useState<File>();
    
    return (
        <>
            <div className="flex flex-col w-2/3 h-fit">
                        
            </div>
        </>
    );
};

export default CreateChannel;